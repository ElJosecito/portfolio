import { useEffect } from "react";
import gsap from "gsap";
import { hasHoverPointer } from "../../hero3d/motionPreferences";

/**
 * Botón magnético: sigue un poco al cursor cuando pasa cerca, y vuelve a su
 * lugar con un rebote suave al salir. Solo con mouse real — en táctil no hay
 * "cerca" que detectar, así que ni se agrega el listener.
 *
 * `strength` es qué tanto del desplazamiento del mouse se traduce en
 * movimiento del botón (0.25 = se mueve una cuarta parte de lo que se movió
 * el cursor dentro del elemento).
 */
export function useMagnetic(ref, strength = 0.25) {
  useEffect(() => {
    const el = ref.current;
    if (!el || !hasHoverPointer()) return undefined;

    const handleMove = (event) => {
      const rect = el.getBoundingClientRect();
      const x = event.clientX - (rect.left + rect.width / 2);
      const y = event.clientY - (rect.top + rect.height / 2);
      gsap.to(el, { x: x * strength, y: y * strength, duration: 0.3, ease: "power2.out" });
    };

    const handleLeave = () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.4)" });
    };

    el.addEventListener("mousemove", handleMove);
    el.addEventListener("mouseleave", handleLeave);

    return () => {
      el.removeEventListener("mousemove", handleMove);
      el.removeEventListener("mouseleave", handleLeave);
      gsap.killTweensOf(el);
    };
  }, [ref, strength]);
}
