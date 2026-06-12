import React from "react";
import { Sequence, AbsoluteFill } from "remotion";
import { Scene1 } from "./Scene1";
import { Scene2 } from "./Scene2";
import { Scene3 } from "./Scene3";
import { Scene4 } from "./Scene4";

export const ChristmasTruceComposition: React.FC = () => {
  return (
    <AbsoluteFill 
      style={{ 
        backgroundColor: "black",
        // Cinematic War Color Grading
        filter: "contrast(1.1) sepia(0.2) saturate(0.85)"
      }}
    >
      <Sequence from={0} durationInFrames={150}>
        <Scene1 />
      </Sequence>
      <Sequence from={150} durationInFrames={120}>
        <Scene2 />
      </Sequence>
      <Sequence from={270} durationInFrames={120}>
        <Scene3 />
      </Sequence>
      <Sequence from={390} durationInFrames={150}>
        <Scene4 />
      </Sequence>
      {/* Subsequent scenes will be added here */}

      {/* Global Cinematic Vignette Overlay */}
      <AbsoluteFill 
        style={{
          boxShadow: "inset 0 0 150px rgba(0,0,0,0.8)",
          pointerEvents: "none"
        }}
      />
    </AbsoluteFill>
  );
};
