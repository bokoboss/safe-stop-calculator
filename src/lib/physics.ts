export interface StoppingParams {
  speedKmh: number;
  reactionTime: number;
  friction: number;
  gradient: number; // in percentage, positive means uphill, negative means downhill
}

export interface StoppingResults {
  speedMs: number;
  reactionDistance: number;
  brakingDistance: number;
  totalDistance: number;
  timeToBrake: number;
  timeTotal: number;
}

const g = 9.80665; // m/s^2

export function calculateStoppingDistance(params: StoppingParams): StoppingResults {
  const { speedKmh, reactionTime, friction, gradient } = params;
  
  const speedMs = speedKmh / 3.6;
  const gradientDecimal = gradient / 100;
  
  // Effective friction cannot be less than or equal to 0 realistically for braking (would never stop)
  const effectiveFriction = Math.max(0.01, friction + gradientDecimal);

  const reactionDistance = speedMs * reactionTime;
  const brakingDistance = Math.pow(speedMs, 2) / (2 * g * effectiveFriction);
  const totalDistance = reactionDistance + brakingDistance;
  
  const timeToBrake = speedMs / (g * effectiveFriction);
  const timeTotal = reactionTime + timeToBrake;

  return {
    speedMs,
    reactionDistance,
    brakingDistance,
    totalDistance,
    timeToBrake,
    timeTotal,
  };
}

export function generateChartData(params: StoppingParams) {
  const data = [];
  // Generate data from 10 km/h to 160 km/h
  for (let s = 10; s <= 160; s += 10) {
    const res = calculateStoppingDistance({ ...params, speedKmh: s });
    data.push({
      speed: s,
      reactionDist: Number(res.reactionDistance.toFixed(1)),
      brakingDist: Number(res.brakingDistance.toFixed(1)),
      totalDist: Number(res.totalDistance.toFixed(1)),
    });
  }
  return data;
}

export const PRESETS = [
  {
    id: 'aashto',
    name: 'มาตรฐานถนน (AASHTO)',
    desc: 'อ้างอิงออกแบบถนน (t=2.5s, μ=0.34)',
    params: { reactionTime: 2.5, friction: 0.34, gradient: 0 }
  },
  {
    id: 'dry',
    name: 'สภาวะปกติ (ถนนแห้ง)',
    desc: 'รถทั่วไปบนถนนแห้ง (t=1.5s, μ=0.7)',
    params: { reactionTime: 1.5, friction: 0.7, gradient: 0 }
  },
  {
    id: 'wet',
    name: 'สภาวะฝนตก (ถนนเปียก)',
    desc: 'รถทั่วไปบนถนนเปียก (t=1.5s, μ=0.4)',
    params: { reactionTime: 1.5, friction: 0.4, gradient: 0 }
  },
  {
    id: 'alert',
    name: 'ผู้ขับตื่นตัวสูง',
    desc: 'ตอบสนองไวบนถนนแห้ง (t=0.7s, μ=0.8)',
    params: { reactionTime: 0.7, friction: 0.8, gradient: 0 }
  }
];
