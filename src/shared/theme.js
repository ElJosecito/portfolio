import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "theme";

export function getStoredTheme() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "dark" || stored === "light") return stored;

  const prefersDark =
    window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  return prefersDark ? "dark" : "light";
}

export function applyTheme(theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
}

/**
 * Se llama desde main.jsx antes de renderizar.
 *
 * Antes esto vivía dentro del Header, que no se monta en `/admin` porque el
 * router le esconde el layout. Resultado: el panel quedaba siempre en claro sin
 * importar la preferencia guardada. La clase la pone la app, no un componente
 * de una sola pantalla.
 */
export function initTheme() {
  const theme = getStoredTheme();
  localStorage.setItem(STORAGE_KEY, theme);
  applyTheme(theme);
  return theme;
}

export function useTheme() {
  const [theme, setTheme] = useState(getStoredTheme);

  useEffect(() => {
    applyTheme(theme);
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((current) => (current === "dark" ? "light" : "dark"));
  }, []);

  return { theme, toggleTheme };
}
