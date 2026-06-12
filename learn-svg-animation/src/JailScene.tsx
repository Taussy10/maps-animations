import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";

// --- TEAR DROP ANIMATION LAYER ---
const Tears: React.FC<{ frame: number; x: number; y: number; delay: number }> = ({ frame, x, y, delay }) => {
  const tearProgress = ((frame + delay) % 45) / 45;
  const tearY = interpolate(tearProgress, [0, 1], [y, y + 45]);
  const tearOpacity = interpolate(tearProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <g>
      <path
        d={`M ${x} ${y} L ${x} ${tearY}`}
        stroke="#a5d8ff"
        strokeWidth="2"
        fill="none"
        opacity={tearOpacity * 0.7}
      />
      <circle
        cx={x}
        cy={tearY}
        r="2.5"
        fill="#74c0fc"
        opacity={tearOpacity}
      />
    </g>
  );
};

export const JailScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // --- ANIMATIONS ---
  const guardBob = Math.sin(frame / 6) * 2;
  const guardBreatheX = 1 + Math.sin(frame / 6) * 0.003;
  const guardBreatheY = 1 - Math.sin(frame / 6) * 0.005;

  const prisoner1Bob = Math.sin((frame + 10) / 7) * 2.5;
  const prisoner2Bob = Math.sin((frame + 20) / 5) * 3;
  const prisoner3Bob = Math.sin((frame + 5) / 8) * 1.5;
  const prisoner4Bob = Math.sin((frame + 15) / 9) * 2;

  const eyeScan = interpolate(
    Math.sin(frame / 35),
    [-1, 1],
    [-4, 4]
  );

  const batonRotation = interpolate(
    Math.sin(frame / 15),
    [-1, 1],
    [-3, 5]
  );

  const angryShake = Math.sin(frame * 1.5) * (frame % 30 > 15 ? 1.5 : 0);
  const mouth3Wobble = Math.sin(frame / 3) * 2;

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
      <path d="M 900 150 Q 910 155 905 160" stroke="#3d3d3d" strokeWidth="2" fill="none" />
      <path d="M 1150 550 Q 1160 555 1155 560" stroke="#3d3d3d" strokeWidth="2" fill="none" />

      {/* ========================================================
          PRISONERS CELL LAYER (Behind the bars)
          ======================================================== */}
      
      {/* PRISONER 1: Puffy Cloud Head (Left) */}
      <g style={{ transform: `translateY(${prisoner1Bob}px)` }}>
        {/* Body (Extended upwards from 390 to 330 to connect inside head) */}
        <line x1="550" y1="330" x2="550" y2="670" stroke="black" strokeWidth="4" strokeLinecap="round" />
        <path d="M 550 430 Q 515 450 495 560" stroke="black" strokeWidth="4" fill="none" strokeLinecap="round" />
        <path d="M 550 430 Q 585 450 605 560" stroke="black" strokeWidth="4" fill="none" strokeLinecap="round" />
        <line x1="550" y1="560" x2="515" y2="670" stroke="black" strokeWidth="5" strokeLinecap="round" />
        <line x1="550" y1="560" x2="585" y2="670" stroke="black" strokeWidth="5" strokeLinecap="round" />

        {/* Head (Outer shapes with strokes) */}
        <circle cx="502" cy="305" r="34" fill="white" stroke="black" strokeWidth="4" />
        <circle cx="598" cy="305" r="34" fill="white" stroke="black" strokeWidth="4" />
        <circle cx="550" cy="295" r="46" fill="white" stroke="black" strokeWidth="4" />

        {/* Head Fills (Drawn over inner stroke lines to merge them) */}
        <circle cx="502" cy="305" r="32" fill="white" />
        <circle cx="598" cy="305" r="32" fill="white" />
        <circle cx="550" cy="295" r="44" fill="white" />

        {/* Hair strands */}
        <line x1="535" y1="245" x2="530" y2="230" stroke="black" strokeWidth="2" />
        <line x1="550" y1="242" x2="550" y2="225" stroke="black" strokeWidth="2" />
        <line x1="565" y1="245" x2="570" y2="230" stroke="black" strokeWidth="2" />
        {/* Cheek hair */}
        <line x1="465" y1="305" x2="455" y2="303" stroke="black" strokeWidth="1.5" />
        <line x1="467" y1="315" x2="457" y2="317" stroke="black" strokeWidth="1.5" />
        <line x1="635" y1="305" x2="645" y2="303" stroke="black" strokeWidth="1.5" />
        <line x1="633" y1="315" x2="643" y2="317" stroke="black" strokeWidth="1.5" />

        {/* Face details */}
        <ellipse cx="532" cy="290" rx="4.5" ry="6.5" fill="black" />
        <ellipse cx="568" cy="290" rx="4.5" ry="6.5" fill="black" />
        <path d="M 522 280 Q 532 277 540 283" stroke="black" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <path d="M 578 280 Q 568 277 560 283" stroke="black" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        
        {/* Sad small open mouth */}
        <ellipse cx="550" cy="322" rx="6" ry="4" fill="white" stroke="black" strokeWidth="2" />
        <path d="M 540 342 Q 550 348 560 342" stroke="black" strokeWidth="2.5" fill="none" strokeLinecap="round" />

        {/* Tears */}
        <Tears frame={frame} x={532} y={296} delay={0} />
        <Tears frame={frame} x={568} y={296} delay={15} />
      </g>


      {/* PRISONER 2: Angry Little Guy (Bottom Center) */}
      <g style={{ transform: `translate(${angryShake}px, ${prisoner2Bob + 120}px)` }}>
        {/* Body (Extended upwards from 440 to 425 to connect inside head) */}
        <line x1="670" y1="425" x2="670" y2="580" stroke="black" strokeWidth="4" strokeLinecap="round" />
        <path d="M 670 460 Q 650 480 640 520" stroke="black" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M 670 460 Q 690 480 700 520" stroke="black" strokeWidth="3" fill="none" strokeLinecap="round" />
        <line x1="670" y1="530" x2="645" y2="600" stroke="black" strokeWidth="4" strokeLinecap="round" />
        <line x1="670" y1="530" x2="695" y2="600" stroke="black" strokeWidth="4" strokeLinecap="round" />

        {/* Head */}
        <circle cx="670" cy="390" r="45" fill="white" stroke="black" strokeWidth="4" />

        {/* Face */}
        <circle cx="658" cy="385" r="3.5" fill="black" />
        <circle cx="682" cy="385" r="3.5" fill="black" />
        <line x1="650" y1="375" x2="665" y2="382" stroke="black" strokeWidth="3" strokeLinecap="round" />
        <line x1="690" y1="375" x2="675" y2="382" stroke="black" strokeWidth="3" strokeLinecap="round" />
        <path d="M 660 410 Q 670 405 680 410" stroke="black" strokeWidth="2.5" fill="none" strokeLinecap="round" />

        {/* Tears */}
        <Tears frame={frame} x={658} y={389} delay={5} />
        <Tears frame={frame} x={682} y={389} delay={22} />
      </g>


      {/* PRISONER 3: Brown Hair (Middle Right) */}
      <g style={{ transform: `translateY(${prisoner3Bob}px)` }}>
        {/* Body (Extended upwards from 390 to 345 to connect inside head) */}
        <line x1="820" y1="345" x2="820" y2="670" stroke="black" strokeWidth="4" strokeLinecap="round" />
        <path d="M 820 430 Q 780 440 760 550" stroke="black" strokeWidth="4" fill="none" strokeLinecap="round" />
        <path d="M 820 430 Q 860 440 880 550" stroke="black" strokeWidth="4" fill="none" strokeLinecap="round" />
        <line x1="820" y1="550" x2="785" y2="670" stroke="black" strokeWidth="5" strokeLinecap="round" />
        <line x1="820" y1="550" x2="855" y2="670" stroke="black" strokeWidth="5" strokeLinecap="round" />

        {/* LAYER 1: Hair Backing */}
        <path
          d="M 764 300 C 760 210, 880 210, 876 300 Q 880 345, 874 360 Q 865 350, 855 360 Q 845 350, 835 360 Q 825 350, 815 360 Q 805 350, 795 360 Q 785 350, 775 360 Q 765 350, 764 300 Z"
          fill="#5c3d2e"
          stroke="black"
          strokeWidth="4"
        />

        {/* LAYER 2: Head Face (White Circle, overlays back hair) */}
        <circle cx="820" cy="305" r="52" fill="white" stroke="black" strokeWidth="4" />

        {/* LAYER 3: Forehead Bangs (Drawn over the forehead) */}
        <path
          d="M 768 295 Q 820 262 872 295 C 865 245, 775 245, 768 295 Z"
          fill="#5c3d2e"
          stroke="black"
          strokeWidth="3"
        />

        {/* Face features */}
        <circle cx="810" cy="305" r="4.5" fill="black" />
        <circle cx="845" cy="305" r="4.5" fill="black" />
        <path d="M 802 297 Q 812 293 820 299" stroke="black" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <path d="M 853 299 Q 843 293 835 297" stroke="black" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        
        {/* Annoyed Mouth */}
        <path
          d={`M 810 ${325 + mouth3Wobble} Q 825 ${328 - mouth3Wobble} 840 ${323 + mouth3Wobble}`}
          stroke="black"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />

        {/* Tears */}
        <Tears frame={frame} x={810} y={310} delay={10} />
        <Tears frame={frame} x={845} y={310} delay={30} />
      </g>


      {/* PRISONER 4: Blonde Hair, Wrinkly Smile (Right) */}
      <g style={{ transform: `translateY(${prisoner4Bob}px)` }}>
        {/* Body (Extended upwards from 390 to 345 to connect inside head) */}
        <line x1="1050" y1="345" x2="1050" y2="670" stroke="black" strokeWidth="4" strokeLinecap="round" />
        <path d="M 1050 430 Q 1020 450 1000 560" stroke="black" strokeWidth="4" fill="none" strokeLinecap="round" />
        <path d="M 1050 430 Q 1080 450 1100 560" stroke="black" strokeWidth="4" fill="none" strokeLinecap="round" />
        <line x1="1050" y1="560" x2="1015" y2="670" stroke="black" strokeWidth="5" strokeLinecap="round" />
        <line x1="1050" y1="560" x2="1085" y2="670" stroke="black" strokeWidth="5" strokeLinecap="round" />

        {/* LAYER 1: Blonde Hair Backing */}
        <path
          d="M 992 300 C 988 200, 1112 200, 1108 300 C 1120 310, 1115 340, 1105 340 Q 1095 328, 1085 338 Q 1075 318, 1065 328 Q 1050 318, 1035 328 Q 1025 323, 1015 333 Q 1005 318, 995 328 C 985 328, 980 308, 992 300 Z"
          fill="#ebdfa2"
          stroke="black"
          strokeWidth="4"
        />

        {/* LAYER 2: Face Circle */}
        <circle cx="1050" cy="305" r="52" fill="white" stroke="black" strokeWidth="4" />

        {/* LAYER 3: Hair Bangs (Curly/rounded shapes on top forehead) */}
        <path
          d="M 997 290 Q 1050 255 1103 290 C 1095 240, 1005 240, 997 290 Z"
          fill="#ebdfa2"
          stroke="black"
          strokeWidth="2.5"
        />
        {/* Curled fringe side details */}
        <path d="M 994 300 Q 986 312 996 322" stroke="black" strokeWidth="2.5" fill="#ebdfa2" />
        <path d="M 1106 300 Q 1114 312 1104 322" stroke="black" strokeWidth="2.5" fill="#ebdfa2" />

        {/* Face details & Wrinkles */}
        <circle cx="1030" cy="300" r="4.5" fill="black" />
        <circle cx="1070" cy="300" r="4.5" fill="black" />
        <rect x="1042" y="315" width="16" height="12" rx="3" fill="black" />
        <rect x="1045" y="315" width="4" height="5" fill="white" />
        
        <path d="M 1025 260 Q 1050 255 1075 260" stroke="black" strokeWidth="1.5" fill="none" />
        <path d="M 1030 268 Q 1050 264 1070 268" stroke="black" strokeWidth="1.5" fill="none" />
        <path d="M 1020 310 Q 1015 320 1025 330" stroke="black" strokeWidth="1" fill="none" />
        <path d="M 1080 310 Q 1085 320 1075 330" stroke="black" strokeWidth="1" fill="none" />
        <path d="M 1035 332 Q 1050 336 1065 332" stroke="black" strokeWidth="1.5" fill="none" />
        <path d="M 1038 338 Q 1050 342 1062 338" stroke="black" strokeWidth="1" fill="none" />

        {/* Tears */}
        <Tears frame={frame} x={1030} y={305} delay={8} />
        <Tears frame={frame} x={1070} y={305} delay={25} />
      </g>


      {/* ========================================================
          THE JAIL BARS LAYER (In front of prisoners)
          ======================================================== */}
      <g id="jail-bars">
        <rect x="380" y="0" width="900" height="20" fill="#2d2d2d" stroke="black" strokeWidth="3" />
        <rect x="380" y="700" width="900" height="20" fill="#2d2d2d" stroke="black" strokeWidth="3" />

        <path d="M 480 15 Q 470 360 480 705" stroke="#7f7f7f" strokeWidth="16" fill="none" strokeLinecap="round" />
        <path d="M 480 15 Q 470 360 480 705" stroke="black" strokeWidth="16" fill="none" strokeDasharray="2 30" opacity="0.3" />
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
          GUARD LAYER (In front of the jail/wall)
          ======================================================== */}
      <g
        style={{
          transform: `translate(140px, 420px) scale(${guardBreatheX}, ${guardBreatheY})`,
          transformOrigin: "70px 250px",
        }}
      >
        <g style={{ transform: `translateY(${guardBob}px)` }}>
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

          {/* Weapon */}
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
