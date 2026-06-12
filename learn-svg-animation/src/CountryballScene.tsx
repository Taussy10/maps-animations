import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring } from 'remotion';

export const CountryballScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Intro bounce animation
  const bounce = spring({
    frame,
    fps,
    config: {
      damping: 10,
      stiffness: 100,
      mass: 0.5,
    },
  });

  // Continuous floating animation
  const yOffset = Math.sin(frame / 10) * 20;
  
  // Blinking animation
  const isBlinking = frame % 120 < 6;

  // Angry Hand gesture animations (faster, larger)
  const leftHandY = Math.sin(frame * 0.4) * 40; // Angry flailing
  const rightHandY = Math.cos(frame * 0.4) * 40; 

  // Angry Talking mouth animation (faster, sharper)
  const mouthScale = 0.4 + Math.abs(Math.sin(frame * 0.8)) * 0.6;

  // Pupil movement (sharp erratic looking)
  const pupilX = Math.sin(frame * 0.3) * 8;

  return (
    <AbsoluteFill style={{ backgroundColor: '#282c34', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ transform: `scale(${bounce}) translateY(${yOffset}px)` }}>
        <svg width="400" height="400" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <clipPath id="circleClip">
              <circle cx="200" cy="200" r="180" />
            </clipPath>
            <radialGradient id="sphereShadow" cx="35%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
              <stop offset="60%" stopColor="#000000" stopOpacity="0" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0.6" />
            </radialGradient>
          </defs>

          {/* Feet */}
          <ellipse cx="130" cy="380" rx="40" ry="25" fill="#ffffff" stroke="#222222" strokeWidth="8" />
          <ellipse cx="270" cy="380" rx="40" ry="25" fill="#ffffff" stroke="#222222" strokeWidth="8" />

          <g clipPath="url(#circleClip)">
            <image 
              href="https://upload.wikimedia.org/wikipedia/commons/c/ca/Flag_of_Iran.svg" 
              x="20" y="20" width="360" height="360" 
              preserveAspectRatio="xMidYMid slice" 
            />
          </g>

          <circle cx="200" cy="200" r="180" fill="url(#sphereShadow)" stroke="#222222" strokeWidth="12" />

          {/* Hands (Angry Animated) */}
          <circle cx="20" cy={250 + leftHandY} r="30" fill="#ffffff" stroke="#222222" strokeWidth="8" />
          <circle cx="380" cy={250 + rightHandY} r="30" fill="#ffffff" stroke="#222222" strokeWidth="8" />

          {/* Eyes & Pupils (Animated) */}
          <g style={{ 
            transformOrigin: '200px 180px', 
            transform: `scaleY(${isBlinking ? 0.1 : 1})` 
          }}>
            <path d="M 100 150 C 130 140, 160 160, 160 190 C 160 210, 140 225, 110 220 C 80 215, 80 160, 100 150 Z" 
                  fill="#ffffff" stroke="#222222" strokeWidth="6" strokeLinejoin="round" />
            <circle cx={125 + pupilX} cy="185" r="12" fill="#000000" />
            {/* Left Angry Eyebrow */}
            <path d="M 80 110 L 160 150" stroke="#222222" strokeWidth="12" strokeLinecap="round" />
            
            <path d="M 300 150 C 270 140, 240 160, 240 190 C 240 210, 260 225, 290 220 C 320 215, 320 160, 300 150 Z" 
                  fill="#ffffff" stroke="#222222" strokeWidth="6" strokeLinejoin="round" />
            <circle cx={275 + pupilX} cy="185" r="12" fill="#000000" />
            {/* Right Angry Eyebrow */}
            <path d="M 320 110 L 240 150" stroke="#222222" strokeWidth="12" strokeLinecap="round" />
          </g>

          {/* Mouth (Angry Scowl / Talking) */}
          <g style={{
             transformOrigin: '200px 260px',
             transform: `scaleY(${mouthScale})`
          }}>
            <path d="M 160 280 Q 200 240 240 280 Q 200 260 160 280 Z" fill="#aa0000" stroke="#222222" strokeWidth="4" strokeLinejoin="round" />
          </g>
        </svg>
      </div>
    </AbsoluteFill>
  );
};
