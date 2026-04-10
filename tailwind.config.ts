import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          bg:      '#0a0a0a',
          surface: '#141414',
          border:  '#2a2a2a',
          blue:    '#3483fa',
          green:   '#16a400',
          red:     '#ef4444',
          muted:   '#6b7280',
        },
      },
      fontFamily: {
        sans: ['Roboto', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in':  'fadeIn 0.4s ease-in-out',
        'slide-up': 'slideUp 0.35s ease-out',
      },
      keyframes: {
        fadeIn:  { from: { opacity: '0' },                              to: { opacity: '1' } },
        slideUp: { from: { transform: 'translateY(16px)', opacity: '0' }, to: { transform: 'translateY(0)', opacity: '1' } },
      },
    },
  },
  plugins: [],
};

export default config;
