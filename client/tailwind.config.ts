import type { Config } from "tailwindcss";

const config: Config = {
	darkMode: ["class", "class"],
	content: [
		"./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/components/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			colors: {
				white: '#ffffff',
				gray: {
					100: "#f3f4f6",
					200: "#e5e7eb",
					300: "#d1d5db",
					500: "#6b7280",
					700: "#374151",
					800: "#1f2937",
				}, blue: {
					200: "#93c5fd",
					400: "#60a5fa",
					500: "#3b82f6",
				},
				'dark-bg': '#101214',
				'dark-secondary': '#1d1f21',
				'dark-tertiary': '#3b3d40',
				'blue-primary': '#0275ff',
				"stroke-dark": "#2d3135",
				"stroke-light": "#f3f4f6",
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			backgroundImage: {
				"gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
				"gradient-conic":
					"conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
			},
		},
		screens: {
			smallScreen: '470px',
			sm: '640px',
			md: '768px',
			lg: '1024px',
			xl: '1280px',
			'2xl': '1536px'
		},
		gridTemplateColumns: {
			'16': 'repeat(16, minmax(0, 1fr))',
			footer: 'repeat(4, 290px)'
		}
	},
	plugins: [

	],
};
export default config;
