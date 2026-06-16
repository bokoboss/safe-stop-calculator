import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Legend } from 'recharts';

interface ChartProps {
  data: any[];
  currentSpeed: number;
  darkMode?: boolean;
}

export const ResultsChart: React.FC<ChartProps> = ({ data, currentSpeed, darkMode = false }) => {
  const textColor = darkMode ? '#94a3b8' : '#94a3b8';
  const gridColor = darkMode ? '#334155' : '#f1f5f9';
  
  return (
    <div className="w-full h-full select-none">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorReaction" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#bfdbfe" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#bfdbfe" stopOpacity={0.1}/>
            </linearGradient>
            <linearGradient id="colorBraking" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#2563eb" stopOpacity={0.1}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
          <XAxis 
            dataKey="speed" 
            axisLine={false}
            tickLine={false}
            tick={{ fill: textColor, fontSize: 10, fontWeight: 600 }}
            dy={10}
            label={{ value: 'ความเร็ว (km/h)', position: 'insideBottomRight', offset: -5, fill: textColor, fontSize: 10 }}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fill: textColor, fontSize: 10, fontWeight: 600 }}
            label={{ value: 'ระยะทาง (m)', angle: -90, position: 'insideLeft', fill: textColor, fontSize: 10 }}
          />
          <Tooltip
            contentStyle={{ 
              borderRadius: '8px', 
              border: `1px solid ${darkMode ? '#475569' : '#e2e8f0'}`, 
              boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)', 
              fontSize: '12px', 
              fontWeight: 600,
              backgroundColor: darkMode ? '#1e293b' : '#ffffff',
              color: darkMode ? '#f1f5f9' : '#1e293b'
            }}
            labelFormatter={(value) => `v = ${value} km/h`}
            formatter={(value: number, name: string) => {
              if (name === 'reactionDist') return [`${value} m`, 'Reaction Dist'];
              if (name === 'brakingDist') return [`${value} m`, 'Braking Dist'];
              return [`${value} m`, name];
            }}
          />
          <Legend 
            wrapperStyle={{ 
              fontSize: '11px', 
              paddingTop: '10px',
              color: textColor
            }}
            formatter={(value) => <span style={{ color: darkMode ? '#cbd5e1' : '#475569' }}>{value}</span>}
          />
          <ReferenceLine x={currentSpeed} stroke={darkMode ? '#94a3b8' : '#0f172a'} strokeDasharray="3 3" />
          <Area 
            type="monotone" 
            dataKey="reactionDist" 
            stackId="1" 
            stroke="#60a5fa" 
            fill="url(#colorReaction)" 
            name="Reaction Distance"
          />
          <Area 
            type="monotone" 
            dataKey="brakingDist" 
            stackId="1" 
            stroke="#2563eb" 
            fill="url(#colorBraking)" 
            name="Braking Distance"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
