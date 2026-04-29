import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Car } from 'lucide-react';
import { StoppingResults } from '../lib/physics';

interface SimulationProps {
  results: StoppingResults;
  isPlaying: boolean;
  onSimulationEnd: () => void;
}

export const Simulation: React.FC<SimulationProps> = ({ results, isPlaying, onSimulationEnd }) => {
  const [playKey, setPlayKey] = useState(0);

  useEffect(() => {
    if (isPlaying) setPlayKey(k => k + 1);
  }, [isPlaying]);

  // Use a percentage for the car's final position (leaving some space for the car itself)
  const maxWidth = 90; 
  const reactionPct = (results.reactionDistance / results.totalDistance) * maxWidth;
  const brakingPct = (results.brakingDistance / results.totalDistance) * maxWidth;

  return (
    <div className="relative w-full h-40 bg-slate-50 flex flex-col justify-end pb-4 border-t border-slate-100">
      
      {/* Distance Markers - Perfectly aligned with the track track */}
      <div className="w-full px-8 relative mb-2 h-10">
        <div className="relative w-full h-full">
          {/* Reaction marker */}
          <div 
            className="absolute bottom-0 h-full border-l-2 border-dashed border-amber-400 flex flex-col justify-end pb-1" 
            style={{ left: `${reactionPct}%` }}
          >
            <span className="absolute bottom-full -translate-x-1/2 text-[10px] text-amber-600 font-sans font-bold whitespace-nowrap mb-1">
              ตัดสินใจ
            </span>
          </div>
          {/* Total marker */}
          <div 
            className="absolute bottom-0 h-full border-l-2 border-dashed border-rose-400 flex flex-col justify-end pb-1" 
            style={{ left: `${reactionPct + brakingPct}%` }}
          >
            <span className="absolute bottom-full -translate-x-1/2 text-[10px] text-rose-600 font-sans font-bold whitespace-nowrap mb-1">
              หยุดรถ {results.totalDistance.toFixed(1)}m
            </span>
          </div>
        </div>
      </div>

      {/* Track Background */}
      <div className="relative w-full px-8">
        <div className="w-full h-12 bg-slate-800 rounded-lg relative overflow-hidden flex items-center shadow-inner">
          {/* Road Lines */}
          <div className="w-full h-1 flex justify-between absolute">
            {[...Array(20)].map((_, i) => (
              <div key={i} className="w-4 h-full bg-slate-500/40 rounded-full"></div>
            ))}
          </div>

          {/* Zones overlaid on road */}
          <div className="absolute inset-0 flex">
            <motion.div 
              className="h-full bg-amber-500/20 border-r border-amber-500/40 mix-blend-screen"
              animate={{ width: `${reactionPct}%` }}
              transition={{ duration: 0.3 }}
            />
            <motion.div 
              className="h-full bg-rose-500/20 border-r border-rose-500/40 mix-blend-screen"
              animate={{ width: `${brakingPct}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          {/* Animated Car */}
          <motion.div
            key={`car-${playKey}`}
            initial={{ left: isPlaying ? "0%" : `${reactionPct + brakingPct}%` }}
            animate={{ left: `${reactionPct + brakingPct}%` }}
            transition={
              isPlaying
                ? {
                    duration: results.timeTotal,
                    ease: "easeOut",
                  }
                : { duration: 0 }
            }
            onAnimationComplete={() => {
              if (isPlaying) onSimulationEnd();
            }}
            className="absolute z-10 text-white drop-shadow-md ml-1"
          >
            {/* Removed the -scale-x-100 which caused car to point left instead of right */}
            <Car size={32} className="fill-slate-100 text-slate-800" strokeWidth={1.5} />
          </motion.div>
        </div>
        
        {/* Zero marker at the start of track */}
        <div className="absolute left-8 top-full mt-2 text-[10px] font-mono text-slate-400">
          0m
        </div>
      </div>
    </div>
  );
};
