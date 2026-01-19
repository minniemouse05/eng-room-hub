"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { rooms } from "@/lib/rooms";
import { RoomId, Room } from "@/types";

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

  const isRoomActive = (roomId: RoomId) => {
    return hoveredRoom?.id === roomId || focusedRoom === roomId;
  };

  const isFocused = (roomId: RoomId) => {
    return focusedRoom === roomId;
  };

  return (
    <svg
      viewBox="0 0 400 350"
      className="w-full max-w-lg mx-auto"
      role="img"
      aria-label="Interactive house map with three rooms"
    >
      {/* Gradient definitions */}
      <defs>
        {/* Warm gradient for house body */}
        <linearGradient id="warmGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF5C6C" />
          <stop offset="50%" stopColor="#FF9A3D" />
          <stop offset="100%" stopColor="#FFD36A" />
        </linearGradient>

        {/* Cool gradient for roof */}
        <linearGradient id="coolGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2F5BFF" />
          <stop offset="50%" stopColor="#6A2CFF" />
          <stop offset="100%" stopColor="#B9A7FF" />
        </linearGradient>

        {/* Entryway gradient (violet/lavender) */}
        <linearGradient
          id="entrywayGradient"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#6A2CFF" />
          <stop offset="100%" stopColor="#B9A7FF" />
        </linearGradient>

        {/* Workshop gradient (coral/orange/yellow) */}
        <linearGradient
          id="workshopGradient"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#FF5C6C" />
          <stop offset="50%" stopColor="#FF9A3D" />
          <stop offset="100%" stopColor="#FFD36A" />
        </linearGradient>

        {/* Maker gradient (cyan/mint) */}
        <linearGradient id="makerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#39E6FF" />
          <stop offset="100%" stopColor="#7DFFC5" />
        </linearGradient>

        {/* Glow filter for hover states */}
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Strong focus glow filter */}
        <filter id="focusGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feFlood floodColor="#39E6FF" floodOpacity="0.6" result="color" />
          <feComposite in="color" in2="blur" operator="in" result="glow" />
          <feMerge>
            <feMergeNode in="glow" />
            <feMergeNode in="glow" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Text shadow filter for better readability */}
        <filter id="textShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow
            dx="0"
            dy="1"
            stdDeviation="2"
            floodColor="#000000"
            floodOpacity="0.5"
          />
        </filter>
      </defs>

      {/* Doodle decorations - sparkles and swirls */}
      <g className="animate-twinkle" style={{ animationDelay: "0s" }}>
        <line
          x1="45"
          y1="60"
          x2="45"
          y2="80"
          stroke="#FFFFFF"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.8"
        />
        <line
          x1="35"
          y1="70"
          x2="55"
          y2="70"
          stroke="#FFFFFF"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.8"
        />
      </g>

      <g className="animate-twinkle" style={{ animationDelay: "1s" }}>
        <line
          x1="355"
          y1="75"
          x2="355"
          y2="95"
          stroke="#FFFFFF"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.7"
        />
        <line
          x1="345"
          y1="85"
          x2="365"
          y2="85"
          stroke="#FFFFFF"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.7"
        />
      </g>

      <g className="animate-twinkle" style={{ animationDelay: "0.5s" }}>
        <circle cx="280" cy="45" r="2" fill="#FFFFFF" opacity="0.9" />
        <line
          x1="280"
          y1="38"
          x2="280"
          y2="52"
          stroke="#FFFFFF"
          strokeWidth="1"
          strokeLinecap="round"
          opacity="0.6"
        />
        <line
          x1="273"
          y1="45"
          x2="287"
          y2="45"
          stroke="#FFFFFF"
          strokeWidth="1"
          strokeLinecap="round"
          opacity="0.6"
        />
      </g>

      {/* Decorative swirl near roof */}
      <motion.path
        d="M 60 95 Q 70 80 85 90 Q 100 100 95 115"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.5"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2, delay: 0.5 }}
      />

      {/* Decorative geometric outline */}
      <motion.rect
        x="330"
        y="140"
        width="50"
        height="40"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="1.5"
        opacity="0.4"
        transform="rotate(15 355 160)"
        rx="2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ duration: 1, delay: 0.8 }}
      />

      {/* Speed lines / motion dashes */}
      <g opacity="0.4">
        <line
          x1="15"
          y1="180"
          x2="30"
          y2="180"
          stroke="#FFFFFF"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <line
          x1="10"
          y1="195"
          x2="28"
          y2="195"
          stroke="#FFFFFF"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <line
          x1="18"
          y1="210"
          x2="32"
          y2="210"
          stroke="#FFFFFF"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </g>

      {/* House outline - Roof with cool gradient */}
      <motion.path
        d="M200 20 L380 120 L380 130 L200 30 L20 130 L20 120 Z"
        fill="url(#coolGradient)"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      />

      {/* Roof doodle outline */}
      <motion.path
        d="M200 15 L385 118"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeDasharray="4 6"
        opacity="0.5"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, delay: 0.3 }}
      />

      {/* House outline - Main body with warm gradient */}
      <motion.rect
        x="40"
        y="120"
        width="320"
        height="210"
        fill="url(#warmGradient)"
        stroke="#FFFFFF"
        strokeWidth="1.5"
        strokeOpacity="0.4"
        rx="8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      />

      {/* Entryway - Center door area */}
      <motion.g
        onClick={() => handleRoomClick("entryway")}
        onMouseEnter={() => handleRoomHover("entryway")}
        onMouseLeave={() => handleRoomHover(null)}
        onFocus={() => setFocusedRoom("entryway")}
        onBlur={() => setFocusedRoom(null)}
        style={{ cursor: "pointer" }}
        tabIndex={0}
        role="button"
        aria-label="Enter Entryway - AI Chatbot room"
        filter={
          isFocused("entryway")
            ? "url(#focusGlow)"
            : isRoomActive("entryway")
              ? "url(#glow)"
              : undefined
        }
      >
        <motion.rect
          x="150"
          y="200"
          width="100"
          height="130"
          fill={
            isRoomActive("entryway")
              ? "url(#entrywayGradient)"
              : "rgba(106, 44, 255, 0.4)"
          }
          stroke={isFocused("entryway") ? "#39E6FF" : "#FFFFFF"}
          strokeWidth={
            isFocused("entryway") ? 3 : isRoomActive("entryway") ? 2 : 1.5
          }
          strokeOpacity={isRoomActive("entryway") ? 1 : 0.6}
          rx="6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.3 }}
        />
        {/* Door arch decoration */}
        <motion.path
          d="M160 200 Q200 170 240 200"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity={isRoomActive("entryway") ? 1 : 0.6}
        />
        {/* Door handle */}
        <circle
          cx="235"
          cy="270"
          r="5"
          fill="#FFFFFF"
          opacity={isRoomActive("entryway") ? 1 : 0.8}
        />
        {/* Door window */}
        <rect
          x="175"
          y="220"
          width="50"
          height="40"
          fill={
            isRoomActive("entryway")
              ? "rgba(255, 255, 255, 0.25)"
              : "rgba(255, 255, 255, 0.15)"
          }
          stroke="#FFFFFF"
          strokeWidth="1"
          strokeOpacity="0.6"
          rx="4"
        />
        {/* Icon */}
        <text
          x="200"
          y="290"
          textAnchor="middle"
          fontSize="24"
          fill="#FFFFFF"
          style={{
            filter: isRoomActive("entryway")
              ? "drop-shadow(0 0 8px rgba(255, 255, 255, 0.9))"
              : "none",
          }}
        >
          💬
        </text>
        {/* Label with text shadow for readability */}
        <text
          x="200"
          y="315"
          textAnchor="middle"
          fontSize="12"
          fontWeight="700"
          fill="#FFFFFF"
          filter="url(#textShadow)"
        >
          Entryway
        </text>
      </motion.g>

      {/* Workshop - Left window/room */}
      <motion.g
        onClick={() => handleRoomClick("workshop")}
        onMouseEnter={() => handleRoomHover("workshop")}
        onMouseLeave={() => handleRoomHover(null)}
        onFocus={() => setFocusedRoom("workshop")}
        onBlur={() => setFocusedRoom(null)}
        style={{ cursor: "pointer" }}
        tabIndex={0}
        role="button"
        aria-label="Enter Workshop - Tool Demos room"
        filter={
          isFocused("workshop")
            ? "url(#focusGlow)"
            : isRoomActive("workshop")
              ? "url(#glow)"
              : undefined
        }
      >
        <motion.rect
          x="55"
          y="140"
          width="80"
          height="80"
          fill={
            isRoomActive("workshop")
              ? "url(#workshopGradient)"
              : "rgba(255, 154, 61, 0.4)"
          }
          stroke={isFocused("workshop") ? "#39E6FF" : "#FFFFFF"}
          strokeWidth={
            isFocused("workshop") ? 3 : isRoomActive("workshop") ? 2 : 1.5
          }
          strokeOpacity={isRoomActive("workshop") ? 1 : 0.6}
          rx="6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        />
        {/* Window panes */}
        <line
          x1="95"
          y1="140"
          x2="95"
          y2="220"
          stroke="#FFFFFF"
          strokeWidth="1"
          opacity="0.5"
        />
        <line
          x1="55"
          y1="180"
          x2="135"
          y2="180"
          stroke="#FFFFFF"
          strokeWidth="1"
          opacity="0.5"
        />
        {/* Icon */}
        <text
          x="95"
          y="170"
          textAnchor="middle"
          fontSize="24"
          fill="#FFFFFF"
          style={{
            filter: isRoomActive("workshop")
              ? "drop-shadow(0 0 8px rgba(255, 255, 255, 0.9))"
              : "none",
          }}
        >
          🔧
        </text>
        {/* Label with text shadow */}
        <text
          x="95"
          y="205"
          textAnchor="middle"
          fontSize="11"
          fontWeight="700"
          fill="#FFFFFF"
          filter="url(#textShadow)"
        >
          Workshop
        </text>
      </motion.g>

      {/* Maker Studio - Right window/room */}
      <motion.g
        onClick={() => handleRoomClick("maker")}
        onMouseEnter={() => handleRoomHover("maker")}
        onMouseLeave={() => handleRoomHover(null)}
        onFocus={() => setFocusedRoom("maker")}
        onBlur={() => setFocusedRoom(null)}
        style={{ cursor: "pointer" }}
        tabIndex={0}
        role="button"
        aria-label="Enter Maker Studio - Coding Playgrounds room"
        filter={
          isFocused("maker")
            ? "url(#focusGlow)"
            : isRoomActive("maker")
              ? "url(#glow)"
              : undefined
        }
      >
        <motion.rect
          x="265"
          y="140"
          width="80"
          height="80"
          fill={
            isRoomActive("maker")
              ? "url(#makerGradient)"
              : "rgba(57, 230, 255, 0.4)"
          }
          stroke={isFocused("maker") ? "#39E6FF" : "#FFFFFF"}
          strokeWidth={isFocused("maker") ? 3 : isRoomActive("maker") ? 2 : 1.5}
          strokeOpacity={isRoomActive("maker") ? 1 : 0.6}
          rx="6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        />
        {/* Window panes */}
        <line
          x1="305"
          y1="140"
          x2="305"
          y2="220"
          stroke="#FFFFFF"
          strokeWidth="1"
          opacity="0.5"
        />
        <line
          x1="265"
          y1="180"
          x2="345"
          y2="180"
          stroke="#FFFFFF"
          strokeWidth="1"
          opacity="0.5"
        />
        {/* Icon */}
        <text
          x="305"
          y="170"
          textAnchor="middle"
          fontSize="24"
          fill="#FFFFFF"
          style={{
            filter: isRoomActive("maker")
              ? "drop-shadow(0 0 8px rgba(255, 255, 255, 0.9))"
              : "none",
          }}
        >
          💻
        </text>
        {/* Label with text shadow */}
        <text
          x="305"
          y="205"
          textAnchor="middle"
          fontSize="10"
          fontWeight="700"
          fill="#FFFFFF"
          filter="url(#textShadow)"
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
        fill="url(#coolGradient)"
        stroke="#FFFFFF"
        strokeWidth="1"
        strokeOpacity="0.5"
        rx="4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      />

      {/* Welcome text on roof with shadow for readability */}
      <text
        x="200"
        y="90"
        textAnchor="middle"
        fontSize="14"
        fontWeight="700"
        fill="#FFFFFF"
        filter="url(#textShadow)"
      >
        Come Explore!
      </text>

      {/* Additional doodle decoration - circle swirl */}
      <motion.circle
        cx="375"
        cy="290"
        r="15"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="1.5"
        opacity="0.4"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1, delay: 1 }}
      />
      <motion.circle
        cx="375"
        cy="290"
        r="8"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="1"
        opacity="0.3"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.8, delay: 1.2 }}
      />
    </svg>
  );
}
