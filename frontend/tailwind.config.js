/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [
    function ({ addUtilities }) {
      const newUtilities = {
        ".btn": {
          padding: ".5rem 1rem",
          borderRadius: ".25rem",
          fontSize: "1rem",
          fontWeight: "600",
          backgroundColor: "#0070f3",
          color: "#ffffff",
          cursor: "pointer",
          transition: "background-color 0.3s ease",
        },
        ".scrollbar-none": {
          scrollbarWidth: "none",
          "&::-webkit-scrollbar": {
            width: "0.4em",
            display: "none",  // Para Chrome y Safari
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "transparent",
          },
        },
      };

      addUtilities(newUtilities, ['responsive', 'hover']);
    },
  ],
};
