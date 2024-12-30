const { theme } = require('./src/utils/theme');

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: theme.colors,
      height: theme.layout
    }
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("tailwindcss-scrollbar")
  ]
};
