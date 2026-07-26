/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  plugins: [],
  "darkMode": "class",
  theme: {
  	extend: {
  		fontFamily: {
  			sans: ['Inter', 'sans-serif'],
  		},
  		colors: {
  			'dark-grey': '#292929',
  			'back-dark-grey': '#212121',
  			'dusky-alt': 'rgba(11,10,16,0.5)',
  			'moonlit': '#f5f5f7',
  			'midnight': '#343436',
  			'noon': '#efeef2',
  			// Ciruela → berenjena. Es la identidad del portfolio: 50 son las cards
  			// en claro, 500 las pills de tecnología, 800 las cards en oscuro.
  			plum: {
  				50: '#EFE0F4',
  				100: '#E4CDED',
  				200: '#CFAADD',
  				300: '#B183C6',
  				400: '#8D5FA6',
  				500: '#6A4279',
  				600: '#573663',
  				700: '#472C52',
  				800: '#372D48',
  				900: '#251E31',
  				950: '#150F1C',
  			},
  			// Azul eléctrico: el acento de la timeline de experiencia. Se usa a
  			// cuentagotas, es lo único que compite con el ciruela.
  			volt: {
  				300: '#8FC0FF',
  				400: '#6FACFF',
  				500: '#549EFF',
  				600: '#3B7FDB',
  				700: '#2A61A9',
  			},
  		},
  		animation: {
  			'infinite-scroll': 'infinite-scroll 25s linear infinite',
  			// Barrido de luz de los skeletons.
  			shimmer: 'shimmer 1.6s ease-in-out infinite',
  			// El monograma del loader se dibuja y se borra en bucle.
  			'trace-glyph': 'trace-glyph 2.6s ease-in-out infinite',
  			'slide-track': 'slide-track 1.6s ease-in-out infinite',
  		},
  		keyframes: {
  			'infinite-scroll': {
  				from: {
  					transform: 'translateX(0)'
  				},
  				to: {
  					transform: 'translateX(-100%)'
  				}
  			},
  			shimmer: {
  				from: {
  					transform: 'translateX(-100%)'
  				},
  				to: {
  					transform: 'translateX(100%)'
  				}
  			},
  			// pathLength="100" en el SVG normaliza el largo de cada trazo, así el
  			// dasharray es 100 para todos y estos valores no dependen de cuánto
  			// mida realmente la curva. Offset negativo = el trazo se borra por
  			// donde empezó a dibujarse.
  			'trace-glyph': {
  				'0%': { strokeDashoffset: '100', opacity: '0.15' },
  				'35%': { strokeDashoffset: '0', opacity: '1' },
  				'65%': { strokeDashoffset: '0', opacity: '1' },
  				'100%': { strokeDashoffset: '-100', opacity: '0.15' }
  			},
  			'slide-track': {
  				'0%': { transform: 'translateX(-100%)' },
  				'100%': { transform: 'translateX(300%)' }
  			}
  		},
  	}
  },
};
