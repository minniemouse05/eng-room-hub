/**
 * SVG-embeddable room icons for use within SVG contexts (like HouseMap).
 * These render as <g> elements containing paths, suitable for inline SVG.
 */

import { RoomIconType } from './RoomIcon';

interface SvgRoomIconProps {
  icon: RoomIconType;
  x: number;
  y: number;
  size?: number;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  style?: React.CSSProperties;
}

// Lucide icon paths (24x24 viewBox, scaled and centered)
const iconPaths: Record<RoomIconType, string> = {
  // MessageCircle: path from Lucide
  entryway:
    'M7.9 20A9 9 0 1 0 4 16.1L2 22Z',
  // Wrench: path from Lucide
  workshop:
    'M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z',
  // Code2: handled separately with multiple paths
  maker: '',
  // Home: path from Lucide
  home:
    'M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8 M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z',
  // Heart: path from Lucide
  heart:
    'M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z',
};

// Code2 icon: </> with slash
const Code2Paths = () => (
  <>
    <path d="m18 16 4-4-4-4" />
    <path d="m6 8-4 4 4 4" />
    <path d="m14.5 4-5 16" />
  </>
);

export function SvgRoomIcon({
  icon,
  x,
  y,
  size = 24,
  fill = 'none',
  stroke = '#FFFFFF',
  strokeWidth = 2,
  style,
}: SvgRoomIconProps) {
  const scale = size / 24;
  const offsetX = x - size / 2;
  const offsetY = y - size / 2;

  if (icon === 'maker') {
    // Code2 icon has multiple paths
    return (
      <g
        transform={`translate(${offsetX}, ${offsetY}) scale(${scale})`}
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeWidth / scale}
        strokeLinecap="round"
        strokeLinejoin="round"
        style={style}
        aria-hidden="true"
      >
        <Code2Paths />
      </g>
    );
  }

  return (
    <g
      transform={`translate(${offsetX}, ${offsetY}) scale(${scale})`}
      fill={fill}
      stroke={stroke}
      strokeWidth={strokeWidth / scale}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={style}
      aria-hidden="true"
    >
      <path d={iconPaths[icon]} />
    </g>
  );
}
