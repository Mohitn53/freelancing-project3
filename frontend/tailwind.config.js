/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Quicksand', 'Inter', 'sans-serif'],
        heading: ['Outfit', 'Inter', 'sans-serif'],
      },
      colors: {
        primary: '#1A2215',       // Dark leafy green
        secondary: '#ffffff',
        accent: '#629432',        // Main Ekomart Green
        'accent-dark': '#4D7427',
        'accent-light': '#F7F9F5', // Soft green background
        ripe: '#FFA000',          // Warm orange for categories/badges
        berry: '#D9392B',         // Classic grocery red/sale
        cream: '#FFFDF0',         // Subtle cream background
        stone: '#6B7280',         // Generic grey for meta text
      },
      borderRadius: {
        'large': '20px',
        'xl': '24px',
        'full': '9999px',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      },
      animation: {
        marquee: 'marquee 25s linear infinite',
        'float': 'float 4s ease-in-out infinite',
        'fade-in-up': 'fade-in-up 0.6s ease-out forwards',
      },
    },
  },
  plugins: [],
}

