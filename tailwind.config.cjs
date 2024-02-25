/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  plugins: [],
  "darkMode": "class",
  theme: {
		extend: {
			colors: {
        'dark-grey': '#292929',
        'back-dark-grey': '#212121',
				'dusky-alt': 'rgba(11,10,16,0.5)',
				"moonlit": '#f5f5f7',
				"midnight": '#343436',
				"noon": '#efeef2',
			},
			animation: {
				'infinite-scroll': 'infinite-scroll 25s linear infinite',
			},
			keyframes: {
				'infinite-scroll': {
					from: { transform: 'translateX(0)' },
					to: { transform: 'translateX(-100%)' },
				},
				
			},
		},
	},
};
