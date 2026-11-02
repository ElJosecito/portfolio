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
  			// Display gordo/pesado para el nombre gigante del hero 3D (antes era
  			// una serif editorial, descartada por pedido explícito). Separada de
  			// `sans` a propósito: el body sigue siendo Inter en todo el resto
  			// del sitio, esto es solo para esa pieza puntual. "Milker" es un
  			// archivo local (public/fonts/Milker.woff2, @font-face en
  			// style.css): cubre tildes/ñ y no trae ninguna marca de "demo" o
  			// trial en su tabla `name`, a diferencia de la otra fuente evaluada
  			// (chunko-bold-demo), que le faltaban é/í/á/ó/ú/ñ.
  			display: ['Milker', '"Arial Black"', '"Helvetica Neue"', 'sans-serif'],
  			// Mono técnico para las notas/anotaciones del hero y la navegación:
  			// el mismo mono se reusa en el header para los links y el CTA.
  			tech: ['"JetBrains Mono"', '"Fira Code"', 'monospace'],
  		},
  		colors: {
  			'dark-grey': '#292929',
  			'back-dark-grey': '#212121',
  			'dusky-alt': 'rgba(11,10,16,0.5)',
  			'moonlit': '#f5f5f7',
  			'midnight': '#343436',
  			'noon': '#efeef2',
  			// Cobalto plano del hero 3D: mismo azul en claro y oscuro a propósito
  			// (es la identidad de esa sección puntual, no del tema). `ink` es el
  			// casi-blanco del nombre gigante detrás de la cabeza.
  			hero: {
  				blue: '#2233c9',
  				'blue-deep': '#1b2aa8',
  				ink: '#dfe6ff',
  			},
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
  			// Titileo sutil de los sparkles ✦. Nada vistoso, solo que no se vean
  			// estáticos del todo.
  			twinkle: 'twinkle 3.2s ease-in-out infinite',
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
  			twinkle: {
  				'0%, 100%': { opacity: '0.25', transform: 'scale(0.85)' },
  				'50%': { opacity: '0.9', transform: 'scale(1.05)' }
  			}
  		},
  	}
  },
};
