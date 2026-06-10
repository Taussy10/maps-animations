import React from "react";
import { useCurrentFrame, spring, interpolate, Easing } from "remotion";

export const CryingFaceSVG: React.FC<{
  width?: number | string;
  height?: number | string;
  style?: React.CSSProperties;
  startFrame?: number;
}> = ({ width = 150, height = 150, style, startFrame = 0 }) => {
  const frame = useCurrentFrame();
  const localFrame = Math.max(0, frame - startFrame);

  // Add loop so tears keep falling
  const loopFrame1 = localFrame % 60;
  const loopTearScale1 = spring({ frame: loopFrame1 - 5, fps: 30, config: { damping: 12 } });
  const loopTearY1 = interpolate(loopFrame1, [10, 50], [0, 60], { extrapolateRight: "clamp" });
  const loopTearOpacity1 = interpolate(loopFrame1, [30, 50], [1, 0], { extrapolateRight: "clamp" });

  const loopFrame2 = (localFrame + 30) % 60;
  const loopTearScale2 = spring({ frame: loopFrame2 - 5, fps: 30, config: { damping: 12 } });
  const loopTearY2 = interpolate(loopFrame2, [10, 50], [0, 60], { extrapolateRight: "clamp" });
  const loopTearOpacity2 = interpolate(loopFrame2, [30, 50], [1, 0], { extrapolateRight: "clamp" });

  return (
    <svg viewBox="0 0 200 200" width={width} height={height} style={style}>
      {/* Left Eyebrow (Sad angle: inner high, outer low) */}
      <path
        d="M 40 70 Q 60 55 80 50"
        fill="none"
        stroke="#000000"
        strokeWidth="12"
        strokeLinecap="round"
      />
      {/* Right Eyebrow */}
      <path
        d="M 120 50 Q 140 55 160 70"
        fill="none"
        stroke="#000000"
        strokeWidth="12"
        strokeLinecap="round"
      />

      {/* Left Eye */}
      <ellipse cx="60" cy="95" rx="20" ry="25" fill="#FFFFFF" stroke="#000000" strokeWidth="6" />
      {/* Left Pupil (looking down) */}
      <circle cx="60" cy="105" r="10" fill="#000000" />
      {/* Left Eye reflection */}
      <circle cx="56" cy="100" r="3" fill="#FFFFFF" />

      {/* Right Eye */}
      <ellipse cx="140" cy="95" rx="20" ry="25" fill="#FFFFFF" stroke="#000000" strokeWidth="6" />
      {/* Right Pupil (looking down) */}
      <circle cx="140" cy="105" r="10" fill="#000000" />
      {/* Right Eye reflection */}
      <circle cx="136" cy="100" r="3" fill="#FFFFFF" />

      {/* Mouth (Frown) */}
      <path
        d="M 70 150 Q 100 120 130 150"
        fill="none"
        stroke="#000000"
        strokeWidth="12"
        strokeLinecap="round"
      />

      {/* Tear Left */}
      <g transform={`translate(60, ${105 + loopTearY1}) scale(${loopTearScale1})`} opacity={loopTearOpacity1}>
        <path d="M 0 0 C 10 20 10 30 0 30 C -10 30 -10 20 0 0" fill="#00A8FF" />
      </g>

      {/* Tear Right */}
      <g transform={`translate(140, ${105 + loopTearY2}) scale(${loopTearScale2})`} opacity={loopTearOpacity2}>
        <path d="M 0 0 C 10 20 10 30 0 30 C -10 30 -10 20 0 0" fill="#00A8FF" />
      </g>
    </svg>
  );
};
