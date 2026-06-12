import "./index.css";
import { Composition } from "remotion";
import { MyComposition } from "./Composition";
import { CountryballScene } from "./CountryballScene";
import { PunLimScene } from "./newcomp/PunLimScene";
import { ChristmasTruceComposition } from "./christmas_truce/ChristmasTruceComposition";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="ChristmasTruce"
        component={ChristmasTruceComposition}
        durationInFrames={600}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="PunLimStory"
        component={PunLimScene}
        durationInFrames={450}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="MyComp"
        component={MyComposition}
        durationInFrames={480}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="Countryball"
        component={CountryballScene}
        durationInFrames={300}
        fps={30}
        width={1280}
        height={720}
      />
    </>
  );
};
