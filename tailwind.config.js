/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          black: '#000000',
          gray: '#333333',
          'gray-light': '#666666',
          white: '#FFFFFF',
          purple: '#A79BED',
        },
        // Dark theme optimized grays
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        }
      },
      fontFamily: {
        sans: ["IBM Plex Sans", "sans-serif"], // Keep your current
        oxanium: ["Oxanium", "sans-serif"],   // Headers, logo
        orbitron: ["Orbitron", "sans-serif"], // Body text
      },
      fontSize: {
        // Custom typography scale for Kyperus
        'xs': '0.75rem',     // 12px - Labels, captions
        'sm': '0.875rem',    // 14px - Small text
        'base': '1rem',      // 16px - Body text
        'lg': '1.125rem',    // 18px - Large body
        'xl': '1.25rem',     // 20px - Subheadings
        '2xl': '1.5rem',     // 24px - Card titles
        '3xl': '1.875rem',   // 30px - Component titles
        '4xl': '2.25rem',    // 36px - Page titles
        '5xl': '3rem',       // 48px - Section titles
        '6xl': '3.75rem',    // 60px - Hero titles
        '7xl': '4.5rem',     // 72px - Large hero
        '8xl': '6rem',       // 96px - Massive hero
        '9xl': '8rem',       // 128px - Ultra large
      },
      fontWeight: {
        thin: '100',
        extralight: '200',
        light: '300',
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
        extrabold: '800',
        black: '900',
      },
      spacing: {
        // Custom spacing for Kyperus design
        '18': '4.5rem',   // 72px
        '22': '5.5rem',   // 88px
        '26': '6.5rem',   // 104px
        '30': '7.5rem',   // 120px
        '34': '8.5rem',   // 136px
        '38': '9.5rem',   // 152px
        '42': '10.5rem',  // 168px
        '46': '11.5rem',  // 184px
        '50': '12.5rem',  // 200px
      },
      screens: {
        'xs': '475px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
        '3xl': '1920px',  // Premium desktop
      },
      borderRadius: {
        'none': '0px',
        'sm': '2px',
        DEFAULT: '4px',     // Kyperus default
        'md': '6px',
        'lg': '8px',
        'xl': '12px',
        '2xl': '16px',
        '3xl': '24px',
        'full': '9999px',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'fade-in-up': 'fadeInUp 0.6s ease-out',
        'slide-in-left': 'slideInLeft 0.5s ease-out',
        'slide-in-right': 'slideInRight 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'brand': '0 4px 14px 0 rgba(0, 0, 0, 0.39)',
        'brand-lg': '0 10px 40px 0 rgba(0, 0, 0, 0.6)',
        'glow': '0 0 20px rgba(167, 155, 237, 0.3)',
        'glow-lg': '0 0 40px rgba(167, 155, 237, 0.4)',
      },
    },
  },
  plugins: [
    // Add custom utilities
    function({ addUtilities }) {
      const newUtilities = {
        // Clipped corners
        '.clip-corner': {
          'clip-path': 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)',
        },
        '.clip-corner-sm': {
          'clip-path': 'polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px)',
        },
        '.clip-corner-lg': {
          'clip-path': 'polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)',
        },
        '.clip-corner-xl': {
          'clip-path': 'polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)',
        },
        
        // Typography utilities
        '.text-hero': {
          'font-family': 'Oxanium, sans-serif',
          'font-size': '4.5rem',
          'font-weight': '700',
          'line-height': '1.1',
          'letter-spacing': '-0.02em',
        },
        '.text-section': {
          'font-family': 'Oxanium, sans-serif', 
          'font-size': '3rem',
          'font-weight': '600',
          'line-height': '1.2',
        },
        '.text-card-title': {
          'font-family': 'Oxanium, sans-serif',
          'font-size': '1.5rem',
          'font-weight': '600',
          'line-height': '1.3',
        },
        '.text-body': {
          'font-family': 'IBM Plex Sans, sans-serif',
          'font-size': '1rem',
          'font-weight': '400',
          'line-height': '1.6',
        },
        '.text-body-lg': {
          'font-family': 'IBM Plex Sans, sans-serif',
          'font-size': '1.125rem',
          'font-weight': '400',
          'line-height': '1.6',
        },
        '.text-label': {
          'font-family': 'IBM Plex Sans, sans-serif',
          'font-size': '0.875rem',
          'font-weight': '500',
          'line-height': '1.4',
          'letter-spacing': '0.05em',
          'text-transform': 'uppercase',
        },

        // Button utilities  
        '.btn-base': {
          'display': 'inline-flex',
          'align-items': 'center',
          'justify-content': 'center',
          'border-radius': '4px',
          'font-family': 'Orbitron, sans-serif',
          'font-weight': '500',
          'transition': 'all 0.2s ease-in-out',
          'cursor': 'pointer',
          'user-select': 'none',
        },
        '.btn-primary': {
          'background-color': '#333333',
          'color': '#FFFFFF',
          'border': '1px solid #666666',
          'padding': '0.75rem 1.5rem',
        },
        '.btn-secondary': {
          'background-color': 'transparent',
          'color': '#FFFFFF', 
          'border': '1px solid #333333',
          'padding': '0.75rem 1.5rem',
        },

        // Layout utilities
        '.container-brand': {
          'max-width': '1440px',
          'margin': '0 auto',
          'padding': '0 1.5rem',
        },
        '.section-padding': {
          'padding': '5rem 0',
        },
        '.section-padding-lg': {
          'padding': '8rem 0',
        },

        // Dark theme utilities
        '.bg-dark': {
          'background-color': '#000000',
        },
        '.bg-dark-secondary': {
          'background-color': '#111111',
        },
        '.text-light': {
          'color': '#FFFFFF',
        },
        '.text-light-secondary': {
          'color': '#d1d5db',
        },
      }
      
      addUtilities(newUtilities, ['responsive', 'hover'])
    }
  ],
}