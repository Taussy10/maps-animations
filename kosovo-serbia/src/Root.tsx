import "./index.css";
import { Composition } from "remotion";
import { MyComposition } from "./Composition";
import { KosovoSerbiaComposition } from "./kosovo-serbia/Composition";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="KosovoSerbia"
        component={KosovoSerbiaComposition}
        durationInFrames={1882}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="MyComp"
        component={MyComposition}
        durationInFrames={60}
        fps={30}
        width={1280}
        height={720}
      />
    </>
  );
};

