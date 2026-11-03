import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "../../hero3d/motionPreferences";

gsap.registerPlugin(ScrollTrigger);

// La flecha apunta al CENTRO de la cara: el centro de la cabeza en pantalla
// (ver useHeadClickReaction, mismo sistema), un poco más abajo — el modelo
// tiene mucho pelo arriba, así que el centro del círculo cae en la frente.
// Tamaño en pantalla ≈ 0.5 · scale · min(ancho, alto).
const HEAD_SIZE_FACTOR = 0.5;
const FACE_OFFSET_Y = 0.08;
// Largo FIJO de la flecha (fracción del ancho de pantalla): no se estira
// hasta la cara, solo gira para apuntar hacia donde está la cabeza.
const ARROW_LENGTH_VW = 0.15;
// Largo de cada trazo de la punta de flecha y su apertura.
const HEAD_LEN = 18;
const HEAD_SPREAD = 0.5;

// Qué tan rápido siguen la dirección la PUNTA y el MEDIO de la curva (más
// alto = más seco). El medio va más lento: mientras la cabeza se mueve, la
// curva se arquea en vez de rotar rígida como una aguja.
const TIP_FOLLOW = 9;
const MID_FOLLOW = 2.6;
const clamp01 = (value) => Math.min(1, Math.max(0, value));

const damp = (current, target, lambda, dt) => current + (target - current) * (1 - Math.exp(-lambda * dt));

/**
 * Flecha "ese soy yo" que APUNTA a la cabeza: tamaño y punto de partida
 * fijos junto al texto, y en cada frame (gsap.ticker) solo cambia su
 * dirección según la posición real de la cabeza, que el rig expone en el
 * sistema [-1, 1] de pantalla (ver useHeadRig). No se estira hasta la cara.
 * El dibujado sigue atado al scroll con el mismo rango que el resto de los
 * trazos del contacto (`top 55%` → `center center`): primero crece la curva,
 * después la punta, al final la nota.
 *
 * La forma del path cambia cuando la flecha gira, así que el "dibujado" se
 * hace a mano con stroke-dasharray/dashoffset sobre el largo actual — un
 * DrawSVG fijado al largo inicial se desarmaría.
 */
export function useFollowArrow(sectionRef, rig, { curveRef, headRef, noteRef }) {
  useEffect(() => {
    const section = sectionRef.current;
    const curve = curveRef.current;
    const head = headRef.current;
    const note = noteRef.current;
    if (!section || !curve || !head || !note || !rig) return undefined;

    const reduced = prefersReducedMotion();
    const desktop = window.matchMedia("(min-width: 1024px)");

    const trigger = reduced
      ? null
      : ScrollTrigger.create({ trigger: section, start: "top 55%", end: "center center" });

    // Solo se mide mientras el contacto está en pantalla: antes el tick leía
    // `getBoundingClientRect()` en CADA frame de toda la página, y como gsap
    // ya había escrito estilos en ese mismo frame, el navegador tenía que
    // recalcular el layout a la fuerza (Lighthouse: "forced reflow").
    let visible = false;
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    observer.observe(section);

    // Ángulos suavizados: arrancan en `null` y toman la dirección real en el
    // primer frame visible (sin "barrido" inicial desde 0).
    let tipAngle = null;
    let midAngle = null;

    const update = (_time, deltaMs) => {
      if (!desktop.matches || !visible) return;
      const rect = section.getBoundingClientRect();

      const values = rig.current;
      const size = HEAD_SIZE_FACTOR * values.scale * Math.min(window.innerWidth, window.innerHeight);
      const headX = (values.nx * 0.5 + 0.5) * window.innerWidth - rect.left;
      const headY = (values.ny * 0.5 + 0.5) * window.innerHeight - rect.top;

      // Inicio fijo, junto al texto (mismo lugar donde estaba la flecha
      // estática), y punta delante de la cara.
      const startX = rect.width * 0.505;
      const startY = rect.height * 0.46 + window.innerWidth * 0.11;
      const targetX = headX;
      const targetY = headY + size * FACE_OFFSET_Y;

      // Solo la DIRECCIÓN sigue a la cabeza; el largo es fijo. Punta y medio
      // la siguen a distinta velocidad (ver TIP_FOLLOW / MID_FOLLOW).
      const theta = Math.atan2(targetY - startY, targetX - startX);
      const dt = Math.min((deltaMs || 16) / 1000, 0.1);
      if (tipAngle === null || reduced) {
        tipAngle = theta;
        midAngle = theta;
      } else {
        tipAngle = damp(tipAngle, theta, TIP_FOLLOW, dt);
        midAngle = damp(midAngle, theta, MID_FOLLOW, dt);
      }

      const length = window.innerWidth * ARROW_LENGTH_VW;
      const along = (angle, t) => [Math.cos(angle) * length * t, Math.sin(angle) * length * t];
      // Normal hacia "arriba" de la pantalla (según la dirección del medio),
      // para la panza de la curva.
      let nx = -Math.sin(midAngle);
      let ny = Math.cos(midAngle);
      if (ny > 0) {
        nx = -nx;
        ny = -ny;
      }
      const [tdx, tdy] = along(tipAngle, 1);
      const tipX = startX + tdx;
      const tipY = startY + tdy;

      // Curva con "panza" hacia arriba, como una flecha a mano alzada. El
      // primer control sigue al MEDIO (llega tarde: la curva se arquea al
      // moverse) y el segundo a la PUNTA. Quieta en reposo.
      const lift = length * 0.3;
      const [m1x, m1y] = along(midAngle, 0.3);
      const [m2x, m2y] = along(tipAngle, 0.72);
      const c1x = startX + m1x + nx * lift;
      const c1y = startY + m1y + ny * lift;
      const c2x = startX + m2x - nx * lift * 0.35;
      const c2y = startY + m2y - ny * lift * 0.35;
      curve.setAttribute("d", `M${startX} ${startY} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${tipX} ${tipY}`);

      // Punta: dos trazos cortos orientados con la dirección REAL hacia la
      // cabeza (`tipAngle`), no con la tangente de la curva — esa se dobla y
      // arquea al moverse, y la punta quedaba torcida.
      const angle = tipAngle;
      const ax = tipX - HEAD_LEN * Math.cos(angle - HEAD_SPREAD);
      const ay = tipY - HEAD_LEN * Math.sin(angle - HEAD_SPREAD);
      const bx = tipX - HEAD_LEN * Math.cos(angle + HEAD_SPREAD);
      const by = tipY - HEAD_LEN * Math.sin(angle + HEAD_SPREAD);
      head.setAttribute("d", `M${tipX} ${tipY} L ${ax} ${ay} M ${tipX} ${tipY} L ${bx} ${by}`);

      const progress = trigger ? trigger.progress : 1;
      const curveLength = curve.getTotalLength();
      const curveP = clamp01(progress / 0.8);
      curve.style.strokeDasharray = `${curveLength} ${curveLength}`;
      curve.style.strokeDashoffset = `${curveLength * (1 - curveP)}`;
      const headLength = HEAD_LEN * 2;
      const headP = clamp01((progress - 0.75) / 0.15);
      head.style.strokeDasharray = `${headLength} ${headLength}`;
      head.style.strokeDashoffset = `${headLength * (1 - headP)}`;

      note.style.left = `${startX - window.innerWidth * 0.02}px`;
      note.style.top = `${startY + 12}px`;
      note.style.opacity = `${0.85 * clamp01((progress - 0.85) / 0.15)}`;
    };

    gsap.ticker.add(update);
    update();

    return () => {
      gsap.ticker.remove(update);
      observer.disconnect();
      trigger?.kill();
    };
  }, [sectionRef, rig, curveRef, headRef, noteRef]);
}
