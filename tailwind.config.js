/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			colors: {
				// màu brand chính
				primary: {
					50: "#e7e9f2",
					100: "#cfd3e5",
					200: "#b7bed7",
					300: "#a0a9ca",
					400: "#8895bd",
					500: "#7181b0",
					600: "#596da4",
					700: "#405b97",
					800: "#21498a",
					900: "#0062FF",
				},
				// màu nền tổng thể
				background: {
					950: "#020617", // body bg
					900: "#020617",
					800: "#020617",
				},
				// màu chữ
				ink: {
					50: "#ffffff",
					100: "#f5f5f5",
					200: "#e5e5e5",
					300: "#d4d4d4",
					400: "#a3a3a3",
					500: "#737373",
					600: "#525252",
					700: "#404040",
					800: "#262626",
					900: "#171717",
				},
				// màu “vật thể” / card / surface
				surface: {
					50: "#c4c4c4",
					100: "#a7a7a7",
					200: "#8b8b8b",
					300: "#717171",
					400: "#575757",
					500: "#3f3f3f",
					600: "#282828",
					700: "#171717",
				},
				success: {
					500: "#22946e",
					400: "#47d5a6",
					300: "#9ae8ce",
				},
				warning: {
					500: "#a87a2a",
					400: "#d7ac61",
					300: "#ecd7b2",
				},
				danger: {
					500: "#9c2121",
					400: "#d94a4a",
					300: "#eb9e9e",
				},
				info: {
					500: "#21498a",
					400: "#4077d1",
					300: "#92b2e5",
				},
				text: {
					primary: "#FFFFFF",
				},
			},
			boxShadow: {
				soft: "0 10px 40px rgba(0,0,0,0.25)",
			},
			borderRadius: {
				xl: "12px",
			},
			fontFamily: {
				sans: [
					"League Spartan Fallback",
					"system-ui",
					"-apple-system",
					"Segoe UI",
					"sans-serif",
				],
			},
		},
	},
	plugins: [],
};
