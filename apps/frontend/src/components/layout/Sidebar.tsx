'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: '▦' },
  { href: '/campaigns', label: 'Campaigns', icon: '📡' },
  { href: '/creatives', label: 'Creatives', icon: '🎨' },
  { href: '/ai-engine', label: 'AI Engine', icon: '🧠' },
  { href: '/queue', label: 'Queue', icon: '⚙️' },
  { href: '/logs', label: 'Logs', icon: '📋' },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="w-56 flex-shrink-0 flex flex-col h-full border-r"
      style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
    >
      {/* Logo */}
      <div className="p-5 border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-base font-black"
            style={{ background: 'linear-gradient(135deg, var(--accent), var(--cyan))' }}
          >
            ⚡
          </div>
          <div>
            <div className="font-black text-sm tracking-tight">AdMatrix</div>
            <div className="text-xs font-semibold" style={{ color: 'var(--accent)' }}>AI Platform</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all"
              style={{
                background: isActive ? 'var(--subtle)' : 'transparent',
                color: isActive ? 'var(--text)' : 'var(--muted)',
                borderLeft: isActive ? '2px solid var(--accent)' : '2px solid transparent',
              }}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-2.5">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
            style={{ background: 'linear-gradient(135deg, var(--accent), #a855f7)' }}
          >
            A
          </div>
          <div>
            <div className="text-xs font-semibold">Admin User</div>
            <div className="text-xs" style={{ color: 'var(--muted)' }}>ORG_ADMIN</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
