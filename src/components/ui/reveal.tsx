import { type CSSProperties, type ReactNode } from "react";

type RevealTag = "article" | "div" | "h2" | "li";

export default function Reveal({
  as: Component = "div",
  children,
  delay = 0,
  y = 24,
  className,
  id,
}: {
  as?: RevealTag;
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  id?: string;
}) {
  const Element = Component;
  const offset = Math.min(Math.max(y, 0), 24);
  const style = {
    "--reveal-delay": `${Math.max(delay, 0)}s`,
    "--reveal-y": `${offset}px`,
    "--reveal-start": `${Math.min(Math.max(delay, 0) * 20, 12)}%`,
  } as CSSProperties;

  return (
    <Element
      id={id}
      className={`reveal${className ? ` ${className}` : ""}`}
      style={style}
    >
      {children}
    </Element>
  );
}
