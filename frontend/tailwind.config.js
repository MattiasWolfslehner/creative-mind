/** @type {import('tailwindcss').Config} */
export default {
  content: ['./public/**/*.{html,js}'],
  theme: {
    extend: {
      fontFamily: {
        'spinnaker': ['Spinnaker', 'sans-serif'],
      },
      colors: {
        inputfieldPurple: '#8D63D0',
        inputfieldBorderPurple: '#9D75EF',
      }
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
