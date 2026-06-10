import React from "react";
import timestamps from "../comp-1/timestamp-Muslims.json";

interface WordEntry {
  word: string;
  frame_start: number;
  frame_end: number;
}

// ── Pre-load words at module level (zero runtime overhead) ──
const allWords = timestamps.words as WordEntry[];

export const Caption: React.FC<{ frame: number }> = ({ frame }) => {
  // Find the single word being spoken at this exact frame
  const activeWord = allWords.find(
    (w) => frame >= w.frame_start && frame < w.frame_end
  );

  // Nothing spoken at this frame → render nothing
  if (!activeWord) return null;

  return (
    <div
      style={{
        position: "absolute",
        bottom: 300, // Positioned higher up to clear map details
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 100,
        pointerEvents: "none",
      }}
    >
      <span
        style={{
          fontFamily: "'Poppins', sans-serif",
          fontWeight: 900,
          fontSize: "84px",
          lineHeight: 1.2,
          color: "#FFFF00", // Bright yellow
          WebkitTextStroke: "4px #000000", // Black stroke outline
          textShadow: "6px 6px 0px #000000", // Flat black offset shadow
          display: "inline-block",
        }}
      >
        {activeWord.word}
      </span>
    </div>
  );
};
