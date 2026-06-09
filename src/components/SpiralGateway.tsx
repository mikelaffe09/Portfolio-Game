import { SpiralAnimation } from "@/components/ui/spiral-animation";

type Props = {
  allComplete: boolean;
  nextStationTitle: string;
  progressPercent: number;
  reducedMotion: boolean;
  onEnterHub: () => void;
  onOpenRecruiterScan: () => void;
};

export default function SpiralGateway({
  allComplete,
  nextStationTitle,
  progressPercent,
  reducedMotion,
  onEnterHub,
  onOpenRecruiterScan,
}: Props) {
  return (
    <section className="spiral-gateway" aria-labelledby="spiral-gateway-title">
      <div className="spiral-gateway-visual">
        <SpiralAnimation reducedMotion={reducedMotion} />
      </div>

      <div className="spiral-gateway-content">
        <p className="panel-label">Launch Sequence</p>
        <h2 id="spiral-gateway-title">Mike Allaffi Developer Portfolio</h2>
        <p>
          Explore Mike's projects, skills, experience, and contact details
          through the playable hub, or open the recruiter scan for a faster
          traditional review.
        </p>

        <dl className="spiral-gateway-stats" aria-label="Portfolio run status">
          <div>
            <dt>Progress</dt>
            <dd>{progressPercent}%</dd>
          </div>
          <div>
            <dt>{allComplete ? "Status" : "Next Zone"}</dt>
            <dd>{allComplete ? "Complete" : nextStationTitle}</dd>
          </div>
        </dl>

        <div className="spiral-gateway-actions">
          <button type="button" onClick={onEnterHub}>
            Enter Hub
          </button>
          <button type="button" onClick={onOpenRecruiterScan}>
            Recruiter Scan
          </button>
        </div>
      </div>
    </section>
  );
}
