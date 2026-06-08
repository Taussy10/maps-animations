import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";

// --- SWEAT DROPLET COMPONENT ---
const SweatDroplet: React.FC<{ frame: number; startX: number; startY: number; vx: number; vy: number; delay: number }> = ({
  frame,
  startX,
  startY,
  vx,
  vy,
  delay,
}) => {
  const relativeFrame = (frame + delay) % 20;
  const t = relativeFrame / 20;
  
  // Project sweat away with gravity curve
  const x = startX + vx * t * 35;
  const y = startY + vy * t * 35 + 0.5 * 9.8 * t * t * 15; // gravity arc
  const opacity = interpolate(t, [0, 0.7, 1], [1, 1, 0]);

  return (
    <path
      d={`M ${x} ${y} Q ${x + 2} ${y + 5} ${x} ${y + 8} Q ${x - 2} ${y + 5} ${x} ${y}`}
      fill="#74c0fc"
      opacity={opacity}
    />
  );
};

export const Scene5: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // --- ANIMATIONS ---
  // Struggling high-frequency tremble (shake)
  const tremble = Math.sin(frame * 2.2) * 2;

  // Lifting height (chest and guard arms move up starting at frame 10)
  const liftSpring = spring({
    frame: frame - 10,
    fps,
    config: {
      damping: 15,
      stiffness: 50,
    },
  });
  const liftY = interpolate(liftSpring, [0, 1], [0, -60]);

  // Guard's vertical translation (he stands up and leans back as he lifts)
  const guardLiftY = interpolate(liftSpring, [0, 1], [0, -25]);

  return (
    <svg
      width="1280"
      height="720"
      viewBox="0 0 1280 720"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        backgroundColor: "#8c8c8c",
      }}
    >
      {/* BACKGROUND WALLS */}
      <rect x="0" y="0" width="1280" height="720" fill="#6e6e6e" />
      <rect x="380" y="0" width="900" height="720" fill="#4d4d4d" />
      <line x1="380" y1="0" x2="380" y2="720" stroke="#333" strokeWidth="8" />

      {/* Wall textures */}
      <path d="M 100 200 Q 120 205 110 215" stroke="#5a5a5a" strokeWidth="2" fill="none" />
      <path d="M 280 450 Q 290 455 285 460" stroke="#5a5a5a" strokeWidth="2" fill="none" />
      <path d="M 50 580 Q 70 582 60 590" stroke="#5a5a5a" strokeWidth="2" fill="none" />
      <path d="M 850 150 Q 860 155 855 160" stroke="#3d3d3d" strokeWidth="2" fill="none" />
      <path d="M 1100 450 Q 1110 455 1105 460" stroke="#3d3d3d" strokeWidth="2" fill="none" />

      {/* ========================================================
          THE JAIL BARS LAYER
          ======================================================== */}
      <g id="jail-bars">
        <rect x="380" y="0" width="900" height="20" fill="#2d2d2d" stroke="black" strokeWidth="3" />
        <rect x="380" y="700" width="900" height="20" fill="#2d2d2d" stroke="black" strokeWidth="3" />

        <path d="M 480 15 Q 470 360 480 705" stroke="#7f7f7f" strokeWidth="16" fill="none" strokeLinecap="round" />
        <path d="M 480 15 Q 470 360 480 705" stroke="black" strokeWidth="2" fill="none" />

        <path d="M 590 15 Q 600 360 590 705" stroke="#7f7f7f" strokeWidth="16" fill="none" strokeLinecap="round" />
        <path d="M 590 15 Q 600 360 590 705" stroke="black" strokeWidth="2" fill="none" />

        <path d="M 700 15 Q 690 360 700 705" stroke="#7f7f7f" strokeWidth="16" fill="none" strokeLinecap="round" />
        <path d="M 700 15 Q 690 360 700 705" stroke="black" strokeWidth="2" fill="none" />

        <path d="M 810 15 Q 820 360 810 705" stroke="#7f7f7f" strokeWidth="16" fill="none" strokeLinecap="round" />
        <path d="M 810 15 Q 820 360 810 705" stroke="black" strokeWidth="2" fill="none" />

        <path d="M 920 15 Q 910 360 920 705" stroke="#7f7f7f" strokeWidth="16" fill="none" strokeLinecap="round" />
        <path d="M 920 15 Q 910 360 920 705" stroke="black" strokeWidth="2" fill="none" />

        <path d="M 1030 15 Q 1040 360 1030 705" stroke="#7f7f7f" strokeWidth="16" fill="none" strokeLinecap="round" />
        <path d="M 1030 15 Q 1040 360 1030 705" stroke="black" strokeWidth="2" fill="none" />

        <path d="M 1140 15 Q 1130 360 1140 705" stroke="#7f7f7f" strokeWidth="16" fill="none" strokeLinecap="round" />
        <path d="M 1140 15 Q 1130 360 1140 705" stroke="black" strokeWidth="2" fill="none" />

        <path d="M 1250 15 Q 1260 360 1250 705" stroke="#7f7f7f" strokeWidth="16" fill="none" strokeLinecap="round" />
        <path d="M 1250 15 Q 1260 360 1250 705" stroke="black" strokeWidth="2" fill="none" />
      </g>

      {/* ========================================================
          THE BOOK CHEST (Being lifted with shake/tremble)
          ======================================================== */}
      {/* Resting X coordinate: 460 */}
      <g style={{ transform: `translate(${460 + tremble}px, ${520 + liftY + tremble}px)` }}>
        {/* Chest Main Box */}
        <rect x="0" y="0" width="140" height="95" fill="#8B4513" stroke="black" strokeWidth="4.5" />
        
        {/* Corner Iron Brackets */}
        <rect x="0" y="0" width="12" height="95" fill="#495057" />
        <rect x="128" y="0" width="12" height="95" fill="#495057" />
        
        {/* Lock/Hasp */}
        <rect x="62" y="-10" width="16" height="28" fill="#dee2e6" stroke="black" strokeWidth="2" />
        <circle cx="70" cy="8" r="3" fill="black" />

        {/* Chest Lid (Closed) */}
        <rect x="-5" y="-22" width="150" height="22" rx="4" fill="#a0522d" stroke="black" strokeWidth="4.5" />
      </g>

      {/* ========================================================
          GUARD LAYER (Struggling & Sweating, shifted to X=280 to reach chest)
          ======================================================== */}
      {/* Guard absolute X is now 280 (moved closer to chest at 460) */}
      <g
        style={{
          transform: `translate(${280 + tremble}px, ${420 + guardLiftY + tremble}px)`,
          transformOrigin: "70px 250px",
        }}
      >
        {/* Sweat flying off his head (Only starts shooting when he is lifting, e.g. frame > 10) */}
        {frame >= 12 && (
          <g>
            <SweatDroplet frame={frame} startX={30} startY={80} vx={-1} vy={-0.5} delay={0} />
            <SweatDroplet frame={frame} startX={110} startY={80} vx={1} vy={-0.6} delay={5} />
            <SweatDroplet frame={frame} startX={25} startY={100} vx={-0.8} vy={0.2} delay={10} />
            <SweatDroplet frame={frame} startX={115} startY={100} vx={0.9} vy={0.1} delay={15} />
          </g>
        )}

        {/* Body */}
        {/* Spine line */}
        <line x1="70" y1="170" x2="70" y2="280" stroke="black" strokeWidth="5" strokeLinecap="round" />
        
        {/* Legs (straining wide-stance) */}
        <line x1="70" y1="280" x2="25" y2="390" stroke="black" strokeWidth="6" strokeLinecap="round" />
        <line x1="70" y1="280" x2="115" y2="390" stroke="black" strokeWidth="6" strokeLinecap="round" />

        {/* Dynamic Lifting Arms reaching out to lift the chest */}
        {/* The chest base in local coordinates is at X = (460 - 280) = 180, Y = (520 - 420) + liftY = 100 + liftY */}
        {/* Left hand reaches bottom-left of chest, right hand reaches bottom-right of chest */}
        <path
          d={`M 70 180 L 120 200 L 180 ${130 + liftY}`}
          stroke="black"
          strokeWidth="4.5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d={`M 70 180 L 130 220 L 195 ${150 + liftY}`}
          stroke="black"
          strokeWidth="4.5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Head & Features */}
        <g id="guard-head-group">
          <path d="M 10 110 Q -10 130 0 170" stroke="black" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M 5 130 Q -15 145 2 180" stroke="black" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M 130 110 Q 150 130 140 170" stroke="black" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M 135 130 Q 155 145 138 180" stroke="black" strokeWidth="2.5" fill="none" strokeLinecap="round" />

          <circle cx="70" cy="110" r="65" fill="white" stroke="black" strokeWidth="4" />

          {/* Strained forehead wrinkles */}
          <path d="M 45 65 Q 70 60 95 65" stroke="black" strokeWidth="2.5" fill="none" />
          <path d="M 50 72 Q 70 68 90 72" stroke="black" strokeWidth="2" fill="none" />
          <path d="M 52 79 Q 70 75 88 79" stroke="black" strokeWidth="1.5" fill="none" />

          {/* Big eyes looking down in effort */}
          <circle cx="35" cy="95" r="12" fill="white" stroke="black" strokeWidth="3.5" />
          <circle cx="105" cy="95" r="12" fill="white" stroke="black" strokeWidth="3.5" />
          
          <circle cx="37" cy="98" r="4.5" fill="black" />
          <circle cx="107" cy="98" r="4.5" fill="black" />

          <path d="M 23 115 Q 35 120 47 115" stroke="black" strokeWidth="1.5" fill="none" />
          <path d="M 93 115 Q 105 120 117 115" stroke="black" strokeWidth="1.5" fill="none" />

          <path d="M 68 95 Q 78 105 68 115" stroke="black" strokeWidth="3.5" fill="none" strokeLinecap="round" />

          {/* Strained effort mouth (wide open and oval-shaped) */}
          <ellipse cx="70" cy="144" rx="14" ry="8" fill="black" stroke="black" strokeWidth="1" />
        </g>

        {/* Helmet */}
        <g id="guard-helmet">
          <path
            d="M 10 90 C 8 40, 30 15, 70 15 C 110 15, 132 40, 130 90 C 130 100, 10 100, 10 90 Z"
            fill="#9e9e9e"
            stroke="black"
            strokeWidth="4"
          />
          <path d="M 60 18 L 70 -10 L 80 18 Z" fill="#cfcfcf" stroke="black" strokeWidth="3.5" strokeLinejoin="miter" />

          <circle cx="30" cy="88" r="3" fill="#555" />
          <circle cx="50" cy="88" r="3" fill="#555" />
          <circle cx="70" cy="88" r="3" fill="#555" />
          <circle cx="90" cy="88" r="3" fill="#555" />
          <circle cx="110" cy="88" r="3" fill="#555" />
        </g>
      </g>
    </svg>
  );
};
