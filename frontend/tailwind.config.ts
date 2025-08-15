import type { Config } from 'tailwindcss'

const config: Config = {
    content: [
        './src/**/*.{js,ts,jsx,tsx,mdx}',
        './src/**/*.css',
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ["var(--font-montserrat)", "sans-serif"],
                hand: ["var(--font-patrick-hand)", "cursiv)"], 
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
                border: 'var(--border)',
                input: 'var(--input)',
                ring: 'var(--ring)',
                primary: 'var(--primary)',
                secondary: 'var(--secondary)',
                tertiary: 'var(--tertiary)',
                white: 'var(--white)',
                black: 'var(--black)',
                tags: 'var(--tags)',
                contrast: 'var(--contrast)',
            },
            borderRadius: {
                radius: 'var(--radius)',
                'radius-btn': 'var(--radius-btn)',
            },
        },
    },
    plugins: [],
}
export default config
