import React from "react";
import timestamps from "./timestamp-voice.json";
import { useCurrentFrame } from "remotion";

interface WordEntry {
  word: string;
  frame_start: number;
  frame_end: number;
}

const allWords = timestamps.words as WordEntry[];

export const Caption: React.FC = () => {
  const frame = useCurrentFrame();

  const activeWord = allWords.find(
    (w) => frame >= w.frame_start && frame < w.frame_end
  );

  if (!activeWord) return null;

  return (
    <div
      style={{
        position: "absolute",
        bottom: 300,
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
          color: "#FFFF00",
          WebkitTextStroke: "4px #000000",
          textShadow: "6px 6px 0px #000000",
          display: "inline-block",
        }}
      >
        {activeWord.word}
      </span>
    </div>
  );
};
