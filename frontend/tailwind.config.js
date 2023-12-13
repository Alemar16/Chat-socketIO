


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
          backgroundColor: "#0070f3", // Puedes ajustar el color base aquí
          color: "#ffffff",
          cursor: "pointer",
          transition: "background-color 0.3s ease", // Agregamos una transición suave al cambio de color
        },
      };

      addUtilities(newUtilities, ['responsive', 'hover']);
    },
  ],
};
