import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        surface: 'var(--surface)',
        ink: 'var(--ink)',
        muted: 'var(--muted)',
        line: 'var(--line)',
        brand: 'var(--brand)',
        'brand-hover': 'var(--brand-hover)',
        'band-1': 'var(--band-1)',
        'band-2': 'var(--band-2)',
        'band-3': 'var(--band-3)',
        'band-4': 'var(--band-4)',
        'warn-bg': 'var(--warn-bg)',
        'warn-ink': 'var(--warn-ink)',
      },
      fontFamily: {
        sans: ['var(--font-figtree)', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        container: '1200px',
        prose68: '68ch',
        content: '760px',
        calc: '860px',
      },
      boxShadow: {
        card: '0 1px 2px rgba(0,0,0,.04)',
      },
      borderRadius: {
        photo: '4px',
        card: '12px',
        pill: '999px',
      },
    },
  },
  plugins: [],
};

export default config;
