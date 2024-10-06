/** @type {import('tailwindcss').Config} */
import daisyui from "daisyui";

export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',  // Scan all JavaScript, TypeScript, and JSX files
  ],
  darkMode: 'class', // Dark mode is enabled via class
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#09B928', 
          DEFAULT: '#09B928', 
          dark: '#FFA032', 
        },
        textColor: {
          light: '#FFFFFF', 
          DEFAULT: '#FFFFFF',
          dark: '#95AD99', 
        },
        pageBg: {
          light: '#E6E1DB',
          DEFAULT: '#E6E1DB',
          dark: '#000000', 
          // #374151
          // #000000
        },
      },
    },
  },
  plugins: [daisyui],
};
