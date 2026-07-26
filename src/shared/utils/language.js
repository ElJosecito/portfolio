import { English } from "./Languajes/English";
import { Spanish } from "./Languajes/Spanish";

const STORAGE_KEY = "languaje";

export function getStoredLanguageCode() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "es" || stored === "en") return stored;

  return navigator.language?.startsWith("es") ? "es" : "en";
}

export function getLanguage(code) {
  return code === "es" ? Spanish : English;
}

/**
 * Resuelve el idioma antes del primer render, igual que `initTheme` con el tema.
 *
 * Antes esto vivía en un `useEffect` del Header: el Router arrancaba siempre en
 * inglés y el idioma guardado se aplicaba recién después de montar. Para quien
 * lo tenía en español eso era un cuadro entero de texto en inglés, y como las
 * dos traducciones no miden lo mismo, el segundo render movía media página. Ese
 * era el pestañeo.
 */
export function initLanguage() {
  const code = getStoredLanguageCode();
  localStorage.setItem(STORAGE_KEY, code);
  return getLanguage(code);
}

export function storeLanguage(code) {
  localStorage.setItem(STORAGE_KEY, code);
  return getLanguage(code);
}
