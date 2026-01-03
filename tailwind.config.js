/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'ton': {
          blue: '#0088cc',
          light: '#5eb3e6',
          dark: '#006699',
        }
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      boxShadow: {
        'ton': '0 4px 14px 0 rgba(0, 136, 204, 0.1)',
        'ton-lg': '0 10px 25px -3px rgba(0, 136, 204, 0.1)',
      },
      backgroundImage: {
        'gradient-ton': 'linear-gradient(135deg, #0088cc 0%, #5eb3e6 100%)',
        'gradient-ton-dark': 'linear-gradient(135deg, #006699 0%, #0088cc 100%)',
      }
    },
  },
  plugins: [],
}