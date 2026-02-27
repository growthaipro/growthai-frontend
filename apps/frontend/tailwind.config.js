/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0a0a0f',
        surface: '#111118',
        card: '#16161f',
        border: '#1e1e2e',
        accent: '#6c63ff',
        hot: '#ff4757',
        green: '#2ed573',
        yellow: '#ffa502',
        cyan: '#1de9b6',
        muted: '#5a5a72',
        subtle: '#2a2a3e',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
    },
  },
  plugins: [],
};
