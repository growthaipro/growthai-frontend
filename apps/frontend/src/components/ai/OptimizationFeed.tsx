import { StatusBadge } from '@/components/ui/StatusBadge';

interface LogEntry {
  id: number;
  time: string;
  action: string;
  target: string;
  reason: string;
  type: string;
}

export function OptimizationFeed({ logs }: { logs: LogEntry[] }) {
  return (
    <div className="space-y-0">
      {logs.map((log, i) => (
        <div
          key={log.id}
          className="flex gap-3 py-3"
          style={{ borderBottom: i < logs.length - 1 ? '1px solid var(--border)' : 'none' }}
        >
          <StatusBadge status={log.type} />
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold">
              {log.action} —{' '}
              <span style={{ color: 'var(--accent)' }}>{log.target}</span>
            </div>
            <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>{log.reason}</div>
          </div>
          <span className="text-xs whitespace-nowrap mt-0.5" style={{ color: 'var(--muted)' }}>
            {log.time}
          </span>
        </div>
      ))}
    </div>
  );
}
