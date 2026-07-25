/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  plugins: [require("tailwindcss-animate")],
  "darkMode": "class",
  theme: {
  	extend: {
  		fontFamily: {
  			// Syne pone la actitud en los titulares; Inter se borra y deja leer.
  			display: ['Syne', 'sans-serif'],
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
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		animation: {
  			'infinite-scroll': 'infinite-scroll 25s linear infinite'
  		},
  		keyframes: {
  			'infinite-scroll': {
  				from: {
  					transform: 'translateX(0)'
  				},
  				to: {
  					transform: 'translateX(-100%)'
  				}
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
};
