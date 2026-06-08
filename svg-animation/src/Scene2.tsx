import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";

export const Scene2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // --- ANIMATIONS ---
  // Guard idle bob & breathing
  const guardBob = Math.sin(frame / 7) * 2.5;
  const guardBreatheX = 1 + Math.sin(frame / 7) * 0.003;
  const guardBreatheY = 1 - Math.sin(frame / 7) * 0.005;

  // Hugo Grotius idle bob & breathing
  const hugoBob = Math.sin((frame + 15) / 8) * 3;
  const hugoBreatheX = 1 + Math.sin((frame + 15) / 8) * 0.004;
  const hugoBreatheY = 1 - Math.sin((frame + 15) / 8) * 0.006;

  // Guard eyes scanning left/right
  const eyeScan = interpolate(
    Math.sin(frame / 40),
    [-1, 1],
    [-5, 5]
  );

  // Guard baton tapping
  const batonRotation = interpolate(
    Math.sin(frame / 12),
    [-1, 1],
    [-4, 6]
  );

  // Idea Lightbulb Pop-up Animation (starts at frame 10)
  const lightbulbSpring = spring({
    frame: frame - 10,
    fps,
    config: {
      damping: 10,
      stiffness: 100,
    },
  });
  // Scales bulb from 0 to 1, and translates it upwards
  const bulbScale = interpolate(lightbulbSpring, [0, 1], [0, 1]);
  const bulbY = interpolate(lightbulbSpring, [0, 1], [300, 205]); // Starts at head level, pops up above head
  const glowOpacity = interpolate(
    Math.sin(frame / 3), 
    [-1, 1], 
    [0.4, 0.9]
  ); // Glowing flicker effect

  // Hugo's Expression Change (morphs mouth and brows as the idea strikes at frame 15)
  const expressionSpring = spring({
    frame: frame - 15,
    fps,
    config: { damping: 12 },
  });
  // Mouth: transitions from a small sad circle to a big happy crescent path
  // Neutral/sad mouth: Q 550 322 (flat line) -> Happy mouth: Q 550 345 (smiley curve)
  const mouthControlY = interpolate(expressionSpring, [0, 1], [315, 345]);
  const mouthWidth = interpolate(expressionSpring, [0, 1], [4, 18]);

  // Eyebrows: Sad slant to happy/excited raise
  const leftBrowEnd = interpolate(expressionSpring, [0, 1], [283, 274]); // Left brow arches up
  const rightBrowEnd = interpolate(expressionSpring, [0, 1], [283, 274]); // Right brow arches up

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
          HUGO GROTIUS (PRISONER)
          ======================================================== */}
      <g
        style={{
          transform: `translate(90px, 10px) scale(${hugoBreatheX}, ${hugoBreatheY})`,
          transformOrigin: "550px 670px",
        }}
      >
        <g style={{ transform: `translateY(${hugoBob}px)` }}>
          {/* Idea Lightbulb (Pops up above head at x=550) */}
          {frame >= 10 && (
            <g
              style={{
                transform: `scale(${bulbScale})`,
                transformOrigin: `550px ${bulbY}px`,
              }}
            >
              {/* Glow rays */}
              <line x1="550" y1={bulbY - 25} x2="550" y2={bulbY - 40} stroke="#ffd43b" strokeWidth="3" opacity={glowOpacity} />
              <line x1="530" y1={bulbY - 18} x2="518" y2={bulbY - 30} stroke="#ffd43b" strokeWidth="3" opacity={glowOpacity} />
              <line x1="570" y1={bulbY - 18} x2="582" y2={bulbY - 30} stroke="#ffd43b" strokeWidth="3" opacity={glowOpacity} />
              <line x1="520" y1={bulbY} x2="505" y2={bulbY} stroke="#ffd43b" strokeWidth="3" opacity={glowOpacity} />
              <line x1="580" y1={bulbY} x2="595" y2={bulbY} stroke="#ffd43b" strokeWidth="3" opacity={glowOpacity} />

              {/* Yellow bulb body */}
              <circle cx="550" cy={bulbY} r="18" fill="#ffd43b" stroke="black" strokeWidth="3.5" />
              {/* Bulb bottom connector threads */}
              <rect x="543" y={bulbY + 16} width="14" height="6" rx="1.5" fill="#868e96" stroke="black" strokeWidth="2.5" />
              <rect x="546" y={bulbY + 22} width="8" height="4" fill="#343a40" />
            </g>
          )}

          {/* Body */}
          <line x1="550" y1="330" x2="550" y2="670" stroke="black" strokeWidth="4" strokeLinecap="round" />
          <path d="M 550 430 Q 515 450 495 560" stroke="black" strokeWidth="4" fill="none" strokeLinecap="round" />
          <path d="M 550 430 Q 585 450 605 560" stroke="black" strokeWidth="4" fill="none" strokeLinecap="round" />
          <line x1="550" y1="560" x2="515" y2="670" stroke="black" strokeWidth="5" strokeLinecap="round" />
          <line x1="550" y1="560" x2="585" y2="670" stroke="black" strokeWidth="5" strokeLinecap="round" />

          {/* Cloud Head Base Outlines */}
          <circle cx="502" cy="305" r="34" fill="white" stroke="black" strokeWidth="4" />
          <circle cx="598" cy="305" r="34" fill="white" stroke="black" strokeWidth="4" />
          <circle cx="550" cy="295" r="46" fill="white" stroke="black" strokeWidth="4" />

          {/* Cloud Head Inner Fills to merge outlines */}
          <circle cx="502" cy="305" r="32" fill="white" />
          <circle cx="598" cy="305" r="32" fill="white" />
          <circle cx="550" cy="295" r="44" fill="white" />

          {/* Hair strands on head */}
          <line x1="535" y1="245" x2="530" y2="230" stroke="black" strokeWidth="2" />
          <line x1="550" y1="242" x2="550" y2="225" stroke="black" strokeWidth="2" />
          <line x1="565" y1="245" x2="570" y2="230" stroke="black" strokeWidth="2" />

          {/* Cheek hair lines */}
          <line x1="465" y1="305" x2="455" y2="303" stroke="black" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="467" y1="315" x2="457" y2="317" stroke="black" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="635" y1="305" x2="645" y2="303" stroke="black" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="633" y1="315" x2="643" y2="317" stroke="black" strokeWidth="1.5" strokeLinecap="round" />

          {/* Face details (Mouth & Brows change when idea strikes) */}
          <ellipse cx="532" cy="290" rx="4.5" ry="6.5" fill="black" />
          <ellipse cx="568" cy="290" rx="4.5" ry="6.5" fill="black" />
          {/* Eyebrows (Shift from sad slant to excited raise) */}
          <path d={`M 522 280 Q 532 277 540 ${leftBrowEnd}`} stroke="black" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d={`M 578 280 Q 568 277 560 ${rightBrowEnd}`} stroke="black" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          
          {/* Smiling/Talking mouth morph */}
          <path 
            d={`M ${550 - mouthWidth} 320 Q 550 ${mouthControlY} ${550 + mouthWidth} 320`}
            stroke="black"
            strokeWidth="3.5"
            fill="none"
            strokeLinecap="round"
          />
        </g>
      </g>

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
          GUARD LAYER
          ======================================================== */}
      <g
        style={{
          transform: `translate(140px, 420px) scale(${guardBreatheX}, ${guardBreatheY})`,
          transformOrigin: "70px 250px",
        }}
      >
        <g style={{ transform: `translateY(${guardBob}px)` }}>
          {/* Body */}
          <line x1="70" y1="170" x2="70" y2="280" stroke="black" strokeWidth="5" strokeLinecap="round" />
          <path d="M 70 180 Q 40 200 40 250" stroke="black" strokeWidth="4" fill="none" strokeLinecap="round" />
          <path d="M 70 180 Q 100 200 110 250" stroke="black" strokeWidth="4" fill="none" strokeLinecap="round" />
          <line x1="70" y1="280" x2="35" y2="390" stroke="black" strokeWidth="6" strokeLinecap="round" />
          <line x1="70" y1="280" x2="115" y2="390" stroke="black" strokeWidth="6" strokeLinecap="round" />

          {/* Head & Features */}
          <g id="guard-head-group">
            <path d="M 10 110 Q -10 130 0 170" stroke="black" strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M 5 130 Q -15 145 2 180" stroke="black" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <path d="M 130 110 Q 150 130 140 170" stroke="black" strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M 135 130 Q 155 145 138 180" stroke="black" strokeWidth="2.5" fill="none" strokeLinecap="round" />

            <circle cx="70" cy="110" r="65" fill="white" stroke="black" strokeWidth="4" />

            <path d="M 45 70 Q 70 65 95 70" stroke="black" strokeWidth="2" fill="none" />
            <path d="M 50 78 Q 70 75 90 78" stroke="black" strokeWidth="1.5" fill="none" />

            <circle cx="35" cy="95" r="12" fill="white" stroke="black" strokeWidth="3.5" />
            <circle cx="105" cy="95" r="12" fill="white" stroke="black" strokeWidth="3.5" />
            
            <circle cx={35 + eyeScan} cy="95" r="4.5" fill="black" />
            <circle cx={105 + eyeScan} cy="95" r="4.5" fill="black" />

            <path d="M 23 115 Q 35 120 47 115" stroke="black" strokeWidth="1.5" fill="none" />
            <path d="M 93 115 Q 105 120 117 115" stroke="black" strokeWidth="1.5" fill="none" />

            <path d="M 68 95 Q 78 105 68 115" stroke="black" strokeWidth="3.5" fill="none" strokeLinecap="round" />

            <path d="M 50 140 Q 70 130 90 140" stroke="black" strokeWidth="3.5" fill="none" strokeLinecap="round" />
            <path d="M 46 142 Q 70 152 94 142" stroke="black" strokeWidth="2.5" fill="none" strokeLinecap="round" />
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

          {/* Weapon (Baton) */}
          <g
            style={{
              transformOrigin: "110px 250px",
              transform: `rotate(${batonRotation}deg)`,
            }}
          >
            <rect
              x="105"
              y="170"
              width="10"
              height="95"
              rx="4"
              fill="#c19a6b"
              stroke="black"
              strokeWidth="3.5"
              transform="rotate(65 110 250)"
            />
          </g>
        </g>
      </g>
    </svg>
  );
};
