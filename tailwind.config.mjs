/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      backgroundImage: {
        'background-1' : "url(/assets/background_1.png)",
        'background-2' : "url(/assets/background_2.png)",
        'background-3' : "url(/assets/background_3.png)",
        'background-test' : "url(/assets/testing_bg.jpg)"
      },
      boxShadow: {
        'custom-light' : '0px 15px 20px rgba(255, 255, 255, 0.3)',
      },
      dropShadow: {
        'custom-light' : '0px 15px 20px rgb(255, 255, 255)',
      },
      fontFamily: {
        'rampart' : ["'Rampart One'", "serif"], // Add Inter font
        'poppins': ['Poppins', 'sans-serif'],
        'josefin' : ["Josefin Sans", "serif"]
      },
    },
  },
  plugins: [],
};
