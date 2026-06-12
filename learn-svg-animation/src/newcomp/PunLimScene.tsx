import React from 'react';
import { AbsoluteFill } from 'remotion';
import { Scene1 } from './Scene1';

export const PunLimScene: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#000000' }}>
      <Scene1 />
    </AbsoluteFill>
  );
};
