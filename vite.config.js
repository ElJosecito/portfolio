import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { writeFile } from "node:fs/promises";
import { resolve } from "path";

// El sitio se sirve en la raíz de josecito.dev (GitHub Pages + CNAME), así que
// base es '/'. Se puede sobreescribir con VITE_BASE si algún día se publica en
// un subdirectorio tipo usuario.github.io/repo/.
const base = process.env.VITE_BASE || "/";

const SITE_URL = "https://josecito.dev";

// Las rutas que no dependen de la base de datos. El panel no va: está como
// Disallow en robots.txt y no tiene nada que un buscador quiera.
const STATIC_ROUTES = [
  { path: "/", priority: "1.0", changefreq: "monthly" },
  { path: "/all-projects", priority: "0.8", changefreq: "monthly" },
];

function urlEntry({ path, priority, changefreq, lastmod }) {
  return [
    "  <url>",
    `    <loc>${SITE_URL}${path}</loc>`,
    lastmod ? `    <lastmod>${lastmod}</lastmod>` : null,
    `    <changefreq>${changefreq}</changefreq>`,
    `    <priority>${priority}</priority>`,
    "  </url>",
  ]
    .filter(Boolean)
    .join("\n");
}

/**
 * Trae los slugs publicados para meterlos en el sitemap.
 *
 * Va por REST y no por @supabase/supabase-js porque esto corre en el config de
 * Vite, en Node, y no hace falta arrastrar el cliente entero para una lectura.
 */
async function fetchProjectRoutes(env) {
  const url = env.VITE_SUPABASE_URL;
  const key = env.VITE_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error("faltan VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY");
  }

  const response = await fetch(
    `${url}/rest/v1/projects?select=slug,updated_at&order=created_at.desc`,
    { headers: { apikey: key, Authorization: `Bearer ${key}` } }
  );

  if (!response.ok) {
    throw new Error(`Supabase respondió ${response.status}`);
  }

  const rows = await response.json();

  return rows
    .filter((row) => row.slug)
    .map((row) => ({
      path: `/projects/${row.slug}`,
      priority: "0.7",
      changefreq: "monthly",
      lastmod: row.updated_at ? String(row.updated_at).slice(0, 10) : undefined,
    }));
}

/**
 * Genera dist/sitemap.xml al terminar el build.
 *
 * Se genera y no se escribe a mano porque los proyectos viven en Supabase: un
 * sitemap fijo quedaría desactualizado el día que agregues un proyecto desde el
 * panel, que es justo el flujo que el panel existe para habilitar.
 *
 * Si la consulta falla el build NO se rompe: sale un sitemap con las rutas
 * fijas y un aviso. Quedarte sin deploy por un sitemap incompleto es peor que
 * el sitemap incompleto.
 */
function sitemapPlugin(env) {
  return {
    name: "generate-sitemap",
    apply: "build",

    async closeBundle() {
      let routes = STATIC_ROUTES;

      try {
        const projectRoutes = await fetchProjectRoutes(env);
        routes = [...STATIC_ROUTES, ...projectRoutes];
        console.log(`\n[sitemap] ${routes.length} URLs (${projectRoutes.length} proyectos)`);
      } catch (error) {
        console.warn(
          `\n[sitemap] no se pudieron leer los proyectos (${error.message}). ` +
            "Sale solo con las rutas fijas."
        );
      }

      const xml = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
        ...routes.map(urlEntry),
        "</urlset>",
        "",
      ].join("\n");

      await writeFile(resolve(process.cwd(), "dist/sitemap.xml"), xml, "utf8");
    },
  };
}

// https://vitejs.dev/config/
// Configuración de Vite para el portafolio
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), "VITE_");

  return {
    plugins: [react(), sitemapPlugin(env)],
    base: command === "build" ? base : "/",
    resolve: {
      alias: {
        "@": resolve(process.cwd(), "src"),
      },
    },
  };
});
