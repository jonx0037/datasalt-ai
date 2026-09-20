import { FlaskConical } from "lucide-react";

interface IllustrativeNoticeProps {
  /** The composite subject, e.g. "Garza, Robles & Cantu". */
  subject: string;
  /** What is drawn from real practice — the part that is NOT invented. */
  grounded: string;
  /** Optional: a real system of ours in the same problem space. */
  realWork?: React.ReactNode;
}

/**
 * A scenario notice for case studies built as worked design studies rather than
 * client engagements.
 *
 * The case-study briefs specify these subjects as fictional and their data as
 * synthetic — "all data is synthetic and should be clearly labeled as
 * illustrative". That labeling was never implemented on the pages, so every
 * scenario read as a completed engagement with measured outcomes. This is that
 * label.
 *
 * Deliberately stated plainly rather than apologetically, matching how the
 * interactive demos already describe their synthetic training data. A worked
 * scenario is a legitimate way to show method; presenting one as a client
 * result is not.
 */
export function IllustrativeNotice({
  subject,
  grounded,
  realWork,
}: IllustrativeNoticeProps) {
  return (
    <div className="not-prose my-8 rounded-lg border border-amber-500/30 bg-amber-500/5 dark:bg-amber-500/10 p-6">
      <div className="flex items-start gap-3">
        <FlaskConical
          className="h-5 w-5 text-amber-600 dark:text-amber-500 mt-0.5 shrink-0"
          aria-hidden="true"
        />
        <div className="space-y-2 text-sm leading-relaxed">
          <p className="font-semibold text-foreground">
            Illustrative scenario — not a client engagement.
          </p>
          <p className="text-muted-foreground">
            {subject} is a composite, not a client. {grounded} The firm profile,
            every figure, and every chart on this page are modeled to show how
            the approach would work. Nothing here reports a measured client
            outcome.
          </p>
          {realWork && (
            <p className="text-muted-foreground">{realWork}</p>
          )}
        </div>
      </div>
    </div>
  );
}
