import type { Config } from 'tailwindcss'

const config: Config = {
    content: [
        './src/**/*.{js,ts,jsx,tsx,mdx}',
        './src/**/*.css', // damit globals.css erkannt wird
    ],
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
                primary: "var(--primary)",
                secondary: "var(--secondary)",
                foreground: "var(--foreground)",
                background: "var(--background)",
                border: "var(--border)",
                inactive: "var(--button-inactive)",
            },
        },
    },
    plugins: [],
}

export default config
