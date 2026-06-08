import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";

export const Scene7: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // --- ANIMATIONS ---
  // Guard dusting hands (frames 0 to 20)
  // Arm lines move crosswise over chest to simulate dusting
  let arm1Path = "M 70 180 L 50 220 L 40 250";
  let arm2Path = "M 70 180 L 90 220 L 100 250";
  
  if (frame < 20) {
    // Brushing hands cycle
    const brush = Math.sin(frame * 1.2) * 15;
    arm1Path = `M 70 180 L ${60 + brush} 210 L ${70 + brush} 240`;
    arm2Path = `M 70 180 L ${80 - brush} 210 L ${70 - brush} 240`;
  }

  // Guard walking away (starts walking at frame 20, exits by frame 60)
  const isWalking = frame >= 20;
  const walkProgress = isWalking ? (frame - 20) / 40 : 0;
  const guardX = interpolate(walkProgress, [0, 1], [660, 1400]); // Walks off-screen right
  
  // Leg swings while walking
  const leg1Rotation = isWalking ? Math.sin((frame - 20) / 3) * 25 : 0;
  const leg2Rotation = isWalking ? -Math.sin((frame - 20) / 3) * 25 : 0;
  const walkBob = isWalking ? Math.abs(Math.sin((frame - 20) / 3)) * 3 : 0;

  // Let guard's arms swing naturally while walking
  if (isWalking) {
    const armSwing = Math.sin((frame - 20) / 3) * 15;
    arm1Path = `M 70 180 L ${50 + armSwing} 220 L ${40 + armSwing} 260`;
    arm2Path = `M 70 180 L ${90 - armSwing} 220 L ${100 - armSwing} 260`;
  }

  return (
    <svg
      width="1280"
      height="720"
      viewBox="0 0 1280 720"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        backgroundColor: "#a5d8ff", // Sky blue background
      }}
    >
      {/* SKY */}
      <rect x="0" y="0" width="1280" height="580" fill="#a5d8ff" />
      {/* Clouds in the sky */}
      <path d="M 850 100 Q 880 80 910 100 Q 940 80 970 100 Q 980 120 950 130 L 870 130 Z" fill="white" opacity="0.4" />
      <path d="M 200 150 Q 230 130 260 150 Q 290 130 320 150 Q 330 170 300 180 L 220 180 Z" fill="white" opacity="0.3" />

      {/* STONE GROUND */}
      <rect x="0" y="580" width="1280" height="140" fill="#868e96" />
      <line x1="0" y1="580" x2="1280" y2="580" stroke="black" strokeWidth="4" />

      {/* CASTLE WALL (Left half of the screen) */}
      <rect x="0" y="0" width="450" height="580" fill="#5c5f62" stroke="black" strokeWidth="4" />
      {/* Brick details on castle wall */}
      <path d="M 0 120 L 450 120 M 0 240 L 450 240 M 0 360 L 450 360 M 0 480 L 450 480" stroke="#484a4c" strokeWidth="3" />
      <path d="M 100 0 L 100 120 M 300 0 L 300 120 M 200 120 L 200 240 M 400 120 L 400 240 M 100 240 L 100 360 M 300 240 L 300 360 M 200 360 L 200 480 M 400 360 L 400 480 M 100 480 L 100 580 M 300 480 L 300 580" stroke="#484a4c" strokeWidth="3" />

      {/* Castle Arch Gate (Closed) */}
      <path d="M 120 580 L 120 380 Q 225 280 330 380 L 330 580 Z" fill="#4b3621" stroke="black" strokeWidth="5" />
      <line x1="225" y1="330" x2="225" y2="580" stroke="black" strokeWidth="3" /> {/* Gate center crack */}
      <circle cx="205" cy="460" r="6" fill="#ffd43b" stroke="black" strokeWidth="2" /> {/* Left ring handle */}
      <circle cx="245" cy="460" r="6" fill="#ffd43b" stroke="black" strokeWidth="2" /> {/* Right ring handle */}

      {/* ========================================================
          THE BOOK CHEST (Stationary on the ground)
          ======================================================== */}
      <g style={{ transform: "translate(500px, 490px)" }}>
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
          GUARD LAYER (Dusts hands, then walks off-screen right)
          ======================================================== */}
      <g
        style={{
          transform: `translate(${guardX}px, ${390 - walkBob}px)`,
          transformOrigin: "70px 250px",
        }}
      >
        {/* Spine body */}
        <line x1="70" y1="170" x2="70" y2="280" stroke="black" strokeWidth="5" strokeLinecap="round" />
        
        {/* Legs (swinging if walking) */}
        <g style={{ transformOrigin: "35px 280px", transform: `rotate(${leg1Rotation}deg)` }}>
          <line x1="70" y1="280" x2="35" y2="390" stroke="black" strokeWidth="6" strokeLinecap="round" />
        </g>
        <g style={{ transformOrigin: "115px 280px", transform: `rotate(${leg2Rotation}deg)` }}>
          <line x1="70" y1="280" x2="115" y2="390" stroke="black" strokeWidth="6" strokeLinecap="round" />
        </g>

        {/* Dynamic arms (swinging or brushing hands) */}
        <path d={arm1Path} stroke="black" strokeWidth="4.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path d={arm2Path} stroke="black" strokeWidth="4.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />

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
          
          {/* Relaxed pupils looking forward/right as he walks */}
          <circle cx="38" cy="95" r="4.5" fill="black" />
          <circle cx="108" cy="95" r="4.5" fill="black" />

          <path d="M 23 115 Q 35 120 47 115" stroke="black" strokeWidth="1.5" fill="none" />
          <path d="M 93 115 Q 105 120 117 115" stroke="black" strokeWidth="1.5" fill="none" />
          <path d="M 68 95 Q 78 105 68 115" stroke="black" strokeWidth="3.5" fill="none" strokeLinecap="round" />

          {/* Relaxed mouth (whistling or light smile) */}
          <path d="M 60 142 Q 70 148 80 142" stroke="black" strokeWidth="3" fill="none" strokeLinecap="round" />
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
