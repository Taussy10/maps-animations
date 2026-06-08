import React from "react";
import { Sequence } from "remotion";
import { Scene1 } from "./Scene1";
import { Scene2 } from "./Scene2";
import { Scene3 } from "./Scene3";
import { Scene4 } from "./Scene4";
import { Scene5 } from "./Scene5";
import { Scene6 } from "./Scene6";
import { Sequence as Scene7Sequence } from "remotion"; // avoiding namespace clash if any, or just direct imports
import { Scene7 } from "./Scene7";
import { Scene8 } from "./Scene8";

export const MyComposition = () => {
  return (
    <>
      <Sequence from={0} durationInFrames={60}>
        <Scene1 />
      </Sequence>
      <Sequence from={60} durationInFrames={60}>
        <Scene2 />
      </Sequence>
      <Sequence from={120} durationInFrames={60}>
        <Scene3 />
      </Sequence>
      <Sequence from={180} durationInFrames={60}>
        <Scene4 />
      </Sequence>
      <Sequence from={240} durationInFrames={60}>
        <Scene5 />
      </Sequence>
      <Sequence from={300} durationInFrames={60}>
        <Scene6 />
      </Sequence>
      <Sequence from={360} durationInFrames={60}>
        <Scene7 />
      </Sequence>
      <Sequence from={420} durationInFrames={60}>
        <Scene8 />
      </Sequence>
    </>
  );
};
