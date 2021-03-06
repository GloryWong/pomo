const colors = require('tailwindcss/colors')

module.exports = {
  mode: 'jit',
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      width: {
        '1/24': '4.166666%',
        '1/48': '2.083333%',
        '1/100': '1%',
        '1/200': '0.5%',
      },
      height: {
        '1/12': '8.333333%',
        '1/20': '5%',
        '1/24': '4.166666%',
        '1/48': '2.083333%',
      },
      borderWidth: {
        10: '10px',
        15: '15px',
      },
      cursor: {
        grab: 'grab',
      },
      colors: {
        primary: {
          light: '#EC4C30',
          DEFAULT: '#D6442A',
          dark: '#972118',
        },
        secondary: {
          lighter: colors.amber[50],
          light: colors.amber[100],
          DEFAULT: colors.amber[200],
          dark: colors.amber[300],
          darker: colors.amber[400],
        },
        neutral: {
          lighter: colors.gray[50],
          light: colors.gray[100],
          DEFAULT: colors.gray[200],
          dark: colors.gray[300],
          darker: colors.gray[400],
        },
      },
      boxShadow: {
        'tomato-line': `0 0 20px 10px rgba(255,255,255,0.1),
          0 0 8px 1px rgba(255,255,255,0.3),
          0 0 10px 1px rgba(0,0,0,0.15),
          inset 0 0 8px 5px rgba(255,255,255,0.1),
          inset 0 0 10px 0px rgba(0,0,0,0.15)`,
        'tomato-border':
          '0 0px 15px 0px rgba(0, 0, 0, 0.1), 0 0px 6px 0px rgba(0, 0, 0, 0.05)',
      },
      backgroundImage: {
        'tomato-radial-gradient': `
        radial-gradient(circle, transparent 20%, rgba(0,0,0,0.1) 70%, transparent 80%, transparent)`,
        'tomato-pointer-plate-radial-gradient': `
        radial-gradient(circle, rgba(0,0,0,0.05) 10%, transparent 30%, rgba(0,0,0,0.05) 90%)`,
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
