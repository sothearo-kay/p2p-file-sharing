/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.tsx"],
  theme: {
    extend: {
      container: {
        center: true,
        padding: "1rem",
        screens: {
          DEFAULT: "56rem",
        },
      },
    },
  },
  plugins: [],
};
