import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { OceanBackground } from './OceanBackground';
import { GermanCharacter } from '../GermanCharacter';

export const Scene1: React.FC = () => {
  const frame = useCurrentFrame();

  const waveY = Math.sin(frame / 15) * 8;
  const rotate = Math.sin(frame / 20) * 1.5;

  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      <OceanBackground />
      
      {/* Wrapper for the floating man and plank */}
      <div 
        style={{ 
          position: 'absolute',
          top: '30%', left: 0, right: 0, height: '40%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          transform: `translateY(${waveY}px) rotate(${rotate}deg)`,
        }}
      >
        {/* The Man's Head / Body */}
        <div style={{ position: 'absolute', zIndex: 1, top: '-150px', left: 'calc(50% - 100px)' }}>
          {/* Rotated arms so it looks like he is resting/clinging */}
          <GermanCharacter scale={0.7} leftArmRotation={-20} rightArmRotation={40} />
        </div>

        {/* The Irregular Plank */}
        <div style={{ position: 'absolute', zIndex: 2, top: '20%' }}>
          <svg width="400" height="120" viewBox="0 0 400 120" style={{ overflow: 'visible' }}>
             <path d="M 20 40 L 40 35 L 70 40 L 150 30 L 350 60 L 380 80 L 320 100 L 100 85 L 40 65 Z" fill="#755a4a" stroke="#222" strokeWidth="3" />
             
             {/* Edge depth */}
             <path d="M 20 40 L 20 50 L 40 75 L 100 95 L 320 110 L 380 90 L 380 80" fill="none" stroke="#222" strokeWidth="3" />
             <path d="M 20 40 L 20 50 L 40 75 L 100 95 L 320 110 L 380 90 L 380 80 L 350 60 L 150 30 L 70 40 L 40 35 Z" fill="#4a372b" opacity="0.5" />
             
             {/* Arms clinging overlapping plank */}
             <path d="M 170 30 Q 155 45 180 50" fill="none" stroke="#222" strokeWidth="4" strokeLinecap="round" />
             <path d="M 230 38 Q 245 50 220 55" fill="none" stroke="#222" strokeWidth="4" strokeLinecap="round" />
             
             {/* Plank details/lines */}
             <path d="M 50 45 L 300 75" fill="none" stroke="#422f22" strokeWidth="2" />
             <path d="M 80 65 L 320 90" fill="none" stroke="#422f22" strokeWidth="2" />
          </svg>
        </div>
      </div>

      {/* Debris Bottom Left */}
      <div style={{ position: 'absolute', bottom: '10%', left: '15%', zIndex: 3, transform: `translateY(${Math.cos(frame/12)*5}px) rotate(${-Math.sin(frame/15)*2}deg)` }}>
        <svg width="250" height="150" viewBox="0 0 250 150">
           {/* Tarp/Fabric */}
           <path d="M 20 120 Q 50 70 120 90 Q 180 60 210 100 L 180 140 Q 100 120 40 150 Z" fill="#4b4b4b" stroke="#222" strokeWidth="3" />
           {/* little spikes/debris sticking out */}
           <path d="M 170 75 L 185 50 M 185 85 L 205 60 M 200 95 L 225 75 M 210 105 L 235 95" fill="none" stroke="#222" strokeWidth="2" />
        </svg>
      </div>

      {/* Debris Bottom Right (metal frame) */}
      <div style={{ position: 'absolute', bottom: '-5%', right: '10%', zIndex: 3, transform: `translateY(${Math.cos(frame/18)*5}px) rotate(${Math.sin(frame/18)*3}deg)` }}>
        <svg width="300" height="200" viewBox="0 0 300 200">
           {/* Dark piece floating */}
           <path d="M 50 160 L 120 110 L 220 120 L 250 180 L 100 200 Z" fill="#586066" stroke="#222" strokeWidth="3" />
           {/* Metal pipes */}
           <path d="M 100 115 L 130 40 L 150 120" fill="none" stroke="#222" strokeWidth="8" strokeLinejoin="round" />
           <path d="M 120 40 L 250 15" fill="none" stroke="#222" strokeWidth="7" />
           {/* Highlight on pipes */}
           <path d="M 123 43 L 247 18" fill="none" stroke="#889" strokeWidth="2" />
        </svg>
      </div>
    </AbsoluteFill>
  );
};
