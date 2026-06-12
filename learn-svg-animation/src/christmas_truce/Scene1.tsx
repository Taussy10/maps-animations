import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { TrenchBackground } from "./components/TrenchBackground";

export const Scene1: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <TrenchBackground />
    </AbsoluteFill>
  );
};
