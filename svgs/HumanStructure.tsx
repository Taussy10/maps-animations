import React from "react";

interface HumanStructureProps {
  fillColor?: string;
  glowColor?: string;
  glowWidth?: number;
  width?: string | number;
  height?: string | number;
  style?: React.CSSProperties;
  className?: string;
}

export const HumanStructure: React.FC<HumanStructureProps> = ({
  fillColor = "#FFFFFF",
  glowColor = "#FFFFFF",
  glowWidth = 6,
  width = "100%",
  height = "100%",
  style,
  className,
}) => {
  const filterId = React.useId ? React.useId() : "white-glow-filter";

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 150"
      width={width}
      height={height}
      style={style}
      className={className}
    >
      <defs>
        <filter id={filterId} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation={glowWidth} result="blur" />
          <feColorMatrix
            type="matrix"
            values={`
              0 0 0 0 ${parseInt(glowColor.slice(1, 3), 16) / 255 || 1}
              0 0 0 0 ${parseInt(glowColor.slice(3, 5), 16) / 255 || 1}
              0 0 0 0 ${parseInt(glowColor.slice(5, 7), 16) / 255 || 1}
              0 0 0 1 0
            `}
          />
          <feComponentTransfer result="brightBlur">
            <feFuncA type="linear" slope="2" />
          </feComponentTransfer>
          <feMerge>
            <feMergeNode in="brightBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <g filter={`url(#${filterId})`} fill={fillColor}>
        {/* Head */}
        <circle cx="50" cy="20" r="11" />
        
        {/* Torso */}
        <rect x="38" y="37" width="24" height="52" rx="12" />
        
        {/* Left Arm */}
        <rect x="24" y="37" width="10" height="42" rx="5" />
        
        {/* Right Arm */}
        <rect x="66" y="37" width="10" height="42" rx="5" />
        
        {/* Left Leg */}
        <rect x="38" y="95" width="10" height="45" rx="5" />
        
        {/* Right Leg */}
        <rect x="52" y="95" width="10" height="45" rx="5" />
      </g>
    </svg>
  );
};
