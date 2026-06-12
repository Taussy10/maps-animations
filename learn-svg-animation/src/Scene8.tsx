import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";

export const Scene8: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // --- ANIMATIONS ---
  // Chest Lid popping open (starts at frame 0, fully open by frame 12)
  const lidSpring = spring({ frame, fps, config: { damping: 8, stiffness: 120 } });
  const lidRotation = interpolate(lidSpring, [0, 1], [0, -120]);

  // Hugo's Jump Arc out of the chest (starts at frame 10, lands by frame 40)
  const jumpSpring = spring({
    frame: frame - 10,
    fps,
    config: {
      damping: 12,
      stiffness: 70,
    },
  });

  // X coordinate: starts inside chest (group offset 20px), arches right (landing at 180px)
  const jumpX = interpolate(jumpSpring, [0, 0.5, 1], [20, 120, 180]);
  
  // Y coordinate: starts deep inside chest (group offset 180px), leaps high up (-150px), lands on the ground (-90px)
  const jumpY = interpolate(jumpSpring, [0, 0.4, 1], [180, -150, -90]);

  // Opacity: becomes visible as he clears the chest top
  const hugoOpacity = interpolate(jumpSpring, [0, 0.25], [0, 1]);

  // Hugo running away (starts at frame 40, exits screen right by frame 60)
  const isRunning = frame >= 40;
  const runProgress = isRunning ? (frame - 40) / 20 : 0;
  const runX = interpolate(runProgress, [0, 1], [0, 600]); // Runs off-screen right
  const runBob = isRunning ? Math.abs(Math.sin((frame - 40) / 2)) * 6 : 0;
  const runLeg1 = isRunning ? Math.sin((frame - 40) / 2) * 35 : 0;
  const runLeg2 = isRunning ? -Math.sin((frame - 40) / 2) * 35 : 0;
  const runArm1 = isRunning ? -Math.sin((frame - 40) / 2) * 25 : 0;
  const runArm2 = isRunning ? Math.sin((frame - 40) / 2) * 25 : 0;

  // Combine jump and run translations
  const totalHugoX = jumpX + runX;
  const totalHugoY = jumpY - runBob;

  return (
    <svg
      width="1280"
      height="720"
      viewBox="0 0 1280 720"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        backgroundColor: "#a5d8ff",
      }}
    >
      {/* SKY */}
      <rect x="0" y="0" width="1280" height="580" fill="#a5d8ff" />
      <path d="M 850 100 Q 880 80 910 100 Q 940 80 970 100 Q 980 120 950 130 L 870 130 Z" fill="white" opacity="0.4" />
      <path d="M 200 150 Q 230 130 260 150 Q 290 130 320 150 Q 330 170 300 180 L 220 180 Z" fill="white" opacity="0.3" />

      {/* STONE GROUND */}
      <rect x="0" y="580" width="1280" height="140" fill="#868e96" />
      <line x1="0" y1="580" x2="1280" y2="580" stroke="black" strokeWidth="4" />

      {/* CASTLE WALL */}
      <rect x="0" y="0" width="450" height="580" fill="#5c5f62" stroke="black" strokeWidth="4" />
      <path d="M 0 120 L 450 120 M 0 240 L 450 240 M 0 360 L 450 360 M 0 480 L 450 480" stroke="#484a4c" strokeWidth="3" />
      <path d="M 100 0 L 100 120 M 300 0 L 300 120 M 200 120 L 200 240 M 400 120 L 400 240 M 100 240 L 100 360 M 300 240 L 300 360 M 200 360 L 200 480 M 400 360 L 400 480 M 100 480 L 100 580 M 300 480 L 300 580" stroke="#484a4c" strokeWidth="3" />

      {/* Castle Gate */}
      <path d="M 120 580 L 120 380 Q 225 280 330 380 L 330 580 Z" fill="#4b3621" stroke="black" strokeWidth="5" />
      <line x1="225" y1="330" x2="225" y2="580" stroke="black" strokeWidth="3" />
      <circle cx="205" cy="460" r="6" fill="#ffd43b" stroke="black" strokeWidth="2" />
      <circle cx="245" cy="460" r="6" fill="#ffd43b" stroke="black" strokeWidth="2" />

      {/* ========================================================
          HUGO GROTIUS (Jumps out of chest and runs right)
          ======================================================== */}
      <g
        style={{
          transform: `translate(${totalHugoX}px, ${totalHugoY}px)`,
          transformOrigin: "550px 670px",
          opacity: hugoOpacity,
        }}
      >
        {/* Body */}
        <line x1="550" y1="330" x2="550" y2="670" stroke="black" strokeWidth="4" strokeLinecap="round" />
        
        {/* Running / Jumping Arms */}
        <g style={{ transformOrigin: "550px 430px", transform: `rotate(${runArm1}deg)` }}>
          <path d="M 550 430 Q 515 450 495 560" stroke="black" strokeWidth="4" fill="none" strokeLinecap="round" />
        </g>
        <g style={{ transformOrigin: "550px 430px", transform: `rotate(${runArm2}deg)` }}>
          <path d="M 550 430 Q 585 450 605 560" stroke="black" strokeWidth="4" fill="none" strokeLinecap="round" />
        </g>

        {/* Running / Jumping Legs */}
        <g style={{ transformOrigin: "515px 560px", transform: `rotate(${runLeg1}deg)` }}>
          <line x1="550" y1="560" x2="515" y2="670" stroke="black" strokeWidth="5" strokeLinecap="round" />
        </g>
        <g style={{ transformOrigin: "585px 560px", transform: `rotate(${runLeg2}deg)` }}>
          <line x1="550" y1="560" x2="585" y2="670" stroke="black" strokeWidth="5" strokeLinecap="round" />
        </g>

        {/* Cloud Head Base Outlines */}
        <circle cx="502" cy="305" r="34" fill="white" stroke="black" strokeWidth="4" />
        <circle cx="598" cy="305" r="34" fill="white" stroke="black" strokeWidth="4" />
        <circle cx="550" cy="295" r="46" fill="white" stroke="black" strokeWidth="4" />

        {/* Cloud Head Inner Fills */}
        <circle cx="502" cy="305" r="32" fill="white" />
        <circle cx="598" cy="305" r="32" fill="white" />
        <circle cx="550" cy="295" r="44" fill="white" />

        {/* Hair strands */}
        <line x1="535" y1="245" x2="530" y2="230" stroke="black" strokeWidth="2" />
        <line x1="550" y1="242" x2="550" y2="225" stroke="black" strokeWidth="2" />
        <line x1="565" y1="245" x2="570" y2="230" stroke="black" strokeWidth="2" />

        {/* Face details (Thrilled smile / happy eyes looking forward) */}
        <ellipse cx="532" cy="290" rx="4.5" ry="6.5" fill="black" />
        <ellipse cx="568" cy="290" rx="4.5" ry="6.5" fill="black" />
        <path d="M 522 280 Q 532 277 540 274" stroke="black" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <path d="M 578 280 Q 568 277 560 274" stroke="black" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        
        {/* Happy shouting mouth */}
        <path 
          d="M 532 316 Q 550 348 568 316 Z" 
          fill="black"
          stroke="black"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </g>

      {/* ========================================================
          THE BOOK CHEST (Lid pops open, sitting at 500, 490)
          ======================================================== */}
      <g style={{ transform: "translate(500px, 490px)" }}>
        {/* Chest Main Box (drawn in front of Hugo so he climbs *out* of it) */}
        <rect x="0" y="0" width="140" height="95" fill="#8B4513" stroke="black" strokeWidth="4.5" />
        <rect x="0" y="0" width="12" height="95" fill="#495057" />
        <rect x="128" y="0" width="12" height="95" fill="#495057" />
        <rect x="62" y="-10" width="16" height="28" fill="#dee2e6" stroke="black" strokeWidth="2" />
        <circle cx="70" cy="8" r="3" fill="black" />

        {/* Chest Lid (Pops open rotating around X=0, Y=0) */}
        <g
          style={{
            transformOrigin: "0px 0px",
            transform: `rotate(${lidRotation}deg)`,
          }}
        >
          <rect x="-5" y="-22" width="150" height="22" rx="4" fill="#a0522d" stroke="black" strokeWidth="4.5" />
        </g>
      </g>
    </svg>
  );
};
