/** @type {import('tailwindcss').Config} */
import forms from "@tailwindcss/forms";

const config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    forms({
      strategy: "class",
    }),
  ],
};

export default config;
