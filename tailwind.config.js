module.exports = {
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      width: {
        '1/24': '4.166666%',
        '1/48': '2.083333%',
        '1/100': '1%',
      },
      height: {
        '1/12': '8.333333%',
        '1/20': '5%',
        '1/24': '4.166666%',
        '1/48': '2.083333%',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
