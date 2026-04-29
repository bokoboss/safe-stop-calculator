import React, { useState, useMemo } from 'react';
import { Settings, Play, Info, Calculator, ShieldCheck, RefreshCcw } from 'lucide-react';
import { calculateStoppingDistance, generateChartData, PRESETS, StoppingParams } from './lib/physics';
import { ResultsChart } from './components/ResultsChart';
import { Simulation } from './components/Simulation';

export default function App() {
  const [params, setParams] = useState<StoppingParams>({
    ...PRESETS[0].params,
    speedKmh: 90,
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const [activePreset, setActivePreset] = useState<string>(PRESETS[0].id);

  // Derive results
  const results = useMemo(() => calculateStoppingDistance(params), [params]);
  const chartData = useMemo(() => generateChartData(params), [params]);

  const handleParamChange = (key: keyof StoppingParams, value: number) => {
    setParams(prev => ({ ...prev, [key]: value }));
    setActivePreset(''); // Unselect preset if manually changed
  };

  const applyPreset = (presetId: string) => {
    const preset = PRESETS.find(p => p.id === presetId);
    if (preset) {
      setParams(prev => ({ ...preset.params, speedKmh: prev.speedKmh }));
      setActivePreset(presetId);
    }
  };

  const startSimulation = () => {
    setIsPlaying(false);
    setTimeout(() => setIsPlaying(true), 50);
  };

  return (
    <div className="flex flex-col md:flex-row h-screen w-full bg-slate-50 text-slate-900 font-sans overflow-hidden">
      
      {/* Sidebar: LEFT PANEL */}
      <aside className="w-full md:w-72 lg:w-80 bg-white border-r border-slate-200 flex flex-col p-5 space-y-6 shadow-sm z-10 shrink-0 md:h-full overflow-y-auto">
        <div className="space-y-1 mt-2">
          <h1 className="text-xl font-bold tracking-tight text-blue-900 italic">SAFE STOP CALCULATOR</h1>
          <p className="text-[10px] uppercase tracking-widest font-semibold text-slate-400 flex items-center">
            <Calculator className="w-3 h-3 mr-1" />
            Physics Engine V1.0
          </p>
        </div>

        <div className="space-y-3">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center">
            <Settings className="w-4 h-4 mr-2" />
            สถานการณ์อ้างอิง
          </div>
          <div className="grid grid-cols-2 gap-2">
            {PRESETS.map(p => (
              <button
                key={p.id}
                onClick={() => applyPreset(p.id)}
                className={`p-2 rounded-lg text-left transition-all border flex flex-col justify-center ${
                  activePreset === p.id 
                    ? 'bg-blue-50 border-blue-200 ring-1 ring-blue-500' 
                    : 'bg-slate-50 border-slate-200 hover:border-blue-300 hover:bg-slate-100'
                }`}
              >
                <div className={`font-bold text-[10px] uppercase tracking-widest ${activePreset === p.id ? 'text-blue-700' : 'text-slate-600'}`}>
                  {p.name}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-5 flex-1">
          {/* Speed Slider */}
          <div className="space-y-2">
            <label className="flex justify-between text-xs font-bold text-slate-600 uppercase">
              <span>ความเร็วรถ (Speed)</span>
              <span className="text-blue-600">{params.speedKmh} km/h</span>
            </label>
            <input 
              type="range" min="10" max="160" step="5"
              value={params.speedKmh}
              onChange={(e) => handleParamChange('speedKmh', Number(e.target.value))}
              className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>10</span>
              <span>160</span>
            </div>
          </div>

          {/* Reaction Slider */}
          <div className="space-y-2">
            <label className="flex justify-between text-xs font-bold text-slate-600 uppercase">
              <span className="flex items-center">
                เวลาตอบสนอง
                <div className="group relative ml-1 text-slate-400 hover:text-slate-600 cursor-help flex items-center">
                  <Info size={12} />
                  <div className="absolute hidden group-hover:block bottom-full mb-2 left-1/2 -translate-x-1/2 w-48 bg-slate-800 text-white text-[10px] p-2 rounded shadow-xl z-20 text-center font-normal normal-case">
                    เวลาที่ใช้ตั้งแต่เห็นสิ่งกีดขวางจนกระทั่งเหยียบเบรก
                  </div>
                </div>
              </span>
              <span className="text-blue-600">{params.reactionTime.toFixed(1)}s</span>
            </label>
            <input 
              type="range" min="0.5" max="4.0" step="0.1"
              value={params.reactionTime}
              onChange={(e) => handleParamChange('reactionTime', Number(e.target.value))}
              className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>0.5s</span>
              <span>4.0s</span>
            </div>
          </div>

          {/* Friction Slider */}
          <div className="space-y-2">
            <label className="flex justify-between text-xs font-bold text-slate-600 uppercase">
              <span>แรงเสียดทาน (μ)</span>
              <span className="text-blue-600">{params.friction.toFixed(2)}</span>
            </label>
            <input 
              type="range" min="0.2" max="1.0" step="0.01"
              value={params.friction}
              onChange={(e) => handleParamChange('friction', Number(e.target.value))}
              className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>0.2</span>
              <span>1.0</span>
            </div>
          </div>

          {/* Gradient */}
          <div className="space-y-2">
            <label className="flex justify-between text-xs font-bold text-slate-600 uppercase">
              <span>ความลาดชัน (%)</span>
              <span className="text-blue-600">{params.gradient > 0 ? '+' : ''}{params.gradient}%</span>
            </label>
            <input 
              type="range" min="-15" max="15" step="1"
              value={params.gradient}
              onChange={(e) => handleParamChange('gradient', Number(e.target.value))}
              className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>-15%</span>
              <span>+15%</span>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 mt-auto">
          <button 
            onClick={startSimulation}
            disabled={isPlaying}
            className="w-full flex justify-center items-center bg-blue-600 text-white py-3 rounded-lg font-bold text-sm hover:bg-blue-700 active:scale-[0.98] transition-all disabled:opacity-50 disabled:active:scale-100"
          >
            {isPlaying ? <RefreshCcw className="w-4 h-4 mr-2 animate-spin" /> : <Play className="w-4 h-4 mr-2" />}
            {isPlaying ? 'SIMULATING...' : 'RUN SIMULATION'}
          </button>
        </div>
      </aside>

      {/* Main Panel */}
      <main className="flex-1 flex flex-col p-6 space-y-6 overflow-y-auto">
        {/* Top Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Reaction Distance</div>
            <div className="text-3xl font-light text-slate-800">{results.reactionDistance.toFixed(1)} <span className="text-sm font-medium text-slate-400">m</span></div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Braking Distance</div>
            <div className="text-3xl font-light text-slate-800">{results.brakingDistance.toFixed(1)} <span className="text-sm font-medium text-slate-400">m</span></div>
          </div>
          <div className="bg-blue-900 p-4 rounded-xl shadow-lg shadow-blue-200">
            <div className="text-[10px] font-bold text-blue-300 uppercase tracking-widest mb-1">Total Safe SSD</div>
            <div className="text-3xl font-bold text-white">{results.totalDistance.toFixed(1)} <span className="text-sm font-medium text-blue-400">m</span></div>
          </div>
        </div>

        {/* Simulation Area */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex-1 min-h-[300px] flex flex-col relative">
          <div className="absolute top-6 left-6 flex items-center space-x-2 z-10">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Visual Simulation</span>
          </div>
          <div className="flex-1 mt-6 flex flex-col h-full justify-center">
            <Simulation 
              results={results} 
              isPlaying={isPlaying} 
              onSimulationEnd={() => setIsPlaying(false)} 
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:h-64">
          {/* Chart Area */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col">
            <h3 className="text-xs font-bold uppercase mb-4 text-slate-500">Stopping Curve (v vs SSD)</h3>
            <div className="flex-1 min-h-[160px]">
              <ResultsChart data={chartData} currentSpeed={params.speedKmh} />
            </div>
          </div>

          {/* Table Area */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden text-sm">
            <h3 className="text-xs font-bold uppercase mb-3 text-slate-500">Detailed Data Summary</h3>
            <div className="flex-1 overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="text-slate-400 border-b border-slate-100">
                  <tr>
                    <th className="pb-2 font-semibold">Variable</th>
                    <th className="pb-2 font-semibold">Value</th>
                    <th className="pb-2 font-semibold">Units</th>
                  </tr>
                </thead>
                <tbody className="text-slate-700 divide-y divide-slate-50">
                  <tr>
                    <td className="py-2">Initial Speed (v)</td>
                    <td className="py-2 font-bold">{results.speedMs.toFixed(2)}</td>
                    <td className="py-2">m/s</td>
                  </tr>
                  <tr>
                    <td className="py-2">Reaction Time (t)</td>
                    <td className="py-2 font-bold">{params.reactionTime.toFixed(2)}</td>
                    <td className="py-2">s</td>
                  </tr>
                  <tr>
                    <td className="py-2">Effective Deceleration (a)</td>
                    <td className="py-2 font-bold">{((params.friction + (params.gradient/100)) * 9.81).toFixed(2)}</td>
                    <td className="py-2">m/s²</td>
                  </tr>
                  <tr>
                    <td className="py-2">Braking Time</td>
                    <td className="py-2 font-bold">{results.timeToBrake.toFixed(2)}</td>
                    <td className="py-2">s</td>
                  </tr>
                  <tr>
                    <td className="py-2 text-indigo-900 font-semibold">Total Time to Stop</td>
                    <td className="py-2 font-bold text-blue-600">{results.timeTotal.toFixed(2)}</td>
                    <td className="py-2">s</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}

