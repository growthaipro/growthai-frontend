'use client';

import { useQueue } from '@/hooks/useQueue';

const statusColor: Record<string, string> = {
  processing: 'var(--cyan)',
  waiting: 'var(--yellow)',
  completed: 'var(--green)',
  failed: 'var(--hot)',
};

export default function QueuePage() {
  const { jobs, stats } = useQueue();

  return (
    <div className="slide-in space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">BullMQ Worker Queue</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>
          Async job processing engine — live status
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Active Jobs', value: stats.active, color: 'var(--cyan)' },
          { label: 'Waiting', value: stats.waiting, color: 'var(--yellow)' },
          { label: 'Completed', value: stats.completed, color: 'var(--green)' },
          { label: 'Failed', value: stats.failed, color: 'var(--hot)' },
        ].map(s => (
          <div
            key={s.label}
            className="rounded-xl p-5 border"
            style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
          >
            <div className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--muted)' }}>
              {s.label}
            </div>
            <div className="text-3xl font-black" style={{ color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Jobs */}
      <div className="rounded-2xl border overflow-hidden" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
        {jobs.map((job, i) => (
          <div
            key={job.id}
            className="p-5"
            style={{ borderBottom: i < jobs.length - 1 ? '1px solid var(--border)' : 'none' }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div
                className="text-xs font-bold font-mono px-2 py-1 rounded"
                style={{ background: 'var(--subtle)', color: 'var(--accent)' }}
              >
                {job.type}
              </div>
              <span className="text-xs" style={{ color: 'var(--muted)' }}>Job #{job.id} · {job.platform}</span>
              <div className="ml-auto">
                <span
                  className="text-xs font-bold uppercase px-2 py-1 rounded-full"
                  style={{
                    color: statusColor[job.status] || 'var(--muted)',
                    background: `${statusColor[job.status] || '#888'}18`,
                    border: `1px solid ${statusColor[job.status] || '#888'}33`,
                  }}
                >
                  {job.status}
                </span>
              </div>
              <span className="text-sm font-bold w-10 text-right">{job.progress}%</span>
            </div>
            <div className="h-1 rounded-full overflow-hidden" style={{ background: 'var(--subtle)' }}>
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${job.progress}%`,
                  background: `linear-gradient(90deg, ${statusColor[job.status] || 'var(--accent)'}, ${statusColor[job.status] || 'var(--accent)'}aa)`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
