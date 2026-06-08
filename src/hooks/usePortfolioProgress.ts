import { useCallback, useEffect, useMemo, useState } from "react";
import {
  portfolioSectionById,
  stationOrder,
  type PortfolioSection,
  type StationId,
} from "../data/portfolioData";

const legacyCompletedStationsStorageKey = "signal-run-completed-stations";
const completedStationsStorageKey = "signal-run-completed-stations-v2";
const recruiterModeStorageKey = "signal-run-recruiter-mode";

export type StationProgressItem = {
  section: PortfolioSection;
  index: number;
  completed: boolean;
  unlocked: boolean;
};

export type SectionOpenResult =
  | {
      ok: true;
      newlyCompleted: boolean;
      allComplete: boolean;
    }
  | {
      ok: false;
      reason: string;
      blockingSectionTitle: string | null;
    };

function isStationId(value: string): value is StationId {
  return stationOrder.includes(value as StationId);
}

function parseCompletedStations(savedValue: string | null, isLegacyValue = false) {
  if (!savedValue) return new Set<StationId>();

  const savedIds = JSON.parse(savedValue);
  if (!Array.isArray(savedIds)) return new Set<StationId>();

  const completedStations = new Set<StationId>(
    savedIds.filter((id): id is StationId => {
      return typeof id === "string" && isStationId(id);
    })
  );

  if (
    isLegacyValue &&
    stationOrder.every((sectionId) => completedStations.has(sectionId))
  ) {
    return new Set<StationId>();
  }

  return completedStations;
}

function loadCompletedStations() {
  try {
    const savedValue = window.localStorage.getItem(completedStationsStorageKey);
    if (savedValue) return parseCompletedStations(savedValue);

    return parseCompletedStations(
      window.localStorage.getItem(legacyCompletedStationsStorageKey),
      true
    );
  } catch {
    return new Set<StationId>();
  }
}

function loadRecruiterModePreference() {
  try {
    return window.localStorage.getItem(recruiterModeStorageKey) === "true";
  } catch {
    return false;
  }
}

function isProgressionUnlocked(
  sectionId: StationId,
  completedStations: Set<StationId>
) {
  const sectionIndex = stationOrder.indexOf(sectionId);

  return stationOrder
    .slice(0, sectionIndex)
    .every((previousSectionId) => completedStations.has(previousSectionId));
}

function getBlockingSection(
  sectionId: StationId,
  completedStations: Set<StationId>
) {
  const sectionIndex = stationOrder.indexOf(sectionId);
  const blockingSectionId =
    stationOrder
      .slice(0, sectionIndex)
      .find((previousSectionId) => !completedStations.has(previousSectionId)) ??
    null;

  return blockingSectionId ? portfolioSectionById[blockingSectionId] : null;
}

export function usePortfolioProgress() {
  const [completedIds, setCompletedIds] = useState<Set<StationId>>(
    () => loadCompletedStations()
  );
  const [recruiterMode, setRecruiterMode] = useState(
    () => loadRecruiterModePreference()
  );
  const [fullPortfolioUnlocked, setFullPortfolioUnlocked] = useState(
    () => loadRecruiterModePreference()
  );

  useEffect(() => {
    try {
      window.localStorage.setItem(
        completedStationsStorageKey,
        JSON.stringify([...completedIds])
      );
    } catch {
      // Progress persistence is a nice-to-have; the game should still work.
    }
  }, [completedIds]);

  useEffect(() => {
    try {
      window.localStorage.setItem(recruiterModeStorageKey, String(recruiterMode));
    } catch {
      // Recruiter mode is optional UI preference state.
    }
  }, [recruiterMode]);

  const completedCount = completedIds.size;
  const totalStations = stationOrder.length;
  const progressPercent = Math.round((completedCount / totalStations) * 100);
  const allStationsComplete = completedCount === totalStations;

  const nextStationId = useMemo(() => {
    return stationOrder.find((id) => !completedIds.has(id)) ?? null;
  }, [completedIds]);

  const nextStation = nextStationId ? portfolioSectionById[nextStationId] : null;

  const isUnlocked = useCallback(
    (sectionId: StationId) => {
      return (
        fullPortfolioUnlocked ||
        isProgressionUnlocked(sectionId, completedIds)
      );
    },
    [completedIds, fullPortfolioUnlocked]
  );

  const completedIdList = useMemo(() => [...completedIds], [completedIds]);

  const unlockedIdList = useMemo(() => {
    return stationOrder.filter((id) => isUnlocked(id));
  }, [isUnlocked]);

  const stationProgress = useMemo<StationProgressItem[]>(() => {
    return stationOrder.map((sectionId, index) => {
      return {
        section: portfolioSectionById[sectionId],
        index,
        completed: completedIds.has(sectionId),
        unlocked: isUnlocked(sectionId),
      };
    });
  }, [completedIds, isUnlocked]);

  const requestSectionOpen = useCallback(
    (sectionId: StationId): SectionOpenResult => {
      const progressionUnlocked = isProgressionUnlocked(sectionId, completedIds);
      const openable = fullPortfolioUnlocked || progressionUnlocked;

      if (!openable) {
        const blockingSection = getBlockingSection(sectionId, completedIds);

        return {
          ok: false,
          blockingSectionTitle: blockingSection?.title ?? null,
          reason: blockingSection
            ? `Complete ${blockingSection.title} first to unlock ${portfolioSectionById[sectionId].title}.`
            : `${portfolioSectionById[sectionId].title} is locked for now.`,
        };
      }

      const newlyCompleted = !completedIds.has(sectionId);
      const nextCompletedCount = newlyCompleted
        ? completedCount + 1
        : completedCount;

      if (newlyCompleted) {
        setCompletedIds((previous) => {
          if (previous.has(sectionId)) return previous;

          if (
            !fullPortfolioUnlocked &&
            !isProgressionUnlocked(sectionId, previous)
          ) {
            return previous;
          }

          const next = new Set(previous);
          next.add(sectionId);
          return next;
        });
      }

      return {
        ok: true,
        newlyCompleted,
        allComplete: nextCompletedCount === totalStations,
      };
    },
    [completedCount, completedIds, fullPortfolioUnlocked, totalStations]
  );

  const unlockFullPortfolio = useCallback(() => {
    setFullPortfolioUnlocked(true);
  }, []);

  const toggleRecruiterMode = useCallback(() => {
    setRecruiterMode((previous) => {
      const next = !previous;
      if (next) setFullPortfolioUnlocked(true);
      return next;
    });
  }, []);

  const enableRecruiterMode = useCallback(() => {
    setRecruiterMode(true);
    setFullPortfolioUnlocked(true);
  }, []);

  return {
    allStationsComplete,
    completedCount,
    completedIdList,
    fullPortfolioUnlocked,
    isUnlocked,
    nextStation,
    progressPercent,
    recruiterMode,
    requestSectionOpen,
    stationProgress,
    totalStations,
    toggleRecruiterMode,
    enableRecruiterMode,
    unlockFullPortfolio,
    unlockedIdList,
  };
}
