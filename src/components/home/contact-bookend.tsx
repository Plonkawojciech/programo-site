"use client";

import QuickContact from "@/components/quick-contact";

// Contact bookend (deck 1.9). Provides the `#kontakt` scroll target used by
// the hero CTA. This used to render its own H2 + lead + phone directly above
// QuickContact, which repeats its own H2 + lead + phone one scroll away — an
// identical double header. QuickContact is now the single contact bookend;
// this wrapper only keeps the `#kontakt` anchor alive.
export default function ContactBookend() {
  return (
    <div id="kontakt" className="scroll-mt-24">
      <QuickContact formId="home-bookend" />
    </div>
  );
}
