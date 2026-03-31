"use client";

/**
 * Gradient Mesh Background — replaces 3D particles for the Dark Cinema theme.
 * This component renders animated gradient orbs using pure CSS.
 * It is kept as a standalone component for backward compatibility,
 * but the Hero component now uses inline CSS gradient orbs instead.
 */
export default function HeroBackground3D() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Cyan glow */}
      <div className="mesh-orb-1 absolute -top-[20%] -left-[10%] h-[60vh] w-[60vh] rounded-full bg-[#00E5FF]/[0.06] blur-[120px]" />
      {/* Amber glow */}
      <div className="mesh-orb-2 absolute -bottom-[20%] -right-[10%] h-[50vh] w-[50vh] rounded-full bg-[#FFB800]/[0.05] blur-[120px]" />
      {/* Center subtle glow */}
      <div className="mesh-orb-3 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[40vh] w-[40vh] rounded-full bg-[#00E5FF]/[0.03] blur-[100px]" />
    </div>
  );
}
