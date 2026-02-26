interface ScoreRingProps {
  score: number;
  size?: number;
}

export function ScoreRing({ score, size = 44 }: ScoreRingProps) {
  const r = 16;
  const circ = 2 * Math.PI * r;
  const color =
    score >= 80 ? 'var(--green)' :
    score >= 60 ? 'var(--yellow)' :
    'var(--hot)';

  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--subtle)" strokeWidth={3} />
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none" stroke={color} strokeWidth={3}
          strokeDasharray={circ}
          strokeDashoffset={circ * (1 - score / 100)}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1s ease' }}
        />
      </svg>
      <span
        className="absolute inset-0 flex items-center justify-center text-[10px] font-bold"
        style={{ color }}
      >
        {score}
      </span>
    </div>
  );
}
