const PLATFORMS: Record<string, { icon: string; color: string }> = {
  META: { icon: '𝕄', color: '#1877f2' },
  GOOGLE: { icon: 'G', color: '#ea4335' },
  TIKTOK: { icon: '♪', color: '#ff0050' },
  ALL: { icon: '◎', color: 'var(--accent)' },
};

interface PlatformIconProps {
  platform: string;
}

export function PlatformIcon({ platform }: PlatformIconProps) {
  const p = PLATFORMS[platform] || { icon: '?', color: 'var(--accent)' };
  return (
    <span
      className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-sm font-black flex-shrink-0"
      style={{
        background: `${p.color}22`,
        color: p.color,
        border: `1px solid ${p.color}33`,
      }}
    >
      {p.icon}
    </span>
  );
}
