import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { invalidate } from "@react-three/fiber";
import { INTRO_DONE_EVENT, shouldShowIntro } from "../intro/introState";

gsap.registerPlugin(ScrollTrigger);

// Grados a radianes sin arrastrar three.js: este archivo corre fuera del
// Canvas (es el controlador del rig, no la escena — ver FaceModel, modo
// "rig"), y `THREE.MathUtils.degToRad` era la ÚNICA razón por la que el
// chunk de NewLanding importaba `three.core` (~102 kB gz) de forma estática,
// antes incluso de que el modelo 3D de verdad empezara a descargarse (ver
// revisión, punto 10).
const deg = (degrees) => (degrees * Math.PI) / 180;

// Pose de "perfil" con la que arranca la cabeza antes de girar hacia el
// frente (ver `useHeadEntrance` más abajo) — nada que ver con CORNER (esa es
// la pose de la esquina al salir del hero, una vez que el usuario ya
// scrolleó). Yaw grande a propósito: se nota mucho más el giro "de costado a
// de frente" que uno chico.
const ENTRANCE_YAW = deg(75);

// Todas las posiciones son nx/ny en [-1, 1] (mismo sistema que
// usePointerTarget: origen en el centro de pantalla, ny positivo hacia
// abajo). FaceModel (modo "rig") las convierte a mundo 3D por su cuenta.
const HERO = { nx: 0, ny: 0.05, scale: 0.8, yaw: 0, pitch: 0 };

// Esquina inferior derecha. El yaw es NEGATIVO a propósito: la cabeza mira
// hacia +Z (a la cámara) en reposo, y rotar +Y la gira hacia +X (derecha de
// pantalla, ver FaceModel). Con la cabeza parada en el borde derecho, un yaw
// positivo la hace mirar todavía más a la derecha, es decir AFUERA de la
// página — el bug que reportó el usuario ("mira para el lado que no es").
// Con yaw negativo gira hacia -X (izquierda), o sea hacia el contenido: un
// 3/4 bien cerrado a perfil (~65°), mirando adentro de la página.
const CORNER = { nx: 0.74, ny: 0.68, scale: 0.22, yaw: deg(-65), pitch: 0.04 };

// En pantallas chicas la esquina se acerca más al borde y la cabeza es más
// chica todavía: a 390px de ancho, el tamaño "desktop" ya se comía parte del
// contenido de abajo.
const CORNER_MOBILE = { nx: 0.82, ny: 0.82, scale: 0.15, yaw: deg(-70), pitch: 0.04 };

// Al llegar al contacto, la cabeza vuelve de frente — el cierre simétrico del
// viaje que empezó en el hero. En escritorio se para en la mitad derecha,
// debajo del título: el texto de ContactSection va alineado a la izquierda
// (ver su CSS) y esa mitad es espacio libre real. Antes iba centrada
// (nx 0) y tapaba el botón del email y las redes.
// De frente (yaw 0) y centrada en vertical — la flecha "ese soy yo" de
// ContactSection la sigue hasta acá (ver useFollowArrow). `scale` no es fijo: ver
// contactSideScale.
const CONTACT_SIDE = { nx: 0.6, ny: 0, scale: 1, yaw: 0, pitch: 0 };

// "De frente" fuera del centro: la cámara de HeadScene está en el eje (z 5.6,
// fov 35°), así que una cabeza corrida a la derecha con yaw 0 se ve en
// diagonal (~18° en 16:9) por pura perspectiva — en el hero no pasa porque
// está centrada. Se gira lo justo para que mire a la cámara: el ángulo entre
// el eje de la cámara y la posición de la cabeza en el mundo (mismo cálculo
// que hace FaceModel para ubicarla, ver `worldX`).
const CAMERA_DISTANCE = 5.6;
const CAMERA_FOV_DEG = 35;
const FACE_CAMERA_SIGN = -1;
function contactSideYaw() {
  const halfHeight = Math.tan(deg(CAMERA_FOV_DEG) / 2) * CAMERA_DISTANCE;
  const halfWidth = halfHeight * (window.innerWidth / window.innerHeight);
  const worldX = CONTACT_SIDE.nx * halfWidth;
  return FACE_CAMERA_SIGN * Math.atan2(worldX, CAMERA_DISTANCE);
}

// La cabeza en pantalla mide ≈ 0.5 · scale · min(ancho, alto) (ver
// useHeadClickReaction) — o sea que escala con el ALTO en escritorio. Para
// que ocupe ~24% del ANCHO en cualquier proporción de pantalla se calcula
// en cada refresh, con un tope para monitores ultra anchos o ventanas muy
// bajitas.
const CONTACT_WIDTH_SHARE = 0.24;
function contactSideScale() {
  const shortSide = Math.min(window.innerWidth, window.innerHeight);
  const scale = (CONTACT_WIDTH_SHARE * window.innerWidth) / (0.5 * shortSide);
  return Math.min(Math.max(scale, 0.6), 1.15);
}

/**
 * Controlador de la cabeza compartida del landing nuevo.
 *
 * Dos tweens independientes, cada uno anclado a SU sección (ver revisión,
 * punto 7), no un timeline proporcional repartido sobre el largo total de la
 * página hero→contacto:
 *
 *   1. Hero → esquina: mientras se sale del hero (`heroRef`), con el MISMO
 *      trigger/rango que usa `HeroSection` (ver `useHeroExit` ahí: "top top"
 *      → "bottom top" sobre la propia sección) para que la cabeza y la
 *      salida de las letras del nombre se sientan como un solo gesto.
 *   2. Esquina → contacto (de frente a la derecha en escritorio, ver CONTACT_SIDE): al entrar al contacto (`contactRef`),
 *      con `refreshPriority: -1` porque es la ÚLTIMA sección de la página —
 *      tiene que medirse después de cualquier otra cosa que pueda cambiar el
 *      alto del documento antes de ella (ver revisión, punto 13).
 *
 * Entre esos dos tramos (about, experiencia, proyectos, stack) no corre
 * ningún tween sobre estas propiedades: el rig simplemente se queda con el
 * último valor que le dejó el tramo 1, parado en la esquina.
 *
 * Esconder la cabeza al pasar por Proyectos YA NO es cosa de este archivo:
 * es apilamiento puro (`relative z-30 isolate` en ProjectsSection, ver esa
 * sección) — la sección opaca tapa la cabeza, sin tocar su posición, escala
 * ni opacidad. Eso es lo que elimina de raíz:
 *  - el bucle infinito de `waitForStableLayout` (un `MutationObserver` que
 *    llamaba a `ScrollTrigger.refresh()`, que mutaba el DOM, que volvía a
 *    disparar el observer — sin salida);
 *  - la pelea de tres tweens distintos escribiendo `presence` a la vez;
 *  - la dependencia de un fade de opacidad por material.
 *
 * El ref se escribe desde gsap/ScrollTrigger, nunca desde React state: leerlo
 * en cada frame dentro de un `useFrame` (ver FaceModel, modo "rig") es lo que
 * evita un render de React por frame de scroll.
 */
export function useHeadRig({ heroRef, contactRef }) {
  const rig = useRef({ ...HERO });

  useEffect(() => {
    const heroEl = heroRef.current;
    const contactEl = contactRef.current;
    if (!heroEl || !contactEl) return undefined;

    const values = rig.current;
    values.nx = HERO.nx;
    values.ny = HERO.ny;
    values.scale = HERO.scale;
    values.yaw = HERO.yaw;
    values.pitch = HERO.pitch;

    const mm = gsap.matchMedia();

    // Las DOS condiciones van en la misma llamada a propósito: con gsap
    // matchMedia, el callback solo corre para una condición cuando esa
    // condición da `true` — pasar nada más que "isMobile" significa que en
    // escritorio (donde esa media query nunca matchea) el callback no corre
    // NUNCA. Con las dos acá, gsap llama al callback con la que esté activa,
    // y además revierte y reconstruye solo si se cruza el breakpoint (ej.
    // girar el celular). `isTablet` existe solo por el contacto: la pose de
    // costado (CONTACT_SIDE) necesita el layout de dos columnas de
    // ContactSection, que recién aparece en 1024px.
    mm.add(
      {
        isMobile: "(max-width: 639px)",
        isTablet: "(min-width: 640px) and (max-width: 1023px)",
        isDesktop: "(min-width: 1024px)",
      },
      (context) => {
        const corner = context.conditions.isMobile ? CORNER_MOBILE : CORNER;
        // Sin espacio para dos columnas, la cabeza se queda chica en su
        // esquina y solo gira de frente: nunca encima del email ni las redes.
        const contact = context.conditions.isDesktop
          ? { ...CONTACT_SIDE, scale: contactSideScale, yaw: contactSideYaw }
          : { ...corner, yaw: 0, pitch: 0 };
        // Escala final real del contacto (número), para que `footerHide` la
        // componga; se actualiza en cada refresh junto con el tween.
        const contactScale = () => (typeof contact.scale === "function" ? contact.scale() : contact.scale);

        // `immediateRender: false`: por defecto gsap renderiza el estado
        // FINAL de un tween apenas se crea, salvo que se le pida lo
        // contrario (ScrollTrigger.js:1069) — sin esto la cabeza "saltaba"
        // directo a la pose de la esquina/contacto al montar, antes de que
        // el usuario llegara a scrollear hasta ahí.
        const heroExit = gsap.fromTo(
          values,
          { ...HERO },
          {
            ...corner,
            ease: "power2.inOut",
            immediateRender: false,
            // El canvas de la cabeza vive en `frameloop="demand"` (ver
            // HeadScene, revisión punto 14): sin pedir un frame en cada
            // paso del scrub, la posición del rig cambiaría en memoria pero
            // el canvas se quedaría pintado con el frame viejo hasta que
            // otra cosa (el puntero) lo invalide.
            onUpdate: () => invalidate(),
            scrollTrigger: { trigger: heroEl, start: "top top", end: "bottom top", scrub: true },
          }
        );

        const contactEntry = gsap.fromTo(
          values,
          { ...corner },
          {
            ...contact,
            ease: "power2.inOut",
            immediateRender: false,
            // `scale` del contacto depende del tamaño de la ventana (ver
            // contactSideScale): re-medir en cada refresh/resize.
            invalidateOnRefresh: true,
            onUpdate: () => invalidate(),
            scrollTrigger: {
              trigger: contactEl,
              start: "top bottom",
              end: "center center",
              scrub: true,
              refreshPriority: -1,
            },
          }
        );

        // Esconder la cabeza antes del footer (ver revisión, rough edge: la
        // cabeza fija quedaba flotando sobre las redes del Footer durante el
        // telón final). A diferencia del resto del viaje, acá NO es
        // apilamiento CSS (ver comentario de `.footerCurtain` en
        // Footer.module.css: el footer tiene que seguir por DEBAJO de
        // `<main>` en el stacking para que el telón funcione, así que no hay
        // forma de ponerlo por encima de esta capa fija sin romper eso) —
        // achica el rig a 0 en vez, mismo mecanismo que ya usa el viaje
        // completo (`rig.scale`), sin tocar material/opacidad (ver
        // FaceModel: los materiales son opacos a propósito).
        //
        // El trigger NO puede ser el propio `<footer>` (ver Footer.jsx,
        // `curtain`/`position: sticky; bottom: 0`): un elemento sticky
        // reporta su `getBoundingClientRect()` YA pegado al fondo del
        // viewport desde el primer frame (es cómo funciona `sticky`), así
        // que ScrollTrigger lo mide mal — con `trigger: footerEl` esta
        // animación arrancaba "completa" desde el scroll 0 y la cabeza no
        // se veía NUNCA, ni en el hero (se detectó en QA manual en Chrome).
        // `document.body` sí tiene una posición de documento real y estable:
        // el final del scroll es donde su borde de abajo llega al borde de
        // abajo del viewport, y el footer ocupa exactamente los últimos
        // `--footer-height` px de ese documento (ver Footer.jsx, se mide con
        // `ResizeObserver` al mismo nombre) — `bottom bottom-=footerHeight`
        // es el punto real en el que el footer empieza a "entrar", sin
        // depender de su propio rect ya pegado.
        const footerEl = document.querySelector("footer");
        const footerHeightPx = footerEl?.offsetHeight || 0;
        const footerHide = footerEl
          ? gsap.fromTo(
              values,
              { footerHide: 0 },
              {
                footerHide: 1,
                ease: "power1.in",
                immediateRender: false,
                onUpdate: () => {
                  // Reusa el mismo canal `scale` que ya interpola FaceModel
                  // (no un canal nuevo que el modo "rig" de FaceModel tendría
                  // que aprender a leer): multiplica el valor que le haya
                  // dejado `contactEntry` por `(1 - footerHide)`, así nunca
                  // pelea con ese otro tween — composición, no override.
                  values.scale = contactScale() * (1 - values.footerHide);
                  invalidate();
                },
                scrollTrigger: {
                  trigger: document.body,
                  // Arranca un poco ANTES de que el footer entre del todo y
                  // termina apenas se asoma un poco (25% de su alto): un
                  // achique rápido, no un fade largo que se note "colgado"
                  // a mitad de camino.
                  // El offset va del lado del TRIGGER (primer término), no
                  // del scroller: `bottom-=X bottom` es "cuando (el borde de
                  // abajo de `body` menos X) llega al borde de abajo del
                  // viewport" — restar del lado del scroller en cambio (el
                  // primer intento) daba un umbral MÁS ALLÁ del final real
                  // del documento, que nunca se alcanza (se detectó en QA
                  // manual: la cabeza nunca se achicaba ni en el scroll
                  // máximo).
                  start: `bottom-=${footerHeightPx} bottom`,
                  end: `bottom-=${footerHeightPx * 0.25} bottom`,
                  scrub: true,
                  refreshPriority: -2,
                },
              }
            )
          : null;

        return () => {
          heroExit.scrollTrigger?.kill();
          heroExit.kill();
          contactEntry.scrollTrigger?.kill();
          contactEntry.kill();
          footerHide?.scrollTrigger?.kill();
          footerHide?.kill();
        };
      }
    );

    return () => {
      mm.revert();
    };
  }, [heroRef, contactRef]);

  // Entrada de la cabeza: arranca "de perfil" (ENTRANCE_YAW) y gira hacia el
  // frente (HERO.yaw, 0) apenas termina la intro — o enseguida si la intro
  // no se mostró esta sesión (ver introState.js). `rig.spin` arranca en 0:
  // es la rotación EXTRA que suma la reacción de click/tap (ver
  // useHeadClickReaction), separada del yaw base para no pelear con el
  // tween de scroll de arriba — FaceModel (modo "rig") suma las dos.
  useEffect(() => {
    const values = rig.current;
    values.spin = 0;
    values.yaw = ENTRANCE_YAW;

    const play = () => {
      gsap.to(values, {
        yaw: HERO.yaw,
        duration: 1.3,
        ease: "power3.out",
        onUpdate: () => invalidate(),
      });
    };

    if (shouldShowIntro()) {
      window.addEventListener(INTRO_DONE_EVENT, play, { once: true });
      return () => window.removeEventListener(INTRO_DONE_EVENT, play);
    }

    play();
    return undefined;
  }, []);

  return rig;
}

// Reacción de click/tap sobre la cabeza (ver useHeadClickReaction): un giro
// de 360° con rebote elástico. Vive acá y no en el hook de click porque es
// el único lugar que conoce la forma de `rig.current` (y para no importar
// gsap/invalidate dos veces por separado).
export function triggerHeadReaction(rig) {
  const values = rig.current;
  if (!values || values.spinning) return;
  values.spinning = true;
  values.spin = 0;
  gsap.to(values, {
    spin: Math.PI * 2,
    duration: 1.1,
    ease: "elastic.out(1, 0.5)",
    onUpdate: () => invalidate(),
    onComplete: () => {
      // 2π ≡ 0 en rotación: resetear acá no produce ningún salto visual, y
      // deja `spin` en el mismo estado inicial para la próxima reacción.
      values.spin = 0;
      values.spinning = false;
    },
  });
}
