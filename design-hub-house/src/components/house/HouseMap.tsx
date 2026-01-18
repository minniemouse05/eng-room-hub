'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { rooms } from '@/lib/rooms';
import { RoomId, Room } from '@/types';

interface HouseMapProps {
  onRoomHover: (room: Room | null) => void;
  hoveredRoom: Room | null;
}

// New palette-aligned room colors
const ROOM_COLORS = {
  workshop: '#FD946F',   // Coral/orange
  entryway: '#4F61E3',   // Indigo
  maker: '#2CB4E0',      // Cyan
} as const;

const ROOM_FILLS = {
  workshop: '#FFF0E8',   // Light coral
  entryway: '#E8EBFF',   // Light indigo
  maker: '#E5F7FC',      // Light cyan
} as const;

const ROOM_FILLS_ACTIVE = {
  workshop: '#FFDCC9',   // Warmer coral
  entryway: '#D4DAFF',   // Warmer indigo
  maker: '#C9EFF9',      // Warmer cyan
} as const;

export function HouseMap({ onRoomHover, hoveredRoom }: HouseMapProps) {
  const router = useRouter();
  const [focusedRoom, setFocusedRoom] = useState<RoomId | null>(null);

  const handleRoomClick = (roomId: RoomId) => {
    const room = rooms.find((r) => r.id === roomId);
    if (room) {
      router.push(room.route);
    }
  };

  const handleRoomHover = (roomId: RoomId | null) => {
    if (roomId) {
      const room = rooms.find((r) => r.id === roomId);
      onRoomHover(room || null);
    } else {
      onRoomHover(null);
    }
  };

  const getRoomColor = (roomId: RoomId) => {
    return ROOM_COLORS[roomId] || '#6b7280';
  };

  const getRoomFill = (roomId: RoomId, active: boolean) => {
    if (active) {
      return ROOM_COLORS[roomId];
    }
    return ROOM_FILLS[roomId] || '#f3f4f6';
  };

  const isRoomActive = (roomId: RoomId) => {
    return hoveredRoom?.id === roomId || focusedRoom === roomId;
  };

  return (
    <svg
      viewBox="0 0 400 350"
      className="w-full max-w-lg mx-auto"
      role="img"
      aria-label="Interactive house map with three rooms"
    >
      {/* Gradient definitions for rainbow accents */}
      <defs>
        <linearGradient id="rainbowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0133FF" />
          <stop offset="30%" stopColor="#2CB4E0" />
          <stop offset="55%" stopColor="#FAD096" />
          <stop offset="75%" stopColor="#FD946F" />
          <stop offset="100%" stopColor="#B65EA0" />
        </linearGradient>
        <linearGradient id="roofGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#232323" />
          <stop offset="100%" stopColor="#242424" />
        </linearGradient>
        <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        {/* Icon symbols based on Lucide icons */}
        <symbol id="icon-message" viewBox="0 0 24 24">
          <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </symbol>
        <symbol id="icon-wrench" viewBox="0 0 24 24">
          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </symbol>
        <symbol id="icon-code" viewBox="0 0 24 24">
          <path d="m18 16 4-4-4-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="m6 8-4 4 4 4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="m14.5 4-5 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </symbol>
      </defs>

      {/* House outline - Roof with gradient */}
      <motion.path
        d="M200 20 L380 120 L380 130 L200 30 L20 130 L20 120 Z"
        fill="url(#roofGradient)"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      />

      {/* House outline - Main body with warm off-white */}
      <motion.rect
        x="40"
        y="120"
        width="320"
        height="210"
        fill="#FFF8F3"
        stroke="#E8E4DE"
        strokeWidth="2"
        rx="12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      />

      {/* Entryway - Center door area */}
      <motion.g
        onClick={() => handleRoomClick('entryway')}
        onMouseEnter={() => handleRoomHover('entryway')}
        onMouseLeave={() => handleRoomHover(null)}
        onFocus={() => setFocusedRoom('entryway')}
        onBlur={() => setFocusedRoom(null)}
        style={{ cursor: 'pointer' }}
        tabIndex={0}
        role="button"
        aria-label="Enter Entryway - AI Chatbot room"
        filter={isRoomActive('entryway') ? 'url(#softGlow)' : undefined}
      >
        <motion.rect
          x="150"
          y="200"
          width="100"
          height="130"
          fill={getRoomFill('entryway', isRoomActive('entryway'))}
          stroke={getRoomColor('entryway')}
          strokeWidth={isRoomActive('entryway') ? 3 : 2}
          rx="12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.3 }}
        />
        {/* Door handle */}
        <circle
          cx="235"
          cy="270"
          r="5"
          fill={getRoomColor('entryway')}
        />
        {/* Door window */}
        <rect
          x="175"
          y="220"
          width="50"
          height="40"
          fill={isRoomActive('entryway') ? 'rgba(255,255,255,0.9)' : '#D4DAFF'}
          rx="6"
        />
        {/* Icon */}
        <use
          href="#icon-message"
          x="188"
          y="268"
          width="24"
          height="24"
          color={isRoomActive('entryway') ? 'white' : getRoomColor('entryway')}
        />
        <text
          x="200"
          y="315"
          textAnchor="middle"
          fontSize="11"
          fontWeight="600"
          fill={isRoomActive('entryway') ? 'white' : '#1a1a2e'}
        >
          Entryway
        </text>
      </motion.g>

      {/* Workshop - Left window/room */}
      <motion.g
        onClick={() => handleRoomClick('workshop')}
        onMouseEnter={() => handleRoomHover('workshop')}
        onMouseLeave={() => handleRoomHover(null)}
        onFocus={() => setFocusedRoom('workshop')}
        onBlur={() => setFocusedRoom(null)}
        style={{ cursor: 'pointer' }}
        tabIndex={0}
        role="button"
        aria-label="Enter Workshop - Tool Demos room"
        filter={isRoomActive('workshop') ? 'url(#softGlow)' : undefined}
      >
        <motion.rect
          x="55"
          y="140"
          width="80"
          height="80"
          fill={getRoomFill('workshop', isRoomActive('workshop'))}
          stroke={getRoomColor('workshop')}
          strokeWidth={isRoomActive('workshop') ? 3 : 2}
          rx="12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        />
        {/* Window panes */}
        <line x1="95" y1="140" x2="95" y2="220" stroke={getRoomColor('workshop')} strokeWidth="1.5" strokeOpacity="0.5" />
        <line x1="55" y1="180" x2="135" y2="180" stroke={getRoomColor('workshop')} strokeWidth="1.5" strokeOpacity="0.5" />
        {/* Icon */}
        <use
          href="#icon-wrench"
          x="83"
          y="148"
          width="24"
          height="24"
          color={isRoomActive('workshop') ? 'white' : getRoomColor('workshop')}
        />
        <text
          x="95"
          y="205"
          textAnchor="middle"
          fontSize="10"
          fontWeight="600"
          fill={isRoomActive('workshop') ? 'white' : '#1a1a2e'}
        >
          Workshop
        </text>
      </motion.g>

      {/* Maker Studio - Right window/room */}
      <motion.g
        onClick={() => handleRoomClick('maker')}
        onMouseEnter={() => handleRoomHover('maker')}
        onMouseLeave={() => handleRoomHover(null)}
        onFocus={() => setFocusedRoom('maker')}
        onBlur={() => setFocusedRoom(null)}
        style={{ cursor: 'pointer' }}
        tabIndex={0}
        role="button"
        aria-label="Enter Maker Studio - Coding Playgrounds room"
        filter={isRoomActive('maker') ? 'url(#softGlow)' : undefined}
      >
        <motion.rect
          x="265"
          y="140"
          width="80"
          height="80"
          fill={getRoomFill('maker', isRoomActive('maker'))}
          stroke={getRoomColor('maker')}
          strokeWidth={isRoomActive('maker') ? 3 : 2}
          rx="12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        />
        {/* Window panes */}
        <line x1="305" y1="140" x2="305" y2="220" stroke={getRoomColor('maker')} strokeWidth="1.5" strokeOpacity="0.5" />
        <line x1="265" y1="180" x2="345" y2="180" stroke={getRoomColor('maker')} strokeWidth="1.5" strokeOpacity="0.5" />
        {/* Icon */}
        <use
          href="#icon-code"
          x="293"
          y="148"
          width="24"
          height="24"
          color={isRoomActive('maker') ? 'white' : getRoomColor('maker')}
        />
        <text
          x="305"
          y="205"
          textAnchor="middle"
          fontSize="9"
          fontWeight="600"
          fill={isRoomActive('maker') ? 'white' : '#1a1a2e'}
        >
          Maker Studio
        </text>
      </motion.g>

      {/* Chimney with gradient */}
      <motion.rect
        x="300"
        y="50"
        width="30"
        height="60"
        fill="url(#roofGradient)"
        rx="4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      />

      {/* Welcome text on roof */}
      {/* <text
        x="200"
        y="90"
        textAnchor="middle"
        fontSize="14"
        fontWeight="700"
        fill="#ffffff"
        style={{ textShadow: '0 1px 2px rgba(0,0,0,0.2)' }}
      >
        Design Hub House
      </text> */}
    </svg>
  );
}
