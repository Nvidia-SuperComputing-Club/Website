/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        nvidia: {
          DEFAULT: '#76B900',
          light: '#8CD419',
          dark: '#5A8F00',
        },
        bg: {
          primary: '#0A0A0A',
          secondary: '#111111',
          tertiary: '#1A1A1A',
          glass: 'rgba(255,255,255,0.05)',
        },
        text: {
          primary: '#FFFFFF',
          secondary: '#A0A0A0',
          tertiary: '#666666',
          accent: '#76B900',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Satoshi', 'system-ui', 'sans-serif'],
        display: ['Inter', 'Satoshi', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"Fira Code"', 'monospace'],
      },
      fontSize: {
        hero: ['72px', { lineHeight: '80px', fontWeight: '800' }],
        h1: ['48px', { lineHeight: '56px', fontWeight: '700' }],
        h2: ['36px', { lineHeight: '44px', fontWeight: '700' }],
        h3: ['24px', { lineHeight: '32px', fontWeight: '600' }],
        body: ['16px', { lineHeight: '24px', fontWeight: '400' }],
        caption: ['14px', { lineHeight: '20px', fontWeight: '400' }],
        label: ['12px', { lineHeight: '16px', fontWeight: '600' }],
      },
      boxShadow: {
        'nvidia-glow': '0 0 30px rgba(118, 185, 0, 0.3)',
        'nvidia-glow-lg': '0 0 60px rgba(118, 185, 0, 0.4)',
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #0A0A0A 0%, #1A1A2E 50%, #0A0A0A 100%)',
        'cta-gradient': 'linear-gradient(135deg, #76B900 0%, #5A8F00 100%)',
      },
      borderRadius: {
        btn: '8px',
        card: '12px',
      },
    },
  },
  plugins: [],
}
