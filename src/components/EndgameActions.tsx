import { portfolioProfile } from "../data/portfolioData";

type Props = {
  visible: boolean;
  onOpenContact: () => void;
  onReviewBestProjects: () => void;
  onViewResumeView: () => void;
};

const resumeMethod = portfolioProfile.contactMethods.find(
  (method) => method.id === "resume"
);

export default function EndgameActions({
  visible,
  onOpenContact,
  onReviewBestProjects,
  onViewResumeView,
}: Props) {
  if (!visible) return null;

  return (
    <section className="endgame-actions" aria-labelledby="endgame-actions-title">
      <div className="endgame-copy">
        <p className="panel-label">Endgame Unlocked</p>
        <h2 id="endgame-actions-title">Portfolio run complete</h2>
        <p>
          The route is synced. Jump straight to the evidence a hiring manager
          or collaborator is most likely to need next.
        </p>
      </div>

      <div className="endgame-action-grid">
        <button type="button" onClick={onViewResumeView}>
          <span>Primary path</span>
          <strong>Open Resume View</strong>
        </button>
        <a href={resumeMethod?.href ?? "/Mike_Allaffi_CV.pdf"} download>
          <span>Resume</span>
          <strong>Download CV</strong>
        </a>
        <button type="button" onClick={onOpenContact}>
          <span>Next step</span>
          <strong>Open contact</strong>
        </button>
        <button type="button" onClick={onReviewBestProjects}>
          <span>Proof</span>
          <strong>Review best projects</strong>
        </button>
      </div>
    </section>
  );
}
