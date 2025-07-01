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


// This configuration file sets up Tailwind CSS for a project, specifying the content files to scan for class names and extending the default theme with custom colors.
// The `content` array includes HTML and JavaScript files, while the `theme` object extends the default theme with custom colors for primary, secondary, and background elements. The `plugins` array is empty, indicating no additional plugins are used.