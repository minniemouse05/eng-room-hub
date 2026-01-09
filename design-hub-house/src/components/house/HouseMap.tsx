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
    const room = rooms.find((r) => r.id === roomId);
    return room?.color || '#6b7280';
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
      {/* House outline - Roof */}
      <motion.path
        d="M200 20 L380 120 L380 130 L200 30 L20 130 L20 120 Z"
        fill="#374151"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      />

      {/* House outline - Main body */}
      <motion.rect
        x="40"
        y="120"
        width="320"
        height="210"
        fill="#f3f4f6"
        stroke="#e5e7eb"
        strokeWidth="2"
        rx="4"
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
      >
        <motion.rect
          x="150"
          y="200"
          width="100"
          height="130"
          fill={isRoomActive('entryway') ? getRoomColor('entryway') : '#e0e7ff'}
          stroke={getRoomColor('entryway')}
          strokeWidth={isRoomActive('entryway') ? 3 : 2}
          rx="4"
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
          fill={isRoomActive('entryway') ? 'white' : '#c7d2fe'}
          rx="2"
        />
        {/* Icon placeholder */}
        <text
          x="200"
          y="290"
          textAnchor="middle"
          fontSize="24"
          fill={isRoomActive('entryway') ? 'white' : getRoomColor('entryway')}
        >
          💬
        </text>
        <text
          x="200"
          y="315"
          textAnchor="middle"
          fontSize="11"
          fontWeight="600"
          fill={isRoomActive('entryway') ? 'white' : '#374151'}
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
      >
        <motion.rect
          x="55"
          y="140"
          width="80"
          height="80"
          fill={isRoomActive('workshop') ? getRoomColor('workshop') : '#fef3c7'}
          stroke={getRoomColor('workshop')}
          strokeWidth={isRoomActive('workshop') ? 3 : 2}
          rx="4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        />
        {/* Window panes */}
        <line x1="95" y1="140" x2="95" y2="220" stroke={getRoomColor('workshop')} strokeWidth="1.5" />
        <line x1="55" y1="180" x2="135" y2="180" stroke={getRoomColor('workshop')} strokeWidth="1.5" />
        {/* Icon */}
        <text
          x="95"
          y="170"
          textAnchor="middle"
          fontSize="24"
          fill={isRoomActive('workshop') ? 'white' : getRoomColor('workshop')}
        >
          🔧
        </text>
        <text
          x="95"
          y="205"
          textAnchor="middle"
          fontSize="10"
          fontWeight="600"
          fill={isRoomActive('workshop') ? 'white' : '#374151'}
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
      >
        <motion.rect
          x="265"
          y="140"
          width="80"
          height="80"
          fill={isRoomActive('maker') ? getRoomColor('maker') : '#d1fae5'}
          stroke={getRoomColor('maker')}
          strokeWidth={isRoomActive('maker') ? 3 : 2}
          rx="4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        />
        {/* Window panes */}
        <line x1="305" y1="140" x2="305" y2="220" stroke={getRoomColor('maker')} strokeWidth="1.5" />
        <line x1="265" y1="180" x2="345" y2="180" stroke={getRoomColor('maker')} strokeWidth="1.5" />
        {/* Icon */}
        <text
          x="305"
          y="170"
          textAnchor="middle"
          fontSize="24"
          fill={isRoomActive('maker') ? 'white' : getRoomColor('maker')}
        >
          💻
        </text>
        <text
          x="305"
          y="205"
          textAnchor="middle"
          fontSize="9"
          fontWeight="600"
          fill={isRoomActive('maker') ? 'white' : '#374151'}
        >
          Maker Studio
        </text>
      </motion.g>

      {/* Chimney */}
      <motion.rect
        x="300"
        y="50"
        width="30"
        height="60"
        fill="#374151"
        rx="2"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      />

      {/* Welcome text on roof */}
      <text
        x="200"
        y="90"
        textAnchor="middle"
        fontSize="14"
        fontWeight="700"
        fill="#f9fafb"
      >
        Design Hub House
      </text>
    </svg>
  );
}
