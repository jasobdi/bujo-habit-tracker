/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
          sans: "var(--font-montserrat)",
          hand: "var(--font-patrick-hand)",
      },
      fontSize: {
          xs: "14px",
          sm: "16px",
          md: "18px",
          lg: "20px",
          xl: "24px",
      },
      colors: {
          background: 'var(--background)',
          foreground: 'var(--foreground)',
          text: 'var(--text)',
          error: 'var(--error)',
          border: 'var(--border)',
          input: 'var(--input)',
          ring: 'var(--ring)',
          primary: 'var(--primary)',
          secondary: 'var(--secondary)',
          tertiary: 'var(--tertiary)',
          completed: 'var(--completed)',
          white: 'var(--white)',
          black: 'var(--black)',
          tags: 'var(--tags)',
          contrast: 'var(--contrast)',
          popover: 'var(--popover)',
          'popover-foreground': 'var(--popover-foreground)',
      },
      borderRadius: {
          radius: 'var(--radius)',
          'radius-btn': 'var(--radius-btn)',
      },
  },
},
  plugins: [],
}

