import daisyui from 'daisyui'
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [daisyui],
  daisyui:{
    themes:["light","dark", "retro","cupcake","emerald","aqua","luxury","lemonade"]
  }
};
