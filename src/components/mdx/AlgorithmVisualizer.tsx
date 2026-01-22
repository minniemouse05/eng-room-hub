'use client';

import { useState, useEffect } from 'react';

type AlgorithmType = 'classification' | 'regression' | 'clustering' | 'reinforcement';

interface AlgorithmVisualizerProps {
  type?: AlgorithmType;
  showAll?: boolean;
}

// Classification: dots sorting into two buckets
function ClassificationViz({ isPlaying }: { isPlaying: boolean }) {
  return (
    <div className="relative h-40 w-full overflow-hidden">
      <svg viewBox="0 0 200 100" className="w-full h-full">
        {/* Buckets */}
        <rect x="20" y="70" width="60" height="25" rx="4" className="fill-blue-200 dark:fill-blue-800 stroke-blue-400 dark:stroke-blue-600" strokeWidth="2" />
        <rect x="120" y="70" width="60" height="25" rx="4" className="fill-red-200 dark:fill-red-800 stroke-red-400 dark:stroke-red-600" strokeWidth="2" />
        <text x="50" y="87" textAnchor="middle" className="fill-blue-700 dark:fill-blue-300 text-[8px] font-medium">Not Spam</text>
        <text x="150" y="87" textAnchor="middle" className="fill-red-700 dark:fill-red-300 text-[8px] font-medium">Spam</text>

        {/* Dots - blue ones */}
        {[
          { startX: 45, startY: 30, endX: 35, endY: 65 },
          { startX: 120, startY: 25, endX: 50, endY: 65 },
          { startX: 80, startY: 35, endX: 45, endY: 65 },
          { startX: 160, startY: 20, endX: 60, endY: 65 },
          { startX: 100, startY: 40, endX: 55, endY: 65 },
        ].map((dot, i) => (
          <circle
            key={`blue-${i}`}
            r="6"
            className="fill-blue-500 dark:fill-blue-400"
            style={{
              cx: isPlaying ? dot.endX : dot.startX,
              cy: isPlaying ? dot.endY : dot.startY,
              transition: `all 0.8s ease-out ${i * 0.15}s`,
            }}
          />
        ))}

        {/* Dots - red ones */}
        {[
          { startX: 60, startY: 20, endX: 135, endY: 65 },
          { startX: 140, startY: 35, endX: 150, endY: 65 },
          { startX: 90, startY: 25, endX: 145, endY: 65 },
          { startX: 170, startY: 30, endX: 160, endY: 65 },
          { startX: 110, startY: 15, endX: 165, endY: 65 },
        ].map((dot, i) => (
          <circle
            key={`red-${i}`}
            r="6"
            className="fill-red-500 dark:fill-red-400"
            style={{
              cx: isPlaying ? dot.endX : dot.startX,
              cy: isPlaying ? dot.endY : dot.startY,
              transition: `all 0.8s ease-out ${(i + 5) * 0.15}s`,
            }}
          />
        ))}
      </svg>
    </div>
  );
}

// Regression: line forming through points
function RegressionViz({ isPlaying }: { isPlaying: boolean }) {
  const points = [
    { x: 20, y: 75 },
    { x: 40, y: 65 },
    { x: 55, y: 60 },
    { x: 70, y: 50 },
    { x: 90, y: 45 },
    { x: 110, y: 38 },
    { x: 130, y: 32 },
    { x: 150, y: 28 },
    { x: 170, y: 22 },
    { x: 185, y: 18 },
  ];

  return (
    <div className="relative h-40 w-full overflow-hidden">
      <svg viewBox="0 0 200 100" className="w-full h-full">
        {/* Axes */}
        <line x1="15" y1="85" x2="190" y2="85" className="stroke-slate-300 dark:stroke-slate-600" strokeWidth="1" />
        <line x1="15" y1="85" x2="15" y2="10" className="stroke-slate-300 dark:stroke-slate-600" strokeWidth="1" />
        <text x="100" y="98" textAnchor="middle" className="fill-slate-500 dark:fill-slate-400 text-[7px]">House Size</text>
        <text x="8" y="50" textAnchor="middle" className="fill-slate-500 dark:fill-slate-400 text-[7px]" transform="rotate(-90, 8, 50)">Price</text>

        {/* Data points */}
        {points.map((point, i) => (
          <circle
            key={i}
            cx={point.x}
            cy={point.y}
            r="4"
            className="fill-indigo-400 dark:fill-indigo-500"
          />
        ))}

        {/* Trend line */}
        <line
          x1="15"
          y1="78"
          x2="190"
          y2="15"
          className="stroke-indigo-600 dark:stroke-indigo-400"
          strokeWidth="2"
          strokeDasharray="200"
          style={{
            strokeDashoffset: isPlaying ? 0 : 200,
            transition: 'stroke-dashoffset 1.5s ease-out',
          }}
        />
      </svg>
    </div>
  );
}

// Clustering: dots forming groups
function ClusteringViz({ isPlaying }: { isPlaying: boolean }) {
  const clusters = [
    // Cluster 1 (green) - top left
    { startX: 60, startY: 50, endX: 35, endY: 25, color: 'emerald' },
    { startX: 100, startY: 30, endX: 45, endY: 30, color: 'emerald' },
    { startX: 140, startY: 60, endX: 40, endY: 35, color: 'emerald' },
    { startX: 80, startY: 70, endX: 30, endY: 32, color: 'emerald' },
    // Cluster 2 (purple) - top right
    { startX: 50, startY: 40, endX: 155, endY: 25, color: 'purple' },
    { startX: 120, startY: 20, endX: 165, endY: 30, color: 'purple' },
    { startX: 170, startY: 50, endX: 160, endY: 35, color: 'purple' },
    { startX: 90, startY: 80, endX: 170, endY: 28, color: 'purple' },
    // Cluster 3 (orange) - bottom center
    { startX: 30, startY: 25, endX: 90, endY: 70, color: 'orange' },
    { startX: 160, startY: 35, endX: 100, endY: 75, color: 'orange' },
    { startX: 110, startY: 55, endX: 95, endY: 80, color: 'orange' },
    { startX: 70, startY: 65, endX: 105, endY: 72, color: 'orange' },
  ];

  const getColorClass = (color: string) => {
    switch (color) {
      case 'emerald': return 'fill-emerald-500 dark:fill-emerald-400';
      case 'purple': return 'fill-purple-500 dark:fill-purple-400';
      case 'orange': return 'fill-orange-500 dark:fill-orange-400';
      default: return 'fill-slate-500';
    }
  };

  return (
    <div className="relative h-40 w-full overflow-hidden">
      <svg viewBox="0 0 200 100" className="w-full h-full">
        {/* Cluster labels (appear after animation) */}
        <text
          x="38" y="15"
          textAnchor="middle"
          className="fill-emerald-600 dark:fill-emerald-400 text-[7px] font-medium"
          style={{ opacity: isPlaying ? 1 : 0, transition: 'opacity 0.5s ease-out 1.2s' }}
        >
          Group A
        </text>
        <text
          x="162" y="15"
          textAnchor="middle"
          className="fill-purple-600 dark:fill-purple-400 text-[7px] font-medium"
          style={{ opacity: isPlaying ? 1 : 0, transition: 'opacity 0.5s ease-out 1.2s' }}
        >
          Group B
        </text>
        <text
          x="98" y="95"
          textAnchor="middle"
          className="fill-orange-600 dark:fill-orange-400 text-[7px] font-medium"
          style={{ opacity: isPlaying ? 1 : 0, transition: 'opacity 0.5s ease-out 1.2s' }}
        >
          Group C
        </text>

        {/* Dots */}
        {clusters.map((dot, i) => (
          <circle
            key={i}
            r="6"
            className={isPlaying ? getColorClass(dot.color) : 'fill-slate-400 dark:fill-slate-500'}
            style={{
              cx: isPlaying ? dot.endX : dot.startX,
              cy: isPlaying ? dot.endY : dot.startY,
              transition: `all 1s ease-out ${i * 0.08}s`,
            }}
          />
        ))}
      </svg>
    </div>
  );
}

// Reinforcement Learning: agent learning to navigate
function ReinforcementViz({ isPlaying }: { isPlaying: boolean }) {
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (isPlaying) {
      setAttempt(0);
      const timer1 = setTimeout(() => setAttempt(1), 800);
      const timer2 = setTimeout(() => setAttempt(2), 1600);
      const timer3 = setTimeout(() => setAttempt(3), 2400);
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
      };
    } else {
      setAttempt(0);
    }
  }, [isPlaying]);

  const getAgentPosition = () => {
    if (!isPlaying) return { x: 20, y: 75 };
    switch (attempt) {
      case 0: return { x: 20, y: 75 };
      case 1: return { x: 60, y: 90 }; // Falls
      case 2: return { x: 100, y: 90 }; // Falls further
      case 3: return { x: 175, y: 25 }; // Success!
      default: return { x: 20, y: 75 };
    }
  };

  const pos = getAgentPosition();
  const showFail = attempt === 1 || attempt === 2;
  const showSuccess = attempt === 3;

  return (
    <div className="relative h-40 w-full overflow-hidden">
      <svg viewBox="0 0 200 100" className="w-full h-full">
        {/* Platforms */}
        <rect x="10" y="80" width="40" height="8" rx="2" className="fill-slate-300 dark:fill-slate-600" />
        <rect x="60" y="65" width="35" height="8" rx="2" className="fill-slate-300 dark:fill-slate-600" />
        <rect x="105" y="50" width="35" height="8" rx="2" className="fill-slate-300 dark:fill-slate-600" />
        <rect x="150" y="35" width="40" height="8" rx="2" className="fill-slate-300 dark:fill-slate-600" />

        {/* Goal flag */}
        <line x1="180" y1="15" x2="180" y2="35" className="stroke-slate-400 dark:stroke-slate-500" strokeWidth="2" />
        <polygon points="180,15 195,22 180,29" className="fill-green-500 dark:fill-green-400" />

        {/* Agent */}
        <circle
          cx={pos.x}
          cy={pos.y}
          r="8"
          className={`${showSuccess ? 'fill-green-500 dark:fill-green-400' : showFail ? 'fill-red-400 dark:fill-red-500' : 'fill-blue-500 dark:fill-blue-400'}`}
          style={{ transition: 'all 0.6s ease-out' }}
        />

        {/* Status text */}
        <text
          x="100" y="98"
          textAnchor="middle"
          className={`text-[8px] font-medium ${showSuccess ? 'fill-green-600 dark:fill-green-400' : showFail ? 'fill-red-500 dark:fill-red-400' : 'fill-slate-500 dark:fill-slate-400'}`}
        >
          {!isPlaying ? 'Click to start' : showSuccess ? 'Learned optimal path!' : showFail ? 'Trying again...' : 'Learning...'}
        </text>
      </svg>
    </div>
  );
}

export function AlgorithmVisualizer({ type, showAll = false }: AlgorithmVisualizerProps) {
  const [playing, setPlaying] = useState<Record<AlgorithmType, boolean>>({
    classification: false,
    regression: false,
    clustering: false,
    reinforcement: false,
  });

  const togglePlay = (t: AlgorithmType) => {
    setPlaying((prev) => ({ ...prev, [t]: !prev[t] }));
  };

  const playAll = () => {
    setPlaying({
      classification: true,
      regression: true,
      clustering: true,
      reinforcement: true,
    });
  };

  const resetAll = () => {
    setPlaying({
      classification: false,
      regression: false,
      clustering: false,
      reinforcement: false,
    });
  };

  const algorithms: { type: AlgorithmType; title: string; description: string }[] = [
    { type: 'classification', title: 'Classification', description: 'Sorting into categories' },
    { type: 'regression', title: 'Regression', description: 'Predicting numbers' },
    { type: 'clustering', title: 'Clustering', description: 'Finding natural groups' },
    { type: 'reinforcement', title: 'Reinforcement', description: 'Learning by trial & error' },
  ];

  const renderViz = (t: AlgorithmType, isPlaying: boolean) => {
    switch (t) {
      case 'classification': return <ClassificationViz isPlaying={isPlaying} />;
      case 'regression': return <RegressionViz isPlaying={isPlaying} />;
      case 'clustering': return <ClusteringViz isPlaying={isPlaying} />;
      case 'reinforcement': return <ReinforcementViz isPlaying={isPlaying} />;
    }
  };

  // Single algorithm view
  if (type && !showAll) {
    const algo = algorithms.find((a) => a.type === type);
    if (!algo) return null;

    return (
      <div className="my-6 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4">
        <div className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">{algo.title}</div>
        <div className="text-xs text-slate-500 dark:text-slate-400 mb-3">{algo.description}</div>
        {renderViz(type, playing[type])}
        <button
          onClick={() => togglePlay(type)}
          className="mt-3 px-3 py-1.5 text-xs font-medium rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
        >
          {playing[type] ? 'Reset' : 'Play'}
        </button>
      </div>
    );
  }

  // All algorithms view (2x2 grid)
  return (
    <div className="my-6">
      <div className="flex gap-2 mb-4">
        <button
          onClick={playAll}
          className="px-3 py-1.5 text-xs font-medium rounded bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-200 dark:hover:bg-indigo-900/60 transition-colors"
        >
          Play All
        </button>
        <button
          onClick={resetAll}
          className="px-3 py-1.5 text-xs font-medium rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
        >
          Reset
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {algorithms.map((algo) => (
          <div
            key={algo.type}
            className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 cursor-pointer hover:border-indigo-300 dark:hover:border-indigo-600 transition-colors"
            onClick={() => togglePlay(algo.type)}
          >
            <div className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">{algo.title}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mb-2">{algo.description}</div>
            {renderViz(algo.type, playing[algo.type])}
            <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-2 text-center">
              Click to {playing[algo.type] ? 'reset' : 'play'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
