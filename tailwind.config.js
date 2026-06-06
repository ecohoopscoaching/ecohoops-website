/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        eco: {
          black: '#060A10',
          dark: '#0B1120',
          surface: '#0F1628',
          surface2: '#141D30',
          border: 'rgba(255,255,255,0.08)',
          // Primary blue family
          blue: '#97B3D2',
          'blue-light': '#B0C8E0',
          'blue-pale': '#C8D9EB',
          navy: '#001c52',
          'navy-light': '#0A2E6E',
          'navy-bright': '#1A4A8A',
          // Secondary accent
          cream: '#F0E6D3',
          // Utility colors
          cyan: '#4DA8DA',
          red: '#FF2D2D',
          green: '#00D26A',
          muted: '#8CA3BC',
          'muted-light': '#DCE6F1',
          // Legacy aliases (keeping for compatibility)
          orange: '#97B3D2',
          'orange-light': '#B0C8E0',
          gold: '#F0E6D3',
        }
      },
      fontFamily: {
        display: ['Anton', 'sans-serif'],
        heading: ['Space Grotesk', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        graffiti: ['Permanent Marker', 'cursive'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        'hero': ['clamp(3.5rem, 10vw, 9rem)', { lineHeight: '0.9', letterSpacing: '0.04em' }],
        'section': ['clamp(2.5rem, 6vw, 5rem)', { lineHeight: '0.95', letterSpacing: '0.04em' }],
        'sub': ['clamp(1.5rem, 3vw, 2.5rem)', { lineHeight: '1.1', letterSpacing: '0.02em' }],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'glow-orange': 'radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(151,179,210,0.15), transparent 40%)',
        'glow-cyan': 'radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(0,229,255,0.1), transparent 40%)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
        'grain': 'grain 8s steps(10) infinite',
        'slide-up': 'slide-up 0.6s ease-out',
        'slide-down': 'slide-down 0.3s ease-out',
        'scale-in': 'scale-in 0.3s ease-out',
        'glow-line': 'glow-line 6s cubic-bezier(0.4, 0, 0.2, 1) infinite',
        'marquee': 'marquee 30s linear infinite',
        'marquee-reverse': 'marquee-reverse 35s linear infinite',
        'spin-slow': 'spin 20s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '1' },
        },
        grain: {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '10%': { transform: 'translate(-5%, -10%)' },
          '20%': { transform: 'translate(-15%, 5%)' },
          '30%': { transform: 'translate(7%, -25%)' },
          '40%': { transform: 'translate(-5%, 25%)' },
          '50%': { transform: 'translate(-15%, 10%)' },
          '60%': { transform: 'translate(15%, 0%)' },
          '70%': { transform: 'translate(0%, 15%)' },
          '80%': { transform: 'translate(3%, 35%)' },
          '90%': { transform: 'translate(-10%, 10%)' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'slide-down': {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'scale-in': {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'glow-line': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'marquee-reverse': {
          '0%': { transform: 'translateX(-50%)' },
          '100%': { transform: 'translateX(0%)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
      },
      boxShadow: {
        'glow-sm': '0 0 20px rgba(151,179,210,0.3)',
        'glow-md': '0 0 40px rgba(151,179,210,0.4)',
        'glow-lg': '0 0 80px rgba(151,179,210,0.3)',
        'glow-cyan': '0 0 40px rgba(0,229,255,0.3)',
        'brutal': '6px 6px 0px 0px rgba(151,179,210,1)',
        'brutal-sm': '4px 4px 0px 0px rgba(151,179,210,1)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
