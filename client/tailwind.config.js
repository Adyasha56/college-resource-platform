/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-dark': '#213448',
        'primary': '#547792',
        'secondary': '#94B4C1',
        'background': '#ECEFCA',
      },
    },
  },
};


