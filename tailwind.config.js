/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        forest: '#182a25',
        sage: '#8cac82',
        canvas: '#f6f7f3',
      },
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        display: ['Georgia', 'serif'],
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
