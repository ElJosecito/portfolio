import React from "react";
import ReactMarkdown from "react-markdown";
import { cn } from "./cn";

/**
 * Renderiza markdown con los estilos del portfolio.
 *
 * react-markdown construye elementos de React en vez de devolver una cadena de
 * HTML, así que no hay `dangerouslySetInnerHTML` ni camino de inyección, aunque
 * el contenido venga de la base.
 *
 * Los estilos van componente por componente y no con un plugin de tipografía
 * para no sumar otra dependencia por una decena de reglas.
 */
export function Markdown({ children, className = "" }) {
  if (!children) return null;

  return (
    <div className={cn("space-y-4 leading-relaxed", className)}>
      <ReactMarkdown
        components={{
          h1: ({ children }) => (
            <h2 className="mt-8 text-3xl font-bold">{children}</h2>
          ),
          h2: ({ children }) => (
            <h2 className="mt-8 text-2xl font-bold">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="mt-6 text-xl font-bold">{children}</h3>
          ),
          p: ({ children }) => <p className="opacity-80">{children}</p>,
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noreferrer"
              className="font-medium text-[#549eff] underline underline-offset-2 hover:opacity-70"
            >
              {children}
            </a>
          ),
          ul: ({ children }) => (
            <ul className="list-disc space-y-1 pl-6 opacity-80">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal space-y-1 pl-6 opacity-80">{children}</ol>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-[#549eff] pl-4 italic opacity-70">
              {children}
            </blockquote>
          ),
          code: ({ inline, children }) =>
            inline ? (
              <code className="rounded bg-black/10 px-1.5 py-0.5 text-sm dark:bg-white/10">
                {children}
              </code>
            ) : (
              <code className="block overflow-x-auto rounded-xl bg-black/10 p-4 text-sm dark:bg-white/10">
                {children}
              </code>
            ),
          hr: () => <hr className="border-black/10 dark:border-white/10" />,
          img: ({ src, alt }) => (
            <img src={src} alt={alt} className="max-w-full rounded-xl" />
          ),
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}

export default Markdown;
