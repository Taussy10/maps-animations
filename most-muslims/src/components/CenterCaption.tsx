import React from "react";
import timestamps from "../comp-1/timestamp-Muslims.json";

interface WordEntry {
  word: string;
  frame_start: number;
  frame_end: number;
}

const allWords = timestamps.words as WordEntry[];

export const CenterCaption: React.FC<{ frame: number }> = ({ frame }) => {
  const activeWord = allWords.find(
    (w) => frame >= w.frame_start && frame < w.frame_end
  );

  if (!activeWord) return null;

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
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
          fontWeight: "bold",
          fontSize: "140px", // Made it larger for the center screen
          lineHeight: 1.2,
          color: "#FFFFFF", // Standard white for black screen, stands out better
          display: "inline-block",
        }}
      >
        {activeWord.word}
      </span>
    </div>
  );
};
