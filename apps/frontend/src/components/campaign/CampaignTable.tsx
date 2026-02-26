'use client';

import { PlatformIcon } from '@/components/ui/PlatformIcon';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { ScoreRing } from '@/components/ui/ScoreRing';

interface CampaignTableProps {
  campaigns: any[];
  compact?: boolean;
}

export function CampaignTable({ campaigns, compact = false }: CampaignTableProps) {
  if (!campaigns.length) {
    return (
      <div className="text-center py-8 text-sm" style={{ color: 'var(--muted)' }}>
        No campaigns found
      </div>
    );
  }

  if (compact) {
    return (
      <div className="space-y-0">
        {campaigns.map(c => (
          <div
            key={c.id}
            className="flex items-center gap-3 py-3"
            style={{ borderBottom: '1px solid var(--border)' }}
          >
            <PlatformIcon platform={c.platform} />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold truncate">{c.name}</div>
              <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
                ${c.budgetTotal?.toLocaleString()} · {c.objective}
              </div>
            </div>
            {c.aiScore > 0 && <ScoreRing score={c.aiScore} />}
          </div>
        ))}
      </div>
    );
  }

  return (
    <table className="w-full border-collapse">
      <thead>
        <tr style={{ borderBottom: '1px solid var(--border)' }}>
          {['Campaign', 'Platform', 'Objective', 'Budget', 'Status', 'AI Score', 'Actions'].map(h => (
            <th
              key={h}
              className="text-left text-xs font-semibold uppercase tracking-widest px-4 py-3"
              style={{ color: 'var(--muted)' }}
            >
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {campaigns.map((c) => (
          <tr
            key={c.id}
            className="transition-colors cursor-pointer"
            style={{ borderBottom: '1px solid var(--border)' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--subtle)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            <td className="px-4 py-3.5 text-sm font-semibold">{c.name}</td>
            <td className="px-4 py-3.5">
              <PlatformIcon platform={c.platform} />
            </td>
            <td className="px-4 py-3.5 text-xs" style={{ color: 'var(--muted)' }}>{c.objective}</td>
            <td className="px-4 py-3.5 text-sm">${c.budgetTotal?.toLocaleString()}</td>
            <td className="px-4 py-3.5">
              <StatusBadge status={c.status} />
            </td>
            <td className="px-4 py-3.5">
              {c.aiScore > 0 ? <ScoreRing score={c.aiScore} /> : <span style={{ color: 'var(--muted)' }}>—</span>}
            </td>
            <td className="px-4 py-3.5">
              <div className="flex gap-2">
                <button
                  className="text-xs px-2.5 py-1 rounded-lg"
                  style={{ background: 'var(--subtle)', color: 'var(--text)' }}
                >
                  Edit
                </button>
                <button
                  className="text-xs px-2.5 py-1 rounded-lg"
                  style={{
                    background: 'rgba(46,213,115,0.1)',
                    border: '1px solid rgba(46,213,115,0.3)',
                    color: 'var(--green)',
                  }}
                >
                  Optimize
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
