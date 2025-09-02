/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./components/**/*.{html,js}",
    "./js/**/*.js"
  ],
  theme: {
    extend: {
      colors: {
        'taupe-gray': '#8B7D6B',
        'pampas': '#E5E1DC',
        'mine-shaft': '#2A2A2A',
        'silver-chalice': '#A5A5A5',
        'emperor': '#545454',
        'gray': '#808080',
        'silver': '#C0C0C0',
      },
      fontFamily: {
        'serif': ['Hiragino Mincho ProN', 'Yu Mincho', 'YuMincho', 'HG Mincho E', 'MS Mincho', 'serif'],
        'serif-en': ['Times New Roman', 'Times', 'serif'],
      },
      spacing: {
        '0.375': '0.375rem',
        '1.4': '1.4rem',
        '1.42': '1.42rem',
        '1.14': '1.14rem',
        '0.85': '0.85rem',
        '4.6': '4.6rem',
        '5.5': '5.5rem',
        '15.5': '15.5rem',
        '17.5': '17.5rem',
        '22.2': '22.2rem',
        '37': '9.25rem',
        '41': '10.25rem',
        '46': '11.5rem',
      },
      fontSize: {
        '0.928': '0.928rem',
        '1.4': '1.4rem',
        '1.75': '1.75rem',
        '2.625': '2.625rem',
        '6.5': '6.5rem',
      },
      width: {
        '28': '7rem',
        '32': '8rem',
        '37': '9.25rem',
        '41': '10.25rem',
        '46': '11.5rem',
        '12.5': '12.5rem',
        '14': '14rem',
        '21': '21rem',
        '22': '22rem',
        '26': '26rem',
        '27': '27rem',
        '30': '30rem',
        '34': '34rem',
        '75': '75rem',
        '85': '85rem',
        'dvh': '100dvh',
        'lvh': '100lvh',
      },
      height: {
        'dvh': '100dvh',
        'lvh': '100lvh',
        '17.5': '17.5rem',
        '100px': '100px',
        '172px': '172px',
      },
      maxWidth: {
        '19.6': '19.6rem',
        '85': '85rem',
        '85%': '85%',
        '50%': '50%',
      },
      maxHeight: {
        '22.2': '22.2rem',
        '30': '30rem',
      },
      borderRadius: {
        '30': '30px',
      },
      margin: {
        '10': '10rem',
        '34': '34rem',
        '2.8': '2.8rem',
        '3.75': '3.75rem',
        '6': '6rem',
        '7.3': '7.3rem',
        '13': '13rem',
        '15': '15rem',
      },
      padding: {
        '22': '22rem',
        '4.6': '4.6rem',
        '9': '9rem',
        '6px': '6px',
        '5px': '5px',
        '4px': '4px',
        '3px': '3px',
        '12px': '12px',
      },
      backgroundImage: {
        'mine-shaft-texture': 'radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.05) 1px, transparent 0)',
        'gray-texture': 'radial-gradient(circle at 1px 1px, rgba(0, 0, 0, 0.05) 1px, transparent 0)',
      },
      backgroundSize: {
        'texture': '20px 20px',
      },
      animation: {
        'text-focus-in': 'textFocusIn 1s ease-in-out forwards',
        'scroll-nav': 'scrollNav 5s infinite',
        'logo-fade-in': 'logoFadeIn 0.8s ease-out forwards',
        'logo-trace': 'logoTrace 2s ease-in-out forwards',
        'progress-pulse': 'progressPulse 2s ease-in-out infinite',
        'loading-shimmer': 'loadingShimmer 1.5s infinite',
      },
      transitionDuration: {
        '600': '600ms',
      },
      writingMode: {
        'vertical-rl': 'vertical-rl',
        'horizontal-tb': 'horizontal-tb',
      },
    },
  },
  plugins: [
    function({ addUtilities }) {
      const newUtilities = {
        '.vertical-rl': {
          'writing-mode': 'vertical-rl',
          'text-orientation': 'mixed',
        },
        '.horizontal-tb': {
          'writing-mode': 'horizontal-tb',
        },
        '.contents-full': {
          position: 'relative',
          width: '100vw',
          'margin-left': 'calc(-50vw + 50%)',
        },
        '.contents-right': {
          display: 'contents',
        },
        '.bg-mine-shaft-texture': {
          'background-color': '#2A2A2A',
          'background-image': 'radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.05) 1px, transparent 0)',
          'background-size': '20px 20px',
        },
        '.bg-gray-texture': {
          'background-color': '#F5F5F5',
          'background-image': 'radial-gradient(circle at 1px 1px, rgba(0, 0, 0, 0.05) 1px, transparent 0)',
          'background-size': '20px 20px',
        },
      }
      addUtilities(newUtilities)
    }
  ],
}
