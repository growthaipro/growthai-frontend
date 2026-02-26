'use client';

import { useEffect, useState } from 'react';

interface MetricCardProps {
  label: string;
  value: number;
  format?: 'compact' | 'currency' | 'percent' | 'multiplier';
  delta?: number;
  color?: string;
}

function formatValue(value: number, format: string): string {
  switch (format) {
    case 'currency':
      return value >= 1000 ? `$${(value / 1000).toFixed(1)}K` : `$${value.toFixed(0)}`;
    case 'percent':
      return `${value}%`;
    case 'multiplier':
      return `${value}x`;
    case 'compact':
    default:
      if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
      if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
      return value.toString();
  }
}

export function MetricCard({
  label,
  value,
  format = 'compact',
  delta,
  color = 'var(--accent)',
}: MetricCardProps) {

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div
      className="rounded-xl p-5 border relative overflow-hidden"
      style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
    >
      <div
        className="absolute top-0 right-0 w-16 h-16 rounded-full"
        style={{
          background: `radial-gradient(circle at top right, ${color}18, transparent 70%)`,
        }}
      />

      <div
        className="text-xs font-semibold uppercase tracking-widest mb-2"
        style={{ color: 'var(--muted)' }}
      >
        {label}
      </div>

      <div className="text-2xl font-bold tracking-tight">
        {formatValue(value, format)}
      </div>

      {delta !== undefined && (
        <div
          className="text-xs font-semibold mt-1"
          style={{ color: delta >= 0 ? 'var(--green)' : 'var(--hot)' }}
        >
          {delta >= 0 ? '▲' : '▼'} {Math.abs(delta)}%
        </div>
      )}
    </div>
  );
}