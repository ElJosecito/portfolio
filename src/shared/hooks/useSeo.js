import { useEffect } from "react";

import { OG_IMAGE, SITE_NAME, absoluteUrl, truncate } from "../utils/seo";

/**
 * Los tags que este hook administra vienen marcados con `data-seo` desde
 * index.html. Se buscan por esa marca y se reescriben; no se crean duplicados y
 * no se toca nada que no sea nuestro.
 */
function setMeta(key, attribute, name, content) {
  if (!content) return;

  let tag = document.head.querySelector(`[data-seo="${key}"]`);

  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute("data-seo", key);
    tag.setAttribute(attribute, name);
    document.head.appendChild(tag);
  }

  tag.setAttribute("content", content);
}

function setCanonical(url) {
  let tag = document.head.querySelector('[data-seo="canonical"]');

  if (!tag) {
    tag = document.createElement("link");
    tag.setAttribute("data-seo", "canonical");
    tag.setAttribute("rel", "canonical");
    document.head.appendChild(tag);
  }

  tag.setAttribute("href", url);
}

/**
 * Escribe el JSON-LD de la página.
 *
 * Este sí se borra y se vuelve a crear en cada ruta: el structured data de un
 * proyecto no tiene por qué seguir declarado cuando ya estás en otra página, y
 * dejarlo colgado es de las cosas que Search Console marca como error.
 */
function setJsonLd(data) {
  document.head.querySelectorAll('[data-seo="jsonld"]').forEach((node) => node.remove());

  if (!data) return;

  const blocks = Array.isArray(data) ? data : [data];

  blocks.filter(Boolean).forEach((block) => {
    const script = document.createElement("script");
    script.setAttribute("type", "application/ld+json");
    script.setAttribute("data-seo", "jsonld");
    script.textContent = JSON.stringify(block);
    document.head.appendChild(script);
  });
}

/**
 * Aplica los metadatos de una ruta: título, descripción, canonical, Open Graph,
 * Twitter Card, idioma del documento y JSON-LD.
 *
 * Reemplaza a los `document.title = "..."` sueltos que había en cada página, que
 * dejaban al resto de los metadatos con los valores de index.html sin importar
 * dónde estuvieras.
 *
 * Ojo con lo que esto no arregla: los crawlers que no ejecutan JavaScript
 * —LinkedIn, WhatsApp, Slack— nunca ven este hook. Para ellos vale lo que esté
 * escrito en index.html. Por eso el detalle de proyecto comparte la tarjeta
 * genérica del sitio y no la suya propia; eso se resuelve con prerender.
 *
 * @param {object} options
 * @param {string} options.title - Título de la pestaña y de la tarjeta.
 * @param {string} options.description - Se recorta a ~158 caracteres.
 * @param {string} options.path - Ruta para el canonical y og:url.
 * @param {string} [options.image] - Absoluta o relativa. Por defecto, la del sitio.
 * @param {"website"|"article"} [options.type]
 * @param {string} [options.locale] - `es_DO` o `en_US`.
 * @param {string} [options.lang] - Lo que va en `<html lang>`.
 * @param {object|object[]} [options.jsonLd]
 */
export function useSeo({
  title,
  description,
  path = "/",
  image,
  type = "website",
  locale = "es_DO",
  lang = "es",
  jsonLd,
}) {
  // `jsonLd` casi siempre llega como un objeto literal nuevo en cada render, así
  // que se serializa para comparar por contenido. Sin esto el efecto correría en
  // cada render y estaría borrando y recreando los <script> todo el tiempo.
  const jsonLdKey = jsonLd ? JSON.stringify(jsonLd) : "";

  useEffect(() => {
    if (!title) return;

    const url = absoluteUrl(path);
    const shortDescription = truncate(description);
    const imageUrl = absoluteUrl(image || OG_IMAGE);
    const fullTitle = title.includes(SITE_NAME) ? title : `${title} — ${SITE_NAME}`;

    document.title = fullTitle;
    document.documentElement.lang = lang;

    setMeta("description", "name", "description", shortDescription);
    setCanonical(url);

    setMeta("og:title", "property", "og:title", fullTitle);
    setMeta("og:description", "property", "og:description", shortDescription);
    setMeta("og:url", "property", "og:url", url);
    setMeta("og:image", "property", "og:image", imageUrl);
    setMeta("og:type", "property", "og:type", type);
    setMeta("og:locale", "property", "og:locale", locale);

    setMeta("twitter:title", "name", "twitter:title", fullTitle);
    setMeta("twitter:description", "name", "twitter:description", shortDescription);
    setMeta("twitter:image", "name", "twitter:image", imageUrl);

    setJsonLd(jsonLdKey ? JSON.parse(jsonLdKey) : null);
  }, [title, description, path, image, type, locale, lang, jsonLdKey]);
}

export default useSeo;
