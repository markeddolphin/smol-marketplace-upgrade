const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  mode: 'jit',
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  darkMode: true, // or 'media' or 'class'
  theme: {
    container: {
      center: true,
    },
    extend: {
      backgroundImage: {
        'game-page': "url('/static/images/backgroundGif.gif')",
        'landing-page': "url('/static/images/updatedLandingBG.gif')",
        'landing-page-mobile': "url('/static/images/mobileGifNoMammoth.gif')",
        rockboard: "url('/static/images/rockboard.webp')",
      },
      colors: {
        smolBrown: '#41251f',
        smolBrownAlternative: '#9b7240',
        smolBrownLight: '#90864c',
        smolGreenLight: '#00BF63',
        smolRed: '#8A0403'
      },
      fontFamily: {
        mono: ['Press Start\\ 2P', ...defaultTheme.fontFamily.sans],
      },
      fontSize: {
        xxs: ['10px', '12px'],
      },
      textShadow: {
        xl: '3px 3px 0px rgba(10, 10, 10, 1)',
        '2xl': '3px 3px 0px rgba(65, 65, 65, 1)',
        '3xl': '5px 5px 0px rgba(65, 65, 65, 1)',
      },
      boxShadow: {
        button:
          '-4px 0 0 0 #444, 4px 0 0 0 #444, 0 -4px 0 0 #444, 0 4px 0 0 #444, inset -3px 0 0 0 #999, inset 0 -3px 0 0 #999',
        'button-hover':
          '-4px 0 0 0 #444, 4px 0 0 0 #444, 0 -4px 0 0 #444, 0 4px 0 0 #444, inset -5px 0 0 0 #999, inset 0 -5px 0 0 #999',
      },
      screens: {
        xxs: '430px',
        xs: '540px',
      },
      animation: {
        beat: "beat 0.75s infinite",
      },
      keyframes: {
        beat: {
          "0%": { transform: "scale(0.9)" },
          "80%": { transform: "scale(1.1)" },
          "100%": { transform: "scale(1)" },
        },
      }
    },
  },
  plugins: [require('tailwindcss-textshadow'), require('@tailwindcss/forms')],
};
