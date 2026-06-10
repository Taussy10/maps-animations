import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

interface HighlightWordProps {
  children: React.ReactNode;
  triggerFrame: number;
  highlightColor?: string;
}

const HighlightWord: React.FC<HighlightWordProps> = ({ children, triggerFrame, highlightColor = "#fdfd96" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Animate the highlight using a spring physics effect starting exactly at the triggerFrame
  const progress = spring({
    fps,
    frame: frame - triggerFrame,
    config: { damping: 200 },
  });

  const widthPercentage = interpolate(progress, [0, 1], [0, 100]);

  return (
    <span style={{ position: "relative", display: "inline-block" }}>
      {/* Background highlight sweeping from left to right */}
      <span
        style={{
          position: "absolute",
          left: 0,
          top: "15%",
          height: "75%",
          backgroundColor: highlightColor,
          width: `${widthPercentage}%`,
          zIndex: -1,
        }}
      />
      {/* Actual Text */}
      <span style={{ position: "relative", zIndex: 1, padding: "0 4px" }}>
        {children}
      </span>
    </span>
  );
};

export const HighlightedHeadline: React.FC<{ startFrame: number }> = ({ startFrame }) => {
  const frame = useCurrentFrame();
  const localFrame = frame - startFrame;

  if (localFrame < 0) return null;

  // Subtle slow zoom over the duration of the scene
  const scale = interpolate(localFrame, [0, 116], [1, 1.05], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "transparent",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div 
        style={{ 
          backgroundColor: "#FFFFFF",
          padding: "40px 50px",
          borderRadius: "12px",
          boxShadow: "0px 20px 50px rgba(0,0,0,0.4)",
          maxWidth: "900px", 
          width: "100%",
          textAlign: "left",
          transform: `scale(${scale})`,
          color: "#000",
        }}
      >
        <div style={{ fontSize: "18px", color: "#666", marginBottom: "15px", textDecoration: "underline" }}>
          News
        </div>
        
        <div style={{ 
          fontSize: "52px", 
          fontWeight: "bold", 
          fontFamily: "Georgia, serif", 
          lineHeight: 1.3, 
          color: "#000",
          marginBottom: "25px"
        }}>
          <HighlightWord triggerFrame={28} highlightColor="#ffff00ff">Muhammad</HighlightWord> has been one of the{" "}
          <HighlightWord triggerFrame={62} highlightColor="#ffff00ff">most popular baby names</HighlightWord> in the UK
        </div>

        <div style={{ fontSize: "18px", color: "#555", marginBottom: "8px" }}>
          By <span style={{ textDecoration: "underline" }}>Cachella Smith</span>
        </div>
        
        <div style={{ fontSize: "16px", color: "#888", marginBottom: "30px" }}>
          5 December 2024
        </div>

        {/* Fake Google News Button */}
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          padding: "8px 16px",
          border: "1px solid #ddd",
          borderRadius: "20px",
          fontSize: "14px",
          color: "#333",
          fontWeight: "bold"
        }}>
          <span style={{ marginRight: "8px", fontSize: "18px" }}>📰</span> BBC News
        </div>
      </div>
    </AbsoluteFill>
  );
};
