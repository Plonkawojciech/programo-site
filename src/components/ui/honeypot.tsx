import { HONEYPOT_FIELD } from "@/lib/form-challenge-shared";

/**
 * Honeypot: a text input pushed off-canvas, out of the tab order and out of
 * the accessibility tree. A person never meets it; an autofiller fills
 * every input it finds. /api/contact drops the submission when it has a
 * value. NOT `type="hidden"` — bots skip those. NOT `display:none` — the
 * smarter ones skip those too. Just far off to the left.
 */
export default function Honeypot() {
  return (
    <div aria-hidden="true" className="absolute -left-[9999px] top-0 h-px w-px overflow-hidden">
      <label>
        Website
        <input type="text" name={HONEYPOT_FIELD} tabIndex={-1} autoComplete="off" defaultValue="" />
      </label>
    </div>
  );
}
