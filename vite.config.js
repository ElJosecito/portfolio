import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

// El sitio se sirve en la raíz de josecito.dev (GitHub Pages + CNAME), así que
// base es '/'. Se puede sobreescribir con VITE_BASE si algún día se publica en
// un subdirectorio tipo usuario.github.io/repo/.
const base = process.env.VITE_BASE || "/";

// https://vitejs.dev/config/
// Configuración de Vite para el portafolio
export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: command === "build" ? base : "/",
  resolve: {
    alias: {
      "@": resolve(process.cwd(), "src"),
    },
  },
}));
