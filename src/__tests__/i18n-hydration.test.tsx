import { act, fireEvent } from "@testing-library/react";
import { hydrateRoot, type Root } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { I18nProvider, useI18n } from "@/lib/i18n";

function LanguageControl() {
  const { lang, toggle } = useI18n();
  return <button onClick={toggle}>{lang}</button>;
}

describe("saved language hydration", () => {
  it("restores English after matching the Polish server HTML without recovery errors", async () => {
    localStorage.setItem("programo-lang", "en");
    const tree = <I18nProvider><LanguageControl /></I18nProvider>;
    const container = document.createElement("div");
    container.innerHTML = renderToString(tree);
    expect(container.textContent).toBe("pl");
    document.body.appendChild(container);
    const errors: unknown[] = [];
    let root: Root | undefined;
    try {
      await act(async () => { root = hydrateRoot(container, tree, { onRecoverableError: (error) => errors.push(error) }); });
      expect(container.textContent).toBe("en");
      expect(document.documentElement.lang).toBe("en");
      expect(localStorage.getItem("programo-lang")).toBe("en");
      expect(errors).toEqual([]);
      fireEvent.click(container.querySelector("button")!);
      expect(container.textContent).toBe("pl");
      expect(document.documentElement.lang).toBe("pl");
      expect(localStorage.getItem("programo-lang")).toBe("pl");
    } finally {
      await act(async () => { root?.unmount(); });
      container.remove();
    }
  });
});
