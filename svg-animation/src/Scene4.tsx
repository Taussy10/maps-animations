import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";

export const Scene4: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // --- ANIMATIONS ---
  // Guard breathing & idle bob
  const guardBob = Math.sin(frame / 7) * 2.5;
  const guardBreatheX = 1 + Math.sin(frame / 7) * 0.003;
  const guardBreatheY = 1 - Math.sin(frame / 7) * 0.005;

  const eyeScanX = 6;
  const eyeScanY = 3;

  // Chest Lid Rotation Animation
  // Lid opens from frame 0 to 15, stays open, and closes from frame 45 to 60
  let lidRotation = 0;
  if (frame < 15) {
    const openSpring = spring({ frame, fps, config: { damping: 10 } });
    lidRotation = interpolate(openSpring, [0, 1], [0, -110]);
  } else if (frame >= 45) {
    const closeSpring = spring({ frame: frame - 45, fps, config: { damping: 10 } });
    lidRotation = interpolate(closeSpring, [0, 1], [-110, 0]);
  } else {
    lidRotation = -110;
  }

  // Hugo Grotius climbing into the chest (starts at frame 12, finishes by frame 48)
  const climbSpring = spring({
    frame: frame - 12,
    fps,
    config: {
      damping: 15,
      stiffness: 70,
    },
  });
  // Move horizontally from cell X (translation 90px) to chest X (translation -70px)
  const hugoX = interpolate(climbSpring, [0, 0.5, 1], [90, -70, -70]);
  // Move vertically down (slides into the chest)
  const hugoY = interpolate(climbSpring, [0, 0.5, 1], [10, 10, 210]);
  // Fade out as he is completely inside the box
  const hugoOpacity = interpolate(climbSpring, [0.65, 0.95], [1, 0]);

  // Let Hugo bob while standing before he climbs (frames 0 to 12)
  const hugoBob = frame < 12 ? Math.sin((frame + 15) / 8) * 3 : 0;

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
          HUGO GROTIUS (PRISONER) - CLIMBING
          ======================================================== */}
      <g
        style={{
          transform: `translate(${hugoX}px, ${hugoY}px)`,
          transformOrigin: "550px 670px",
          opacity: hugoOpacity,
        }}
      >
        <g style={{ transform: `translateY(${hugoBob}px)` }}>
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

          {/* Face details (Concentrated/Sneaking expression) */}
          <ellipse cx="532" cy="290" rx="4.5" ry="6.5" fill="black" />
          <ellipse cx="568" cy="290" rx="4.5" ry="6.5" fill="black" />
          <path d="M 522 284 Q 532 280 540 282" stroke="black" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M 578 284 Q 568 280 560 282" stroke="black" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          
          {/* Flat determined mouth */}
          <line x1="540" y1="322" x2="560" y2="322" stroke="black" strokeWidth="3.5" strokeLinecap="round" />
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
          THE BOOK CHEST (Drawn at X=460)
          ======================================================== */}
      <g style={{ transform: "translateX(460px)" }}>
        {/* Chest Main Box */}
        <rect x="0" y="520" width="140" height="95" fill="#8B4513" stroke="black" strokeWidth="4.5" />
        
        {/* Corner Iron Brackets */}
        <rect x="0" y="520" width="12" height="95" fill="#495057" />
        <rect x="128" y="520" width="12" height="95" fill="#495057" />
        
        {/* Lock/Hasp */}
        <rect x="62" y="510" width="16" height="28" fill="#dee2e6" stroke="black" strokeWidth="2" />
        <circle cx="70" cy="528" r="3" fill="black" />

        {/* Chest Lid (Rotates around its hinge at X=0, Y=520) */}
        <g
          style={{
            transformOrigin: "0px 520px",
            transform: `rotate(${lidRotation}deg)`,
          }}
        >
          <rect x="-5" y="498" width="150" height="22" rx="4" fill="#a0522d" stroke="black" strokeWidth="4.5" />
        </g>
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
            
            <circle cx={35 + eyeScanX} cy={95 + eyeScanY} r="4.5" fill="black" />
            <circle cx={105 + eyeScanX} cy={95 + eyeScanY} r="4.5" fill="black" />

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
          <g style={{ transformOrigin: "110px 250px", transform: "rotate(20deg)" }}>
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
