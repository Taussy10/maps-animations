import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export const PieChartAnimation: React.FC<{
  startFrame: number;
  endFrame: number;
}> = ({ startFrame, endFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Animate from 0 to 50 over 1 second (e.g. 30 frames)
  const progress = spring({
    frame: Math.max(0, frame - startFrame),
    fps,
    config: {
      damping: 200,
    },
  });

  // Calculate percentage (0 to 50)
  const percentage = interpolate(progress, [0, 1], [0, 50]);

  // SVG circle math:
  // r = 25, so circumference = 2 * Math.PI * 25 = 157.0796
  const circumference = 2 * Math.PI * 25;
  // stroke-dashoffset controls how much of the stroke is hidden
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <div
        style={{
          width: "300px",
          height: "300px",
          position: "relative",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#ffffff",
          borderRadius: "50%",
          boxShadow: "0 0 30px rgba(0,0,0,0.5)",
        }}
      >
        <svg width="100%" height="100%" viewBox="0 0 100 100" style={{ transform: "rotate(-90deg)" }}>
          <circle
            cx="50"
            cy="50"
            r="25"
            fill="transparent"
            stroke="#FF0000"
            strokeWidth="50"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="butt"
          />
        </svg>
        <div
          style={{
            position: "absolute",
            fontFamily: "monospace, sans-serif",
            fontSize: "60px",
            fontWeight: "bold",
            color: "#000000",
            textShadow: "0 0 10px rgba(255,255,255,0.8)",
            zIndex: 10,
          }}
        >
          {Math.round(percentage)}%
        </div>
      </div>
    </AbsoluteFill>
  );
};
