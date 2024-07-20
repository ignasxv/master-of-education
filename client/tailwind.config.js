/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./index.html", "./src/**/*.{tsx,jsx,js,ts}"],
	darkMode: "media",
	theme: {
		colors:{
			stone: {
				50: "#f4f6fb",
				100: "#e9edf5",
				200: "#cedae9",
				300: "#a2bad7",
				400: "#7094c0",
				500: "#4e78a9",
				600: "#3c5f8d",
				700: "#314d73",
				800: "#2c4260",
				900: "#293951",
				950: "#1e293c",
			},
		},
		extend: {
			colors: {
				primary: {
					50: "#f0f7fe",
					100: "#ddecfc",
					200: "#c3dffa",
					300: "#9acbf6",
					400: "#6bafef",
					500: "#4890e9",
					600: "#3373dd",
					700: "#2a5fcb",
					800: "#284da5",
					900: "#264482",
					950: "#0e1629",
				},
			},
		},
	},
	plugins: [],
};
