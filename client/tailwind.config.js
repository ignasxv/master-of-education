/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./index.html", "./src/**/*.{tsx,jsx,js,ts}"],
	darkMode: "media",
	theme: {
		extend: {
			colors: {
				primary: {
					default:"#1EA3E3",
					50: "#f1f9fe",
					100: "#e2f2fc",
					200: "#bee4f9",
					300: "#85cef4",
					400: "#44b6ec",
					500: "#1ea3e3",
					600: "#0e7ebb",
					700: "#0d6497",
					800: "#0f557d",
					900: "#124768",
					950: "#0c2d45",
				},
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
		},
	},
	plugins: [],
};
