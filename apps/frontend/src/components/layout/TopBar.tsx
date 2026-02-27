'use client';

import { usePathname } from 'next/navigation';

const PAGE_TITLES: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/campaigns': 'Campaigns',
  '/creatives': 'Creatives',
  '/ai-engine': 'AI Engine',
  '/queue': 'Worker Queue',
  '/logs': 'Optimization Logs',
};

export function TopBar() {
  const pathname = usePathname();
  const title = PAGE_TITLES[pathname] || 'AdMatrix AI';

  return (
    <header
      className="h-14 flex items-center justify-between px-6 border-b flex-shrink-0"
      style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
    >
      <div className="text-sm font-semibold" style={{ color: 'var(--muted)' }}>
        {title}
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: 'var(--green)' }}>
          <span
            className="w-2 h-2 rounded-full pulse-dot"
            style={{ background: 'var(--green)' }}
          />
          LIVE
        </div>
        <div className="text-xs px-2 py-1 rounded" style={{ background: 'var(--subtle)', color: 'var(--muted)' }}>
          API: localhost:3001
        </div>
        <div className="text-xs px-2 py-1 rounded" style={{ background: 'var(--subtle)', color: 'var(--muted)' }}>
          Redis: connected
        </div>
      </div>
    </header>
  );
}
