import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';

export const OceanBackground: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ overflow: 'hidden', backgroundColor: '#78a6c2' }}>
      {/* Sky */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '25%', backgroundColor: '#a9c7d9' }} />
      
      {/* Ocean Waves */}
      <div style={{ position: 'absolute', top: '25%', left: 0, right: 0, bottom: 0 }}>
        <svg width="100%" height="100%" preserveAspectRatio="none">
           {/* Subtle wave lines fading into the distance */}
           <path d="M 0 50 Q 200 40 400 50 T 800 50 T 1280 50" fill="none" stroke="#8cb8d4" strokeWidth="3" opacity="0.7" />
           <path d="M -100 150 Q 150 170 400 150 T 900 150 T 1380 150" fill="none" stroke="#8cb8d4" strokeWidth="4" />
           <path d="M 50 300 Q 350 280 650 300 T 1250 300" fill="none" stroke="#8cb8d4" strokeWidth="5" />
        </svg>
      </div>
      
      {/* Dark smoke/shadow on the left and bottom */}
      <div style={{
         position: 'absolute', top: '20%', left: '-10%', width: '50%', bottom: 0,
         background: 'radial-gradient(ellipse at 30% 50%, rgba(60,60,60,0.4), transparent 70%)'
      }} />
      <div style={{
         position: 'absolute', bottom: 0, left: 0, width: '100%', height: '20%',
         background: 'linear-gradient(to top, rgba(50,50,50,0.6), transparent)'
      }} />
    </AbsoluteFill>
  );
};
