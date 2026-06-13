import type { CSSProperties } from "react";
import type { CollectibleConfig } from "../game/types";

export type FragmentLogItem = Pick<
  CollectibleConfig,
  "id" | "label" | "color" | "reward"
> & {
  collected: boolean;
};

type FragmentStyle = CSSProperties & {
  "--fragment-accent": string;
  "--fragment-index": number;
};

type Props = {
  collectedOrbs: number;
  fragmentLogItems: FragmentLogItem[];
  totalOrbs: number;
};

function getAccentColor([red, green, blue]: CollectibleConfig["color"]) {
  return `rgb(${red} ${green} ${blue})`;
}

export default function FragmentLog({
  collectedOrbs,
  fragmentLogItems,
  totalOrbs,
}: Props) {
  const fragmentLogComplete =
    fragmentLogItems.length > 0 &&
    fragmentLogItems.every((item) => item.collected);

  return (
    <section
      className={`fragment-log ${fragmentLogComplete ? "is-complete" : ""}`}
      aria-label="Signal fragment reward log"
    >
      <div className="fragment-log-header">
        <div>
          <p className="panel-label">Fragment Archive</p>
          <strong>
            {fragmentLogComplete ? "All evidence decrypted" : "Evidence slowly waking"}
          </strong>
        </div>
        <span className="fragment-log-count">
          {collectedOrbs}/{totalOrbs}
        </span>
      </div>

      <ul className="fragment-log-list">
        {fragmentLogItems.map((item, index) => {
          const fragmentStyle: FragmentStyle = {
            "--fragment-accent": getAccentColor(item.color),
            "--fragment-index": index,
          };

          return (
            <li
              key={item.id}
              className={`fragment-log-item ${
                item.collected ? "is-unlocked" : "is-locked"
              }`}
              style={fragmentStyle}
            >
              {item.collected ? (
                <>
                  <span className="fragment-log-kind">{item.reward.kind}</span>
                  <strong>{item.reward.title}</strong>
                  <p>{item.reward.description}</p>
                  <small>{item.label} signal restored</small>
                </>
              ) : (
                <>
                  <span className="fragment-log-kind">Encrypted</span>
                  <strong>{item.label} signal</strong>
                  <p>Signal residue detected. Contents still obscured.</p>
                  <small>Awaiting fragment lock</small>
                </>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
