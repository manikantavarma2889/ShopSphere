/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}', './index.html'],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: {
        sm: '1rem',
        md: '2rem'
      }
    },
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        muted: 'var(--muted)',
        border: 'var(--border)',
        primary: 'var(--primary)',
        'primary-foreground': 'var(--primary-foreground)',
        success: 'var(--success)',
        warning: 'var(--warning)',
        destructive: 'var(--destructive)'
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Inter', 'sans-serif']
      },
      spacing: {
        '0': '0px', '1': '0.25rem', '2': '0.5rem', '3': '0.75rem',
        '4': '1rem', '5': '1.5rem', '6': '2rem', '8': '3rem', '10': '4rem'
      },
      borderRadius: {
        sm: '0.125rem', md: '0.375rem', lg: '0.5rem', full: '9999px'
      },
      shadow: {
        sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
        lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
        xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)'
      },
      transitionDuration: {
        DEFAULT: '150ms', fast: '100ms', slow: '300ms'
      },
      transitionTimingFunction: {
        DEFAULT: 'cubic-bezier(0.4, 0, 0.2, 1)'
      },
      screens: {
        xs: '320px', sm: '375px', md: '390px', lg: '430px', xl: '768px',
        '2xl': '1024px', '3xl': '1280px', '4xl': '1440px', '5xl': '1920px'
      }
    }
  },
  plugins: []
};