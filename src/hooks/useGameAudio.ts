import { useCallback, useEffect, useRef, useState } from "react";

const audioPreferenceStorageKey = "signal-run-audio-enabled-v1";

type AudioWindow = Window &
  typeof globalThis & {
    webkitAudioContext?: typeof AudioContext;
  };

type AudioNodes = {
  context: AudioContext;
  effectsGain: GainNode;
  masterGain: GainNode;
  musicGain: GainNode;
};

function getAudioConstructor() {
  if (typeof window === "undefined") return null;

  const audioWindow = window as AudioWindow;
  return audioWindow.AudioContext ?? audioWindow.webkitAudioContext ?? null;
}

function loadAudioPreference() {
  try {
    return window.localStorage.getItem(audioPreferenceStorageKey) === "true";
  } catch {
    return false;
  }
}

function saveAudioPreference(enabled: boolean) {
  try {
    window.localStorage.setItem(audioPreferenceStorageKey, String(enabled));
  } catch {
    // Audio preference is best-effort browser state.
  }
}

function scheduleTone({
  context,
  destination,
  duration,
  frequency,
  peakGain,
  startTime,
  type = "sine",
}: {
  context: AudioContext;
  destination: AudioNode;
  duration: number;
  frequency: number;
  peakGain: number;
  startTime: number;
  type?: OscillatorType;
}) {
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  const endTime = startTime + duration;

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, startTime);
  gain.gain.setValueAtTime(0.0001, startTime);
  gain.gain.exponentialRampToValueAtTime(peakGain, startTime + 0.035);
  gain.gain.exponentialRampToValueAtTime(0.0001, endTime);

  oscillator.connect(gain);
  gain.connect(destination);
  oscillator.start(startTime);
  oscillator.stop(endTime + 0.02);
}

function scheduleSweep({
  context,
  destination,
  duration,
  from,
  peakGain,
  startTime,
  to,
}: {
  context: AudioContext;
  destination: AudioNode;
  duration: number;
  from: number;
  peakGain: number;
  startTime: number;
  to: number;
}) {
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  const endTime = startTime + duration;

  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(from, startTime);
  oscillator.frequency.exponentialRampToValueAtTime(to, endTime);
  gain.gain.setValueAtTime(0.0001, startTime);
  gain.gain.exponentialRampToValueAtTime(peakGain, startTime + 0.018);
  gain.gain.exponentialRampToValueAtTime(0.0001, endTime);

  oscillator.connect(gain);
  gain.connect(destination);
  oscillator.start(startTime);
  oscillator.stop(endTime + 0.02);
}

export function useGameAudio() {
  const [audioEnabled, setAudioEnabled] = useState(() => loadAudioPreference());
  const [audioSupported] = useState(() => Boolean(getAudioConstructor()));
  const audioEnabledRef = useRef(audioEnabled);
  const audioNodesRef = useRef<AudioNodes | null>(null);
  const ambientTimerRef = useRef<number | null>(null);
  const ambientStepRef = useRef(0);

  const stopAmbientLoop = useCallback(() => {
    if (ambientTimerRef.current === null) return;

    window.clearInterval(ambientTimerRef.current);
    ambientTimerRef.current = null;
  }, []);

  const ensureAudio = useCallback(() => {
    if (!audioSupported) return null;

    const existingNodes = audioNodesRef.current;
    if (existingNodes) {
      if (existingNodes.context.state === "suspended") {
        void existingNodes.context.resume().catch(() => undefined);
      }

      return existingNodes;
    }

    const AudioConstructor = getAudioConstructor();
    if (!AudioConstructor) return null;

    const context = new AudioConstructor();
    const masterGain = context.createGain();
    const musicGain = context.createGain();
    const effectsGain = context.createGain();

    masterGain.gain.value = 0.42;
    musicGain.gain.value = 0.055;
    effectsGain.gain.value = 0.22;
    musicGain.connect(masterGain);
    effectsGain.connect(masterGain);
    masterGain.connect(context.destination);

    const nodes = {
      context,
      effectsGain,
      masterGain,
      musicGain,
    };

    audioNodesRef.current = nodes;
    void context.resume().catch(() => undefined);

    return nodes;
  }, [audioSupported]);

  const scheduleAmbientPhrase = useCallback(() => {
    const nodes = audioNodesRef.current;
    if (!nodes || nodes.context.state === "closed") return;

    const notes = [146.83, 196, 246.94, 293.66, 329.63, 392];
    const step = ambientStepRef.current;
    const root = notes[step % notes.length];
    const fifth = notes[(step + 2) % notes.length];
    const startTime = nodes.context.currentTime + 0.04;

    scheduleTone({
      context: nodes.context,
      destination: nodes.musicGain,
      duration: 2.6,
      frequency: root,
      peakGain: 0.36,
      startTime,
      type: "triangle",
    });
    scheduleTone({
      context: nodes.context,
      destination: nodes.musicGain,
      duration: 2.1,
      frequency: fifth,
      peakGain: 0.2,
      startTime: startTime + 0.18,
      type: "sine",
    });

    ambientStepRef.current += 1;
  }, []);

  const startAmbientLoop = useCallback(() => {
    if (!audioEnabledRef.current || ambientTimerRef.current !== null) return;

    const nodes = ensureAudio();
    if (!nodes) return;

    scheduleAmbientPhrase();
    ambientTimerRef.current = window.setInterval(scheduleAmbientPhrase, 2800);
  }, [ensureAudio, scheduleAmbientPhrase]);

  const stopAudio = useCallback(() => {
    stopAmbientLoop();

    const nodes = audioNodesRef.current;
    audioNodesRef.current = null;

    if (!nodes || nodes.context.state === "closed") return;

    void nodes.context.close().catch(() => undefined);
  }, [stopAmbientLoop]);

  const setAudioPreference = useCallback(
    (enabled: boolean) => {
      audioEnabledRef.current = enabled;
      setAudioEnabled(enabled);
      saveAudioPreference(enabled);

      if (enabled) {
        startAmbientLoop();
        return;
      }

      stopAudio();
    },
    [startAmbientLoop, stopAudio]
  );

  const toggleAudio = useCallback(() => {
    if (!audioSupported) return;

    setAudioPreference(!audioEnabledRef.current);
  }, [audioSupported, setAudioPreference]);

  const enableAudio = useCallback(() => {
    if (!audioSupported) return;

    setAudioPreference(true);
  }, [audioSupported, setAudioPreference]);

  const playFragmentCollect = useCallback(() => {
    if (!audioEnabledRef.current) return;

    const nodes = ensureAudio();
    if (!nodes) return;

    const startTime = nodes.context.currentTime + 0.01;
    scheduleSweep({
      context: nodes.context,
      destination: nodes.effectsGain,
      duration: 0.16,
      from: 640,
      peakGain: 0.16,
      startTime,
      to: 1080,
    });
  }, [ensureAudio]);

  const playStationComplete = useCallback(() => {
    if (!audioEnabledRef.current) return;

    const nodes = ensureAudio();
    if (!nodes) return;

    const startTime = nodes.context.currentTime + 0.02;
    [392, 493.88, 659.25].forEach((frequency, index) => {
      scheduleTone({
        context: nodes.context,
        destination: nodes.effectsGain,
        duration: 0.32,
        frequency,
        peakGain: 0.17,
        startTime: startTime + index * 0.075,
        type: "sine",
      });
    });
  }, [ensureAudio]);

  const playRunComplete = useCallback(() => {
    if (!audioEnabledRef.current) return;

    const nodes = ensureAudio();
    if (!nodes) return;

    const startTime = nodes.context.currentTime + 0.02;
    [392, 523.25, 659.25, 783.99, 1046.5].forEach((frequency, index) => {
      scheduleTone({
        context: nodes.context,
        destination: nodes.effectsGain,
        duration: index === 4 ? 0.72 : 0.42,
        frequency,
        peakGain: index === 4 ? 0.2 : 0.16,
        startTime: startTime + index * 0.09,
        type: index === 4 ? "triangle" : "sine",
      });
    });
  }, [ensureAudio]);

  useEffect(() => {
    audioEnabledRef.current = audioEnabled;

    if (!audioEnabled || !audioSupported) {
      stopAudio();
      return;
    }

    const unlockAudio = () => {
      startAmbientLoop();
    };

    window.addEventListener("pointerdown", unlockAudio, { once: true });
    window.addEventListener("keydown", unlockAudio, { once: true });

    return () => {
      window.removeEventListener("pointerdown", unlockAudio);
      window.removeEventListener("keydown", unlockAudio);
    };
  }, [audioEnabled, audioSupported, startAmbientLoop, stopAudio]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      const nodes = audioNodesRef.current;
      if (!audioEnabledRef.current || !nodes) return;

      if (document.hidden) {
        stopAmbientLoop();
        void nodes.context.suspend().catch(() => undefined);
        return;
      }

      startAmbientLoop();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [startAmbientLoop, stopAmbientLoop]);

  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, [stopAudio]);

  return {
    audioEnabled,
    audioSupported,
    enableAudio,
    playFragmentCollect,
    playRunComplete,
    playStationComplete,
    toggleAudio,
  };
}
