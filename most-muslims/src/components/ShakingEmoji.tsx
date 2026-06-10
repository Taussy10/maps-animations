import React from "react";
import { useCurrentFrame, interpolate, Easing } from "remotion";
import maplibregl from "maplibre-gl";

interface ShakingEmojiProps {
  map: maplibregl.Map;
  lngLat: [number, number];
  emoji: string;
  startFrame: number;
  endFrame: number;
}

export const ShakingEmoji: React.FC<ShakingEmojiProps> = ({
  map,
  lngLat,
  emoji,
  startFrame,
  endFrame,
}) => {
  const frame = useCurrentFrame();

  if (frame < startFrame || frame > endFrame) return null;

  // Calculate position on screen
  const pos = map.project(lngLat);

  // Oscillate back and forth. Math.sin with frame is deterministic
  // Let's use Remotion's interpolate with a cyclical pattern, or just Math.sin which is deterministic if based strictly on frame
  const localFrame = frame - startFrame;
  const shakeFrequency = 0.5; // Controls speed of shaking
  const shakeAmplitude = 25; // Degrees of rotation

  const rotation = Math.sin(localFrame * shakeFrequency) * shakeAmplitude;

  // Simple scale in/out for smooth appearance
  const scaleIn = interpolate(localFrame, [0, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.back(1.5)),
  });

  const duration = endFrame - startFrame;
  const scaleOut = interpolate(localFrame, [duration - 10, duration], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.ease),
  });

  const finalScale = scaleIn * scaleOut;

  return (
    <div
      style={{
        position: "absolute",
        left: pos.x,
        top: pos.y,
        transform: `translate(-50%, -50%) scale(${finalScale}) rotate(${rotation}deg)`,
        fontSize: "120px",
        pointerEvents: "none",
        zIndex: 60,
        textShadow: "0px 10px 20px rgba(0,0,0,0.5)", // Gives it a nice pop
      }}
    >
      {emoji}
    </div>
  );
};
