import React from "react";
import { useCurrentFrame, interpolate, spring } from "remotion";

export const AngryFaceSVG: React.FC<{
  width?: number | string;
  height?: number | string;
  style?: React.CSSProperties;
  startFrame?: number;
}> = ({ width = 150, height = 150, style, startFrame = 0 }) => {
  const frame = useCurrentFrame();
  const localFrame = Math.max(0, frame - startFrame);

  // Anger shake animation (rapid left/right offset)
  const shakeOffset =
    localFrame > 15
      ? Math.sin(localFrame * 1.5) * 4 // Fast shake
      : 0;

  // Eyebrow slam down animation
  const browSpring = spring({ frame: localFrame, fps: 30, config: { damping: 12, stiffness: 120 } });
  const browLeftAngle = interpolate(browSpring, [0, 1], [0, 25]); // Inner down
  const browRightAngle = interpolate(browSpring, [0, 1], [0, -25]); // Inner down

  // Face turn red
  const faceHue = interpolate(localFrame, [0, 30], [255, 200], { extrapolateRight: "clamp" });
  const faceColor = `rgb(255, ${faceHue}, ${faceHue})`;

  return (
    <svg viewBox="0 0 200 200" width={width} height={height} style={{ ...style, transform: `translateX(${shakeOffset}px)` }}>
      
      {/* Optional: Add a subtle red glow or background to the face itself if needed, but here we just rely on the map color */}

      {/* Left Eyebrow (Angry angle: inner low, outer high) */}
      <g transform={`translate(60, 55) rotate(${browLeftAngle})`}>
        <path
          d="M -20 -5 L 20 5"
          fill="none"
          stroke="#000000"
          strokeWidth="14"
          strokeLinecap="round"
        />
      </g>
      
      {/* Right Eyebrow */}
      <g transform={`translate(140, 55) rotate(${browRightAngle})`}>
        <path
          d="M -20 5 L 20 -5"
          fill="none"
          stroke="#000000"
          strokeWidth="14"
          strokeLinecap="round"
        />
      </g>

      {/* Left Eye */}
      <ellipse cx="60" cy="95" rx="20" ry="25" fill="#FFFFFF" stroke="#000000" strokeWidth="6" />
      {/* Left Pupil (looking aggressively down and center) */}
      <circle cx="65" cy="105" r="10" fill="#000000" />
      {/* Left Eye reflection */}
      <circle cx="61" cy="100" r="3" fill="#FFFFFF" />

      {/* Right Eye */}
      <ellipse cx="140" cy="95" rx="20" ry="25" fill="#FFFFFF" stroke="#000000" strokeWidth="6" />
      {/* Right Pupil (looking aggressively down and center) */}
      <circle cx="135" cy="105" r="10" fill="#000000" />
      {/* Right Eye reflection */}
      <circle cx="131" cy="100" r="3" fill="#FFFFFF" />

      {/* Mouth (Angry Gritty Teeth or shouting) */}
      <path
        d="M 60 150 Q 100 130 140 150"
        fill="none"
        stroke="#000000"
        strokeWidth="12"
        strokeLinecap="round"
      />
    </svg>
  );
};
