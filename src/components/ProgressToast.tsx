export type ProgressToastTone = "success" | "warning" | "complete";

export type ProgressToastMessage = {
  id: number;
  title: string;
  message: string;
  tone: ProgressToastTone;
};

type Props = {
  toast: ProgressToastMessage | null;
};

export default function ProgressToast({ toast }: Props) {
  if (!toast) return null;

  return (
    <aside
      className={`progress-toast progress-toast-${toast.tone}`}
      role="status"
      aria-live="polite"
    >
      <span>{toast.title}</span>
      <p>{toast.message}</p>
    </aside>
  );
}
