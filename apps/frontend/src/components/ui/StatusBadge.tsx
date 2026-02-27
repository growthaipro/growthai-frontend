interface StatusBadgeProps {
  status: string;
}

const STATUS_MAP: Record<string, { color: string; bg: string }> = {
  ACTIVE: { color: 'var(--green)', bg: '#0d2e1f' },
  active: { color: 'var(--green)', bg: '#0d2e1f' },
  PAUSED: { color: 'var(--yellow)', bg: '#2e2000' },
  paused: { color: 'var(--yellow)', bg: '#2e2000' },
  DRAFT: { color: 'var(--muted)', bg: 'var(--subtle)' },
  draft: { color: 'var(--muted)', bg: 'var(--subtle)' },
  processing: { color: 'var(--cyan)', bg: '#0d2929' },
  waiting: { color: 'var(--yellow)', bg: '#2e2000' },
  completed: { color: 'var(--green)', bg: '#0d2e1f' },
  failed: { color: 'var(--hot)', bg: '#2e0d10' },
  success: { color: 'var(--green)', bg: '#0d2e1f' },
  warning: { color: 'var(--yellow)', bg: '#2e2000' },
  error: { color: 'var(--hot)', bg: '#2e0d10' },
  info: { color: 'var(--accent)', bg: '#1a1a3e' },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const s = STATUS_MAP[status] || { color: 'var(--muted)', bg: 'var(--subtle)' };

  return (
    <span
      className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full"
      style={{
        color: s.color,
        background: s.bg,
        border: `1px solid ${s.color}33`,
      }}
    >
      {status}
    </span>
  );
}
