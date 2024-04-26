/** @type {import('tailwindcss').Config} */
export default {
  mode: 'jit',
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors:{
        'primary': '#2E4052',
        'secondary': '#FFC857',
        'tertiary': '#BDD9BF',
        'quaternary': '#412234'
      },
      fontFamily: {
        'sans': ['Roboto', 'sans-serif']
      },
      fontSize: {
        'xl': '1.5rem',
        '2xl': '2rem',
      },
    },
  },
  plugins: [],
}

