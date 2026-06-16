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
  canStop: boolean; // indicates if the vehicle can actually stop
  warning?: string; // warning message if stopping is problematic
}

const g = 9.80665; // m/s^2

export function calculateStoppingDistance(params: StoppingParams): StoppingResults {
  const { speedKmh, reactionTime, friction, gradient } = params;
  
  const speedMs = speedKmh / 3.6;
  const gradientDecimal = gradient / 100;
  
  // Effective friction: friction + gradient (uphill helps braking, downhill hurts)
  const effectiveFriction = friction + gradientDecimal;
  
  // Check if vehicle can stop (effective friction must be positive)
  const canStop = effectiveFriction > 0.01;
  let warning: string | undefined;
  
  if (!canStop) {
    warning = '⚠️ รถไม่สามารถหยุดได้! ความลาดชันลงเขาสูงเกินไป combined with แรงเสียดทานต่ำ';
  } else if (effectiveFriction < 0.1) {
    warning = '⚠️ ระวัง! ระยะเบรกจะยาวมากเนื่องจากแรงเสียดทานต่ำและความลาดชัน';
  }
  
  // Use clamped effective friction for calculations to avoid division by zero
  const safeEffectiveFriction = Math.max(0.01, effectiveFriction);

  const reactionDistance = speedMs * reactionTime;
  const brakingDistance = Math.pow(speedMs, 2) / (2 * g * safeEffectiveFriction);
  const totalDistance = reactionDistance + brakingDistance;
  
  const timeToBrake = speedMs / (g * safeEffectiveFriction);
  const timeTotal = reactionTime + timeToBrake;

  return {
    speedMs,
    reactionDistance,
    brakingDistance,
    totalDistance,
    timeToBrake,
    timeTotal,
    canStop,
    warning,
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
  },
  {
    id: 'icy',
    name: 'ถนนลื่นจัด (น้ำแข็ง)',
    desc: 'สภาวะอันตราย (t=1.5s, μ=0.15)',
    params: { reactionTime: 1.5, friction: 0.15, gradient: 0 }
  },
  {
    id: 'hill',
    name: 'ลงเขาชัน + ถนนเปียก',
    desc: 'สภาวะเสี่ยงสูง (t=1.5s, μ=0.4, -10%)',
    params: { reactionTime: 1.5, friction: 0.4, gradient: -10 }
  }
];
