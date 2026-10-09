import type { ReactNode } from "react";

// Text is visible in server HTML and does not wait on hydration or an observer.
// Accept the former motion props so existing layouts can keep this wrapper.
export default function Reveal({ children, className }: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  return <div className={className}>{children}</div>;
}
