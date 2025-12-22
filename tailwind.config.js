/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: ['class', '[data-theme="dark-navy"]', '[data-theme="pure-black"]'],
  theme: {
    extend: {
      colors: {
        background: 'var(--bg-primary)',
        surface: 'var(--bg-surface)',
        elevated: 'var(--bg-elevated)',
        
        primary: {
          DEFAULT: 'var(--primary)',
          foreground: 'var(--primary-foreground)',
        },
        
        accent: {
          DEFAULT: 'var(--accent)',
          foreground: 'var(--accent-foreground)',
        },
        
        text: {
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          muted: 'var(--text-muted)',
          inverse: 'var(--text-inverse)',
        },
        
        border: {
          DEFAULT: 'var(--border-light)',
          medium: 'var(--border-medium)',
          strong: 'var(--border-strong)',
        },
        
        trading: {
          profit: 'var(--profit)',
          loss: 'var(--loss)',
          neutral: 'var(--neutral)',
          open: 'var(--open)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      transitionDuration: {
        '300': '300ms',
      }
    },
  },
  plugins: [],
}
