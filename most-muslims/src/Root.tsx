import "./index.css";
import { Composition } from "remotion";
import { Comp1 } from "./comp-1/Comp1";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="Comp1"
        component={Comp1}
        durationInFrames={1555}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
