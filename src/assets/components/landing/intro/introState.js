/**
 * Decisión compartida de "¿corresponde mostrar la intro?" — la necesitan DOS
 * componentes que no son padre/hijo directo (IntroLoader y HeroSection, vía
 * NewLanding) y que tienen que coincidir en la misma respuesta: si
 * IntroLoader decide no montarse, HeroSection tiene que saberlo para no
 * quedarse esperando para siempre un evento que nadie va a disparar.
 *
 * Se resuelve en el padre común (NewLanding) con `useState(shouldShowIntro)`
 * UNA sola vez por montaje y se pasa para abajo como prop — no cada
 * componente la vuelve a calcular por su cuenta, porque entre el render de
 * uno y el del otro `sessionStorage` podría cambiar (ver `markIntroShown`) y
 * terminarían viendo respuestas distintas.
 */
const SESSION_KEY = "landing-intro-shown";

export function shouldShowIntro() {
  if (typeof window === "undefined") return false;

  // La intro es movimiento puro (clip-path, contador, letras cayendo): si el
  // visitante pidió `?landing=new` a mano con reduced-motion activo (el único
  // caso donde el gate de variante no filtra reduced-motion, ver
  // deviceCapability.js), la intro tiene que respetarlo igual.
  if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return false;

  try {
    return !sessionStorage.getItem(SESSION_KEY);
  } catch {
    // Safari en modo privado estricto (o cookies/storage bloqueadas) puede
    // tirar al leer sessionStorage. Sin memoria de sesión, mejor mostrarla
    // una vez por carga que no mostrarla nunca.
    return true;
  }
}

export function markIntroShown() {
  try {
    sessionStorage.setItem(SESSION_KEY, "1");
  } catch {
    // sin sessionStorage no hay nada que persistir — se repetirá la intro en
    // la próxima carga, no es un error fatal.
  }
}

// Nombre del evento que dispara IntroLoader al terminar (reveal completo o
// skip): HeroSection lo escucha para arrancar la caída de las letras y
// useHeadRig para empezar el giro de perfil a frente, sin que ninguno de los
// dos tenga que importar IntroLoader directamente.
export const INTRO_DONE_EVENT = "landing:intro-done";
