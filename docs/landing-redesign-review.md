# Revisión del rediseño de la landing

- **Rama:** `feat/landing-redesign` (cambios sin commitear al momento de la revisión)
- **Fecha:** 2026-10-31
- **Alcance:** `src/assets/components/landing/`, `src/assets/components/hero3d/`, `layout/Header.jsx`, `layout/Footer.jsx`, `src/Router/Router.jsx`, `src/shared/utils/deviceCapability.js`, `tailwind.config.cjs`, `style.css`, `index.html` y las claves nuevas de i18n.

---

## Estado (actualizado tras el rediseño del Footer)

**Rediseño del pie global (`layout/Footer.jsx`): hecho.** Migrado de Tailwind a CSS Modules (`Footer.module.css`), mismo lenguaje visual que el resto del rediseño (tokens de `landing/styles/tokens.css`, aunque el componente sigue siendo global y vive fuera de `landing/**`, igual que el Header). Fondo siempre oscuro (degradé plum-950 → casi negro), sin depender del tema claro/oscuro del sitio — es la última impresión, pensada para verse igual en las dos variantes del landing y en `/all-projects`/`/projects/:slug`.

- Grilla mono de cuatro celdas: (1) CTA + email gigante (un único `<a href="mailto:...">` que también copia al portapapeles con toast, en vez de un botón + un link separados), (2) navegación (Home/Experience/Projects/About/Contact, mismas etiquetas que el Header), (3) redes (GitHub/LinkedIn/Instagram, flecha en hover), (4) reloj en vivo de `America/Santo_Domingo` (re-sincronizado al minuto exacto, `tabular-nums`, sin layout shift) + punto de disponibilidad (`footer.availability`, en i18n para que se pueda cambiar sin tocar código).
- Wordmark gigante "JOSÉ MARTÍNEZ" en Milker, `clamp()` para edge-to-edge, con lift sutil por palabra en hover (gateado por `hover: hover` y `prefers-reduced-motion: no-preference`).
- Barra inferior: © año + `footer.rights`, crédito "Hecho con React · GSAP · Three.js" y botón "Volver arriba" (reusa `resetScrollPosition` de `lenisBridge`, mismo mecanismo que `ScrollToTop` en Router.jsx).
- **Bug real encontrado y corregido:** `react-hot-toast` tenía DOS `<Toaster />` montados (uno en `Hero.jsx`, otro en `NewLanding.jsx`), cada uno vivo solo en `"/"`. En `/all-projects` y `/projects/:slug` no había ningún `<Toaster />` en el árbol, así que un toast disparado desde el Footer (que se monta en todas las rutas) no tenía dónde pintarse. Se centralizó un único `<Toaster />` en `Router.jsx` y se sacaron los otros dos.
- **Navegación entre rutas del footer:** los links de nav son `<Link to="/#seccion">` reales. En la portada, el `onClick` intercepta con `preventDefault()` y usa `scrollToSection` (Lenis); en cualquier otra ruta se deja navegar a `/#seccion` y un `ScrollToTop` extendido en `Router.jsx` (ahora también lee `hash`) reintenta el scroll con `requestAnimationFrame` hasta que la sección exista en el DOM (el landing nuevo carga su chunk de forma perezosa). `contactSectionId` se calcula en `Router.jsx` igual que en `Header.jsx` (`"contact"` en el landing nuevo, `"about"` en el clásico) y se pasa como prop nueva al Footer.
- Curtain (telón del footer sobre la portada con el landing nuevo) sigue funcionando sin cambios: la altura se sigue midiendo con `ResizeObserver` hacia `--footer-height`, ahora sobre el contenido nuevo.
- A11y: `<footer>` semántico, `<nav aria-label>` traducido, `focus-visible` en todos los interactivos, contraste de los textos mono de la barra inferior y las etiquetas subido a `rgba(255,255,255,0.62)` (0.45/0.4 originales quedaban por debajo de 4.5:1 sobre el fondo casi negro, verificado a mano), punto de disponibilidad con `prefers-reduced-motion` respetado.

**Verificado:** `npm run build` pasa limpio con `dist/` y `node_modules/.vite` borrados antes. Chunk principal: **605.63 kB / 184.63 kB gz** (antes, mismo método de caché limpio, 600.49/183.10 — +5.14 kB / +1.53 kB gz, por el contenido nuevo del Footer + el `<Toaster/>` centralizado en el chunk principal; nada de three.js nuevo, `NewLanding` se mantiene lazy).

QA manual en Chrome (puerto 5183): `?landing=new` con curtain — footer gigante revelado al final del scroll, grilla de cuatro celdas legible, reloj corriendo (`12:35` → `12:41` entre pasadas), back-to-top funcional (confirmado, el click sintético del automatizador fallaba por coordenadas pero el click real sobre el botón funciona — probado disparando el evento directo y con un click posterior bien apuntado). `?landing=classic` — footer en flujo normal, CV/email/mapa del Hero clásico intactos arriba. `/all-projects` y `/projects/:slug` — footer en flujo, sin cabeza 3D encima, nav/redes/reloj legibles. Tema claro — el footer se mantiene oscuro a propósito (ver comentario de `.footer`), buen contraste en los dos temas. ES/EN — las claves nuevas de `footer.*` se ven bien en los dos idiomas, sin desbordes.

**Bug real encontrado y corregido en esta misma pasada de QA:** un `<Link to="/#contact">` del Footer navegando DESDE otra ruta (`/all-projects`) hacia el landing nuevo terminaba scrolleado a "Proyectos" en vez de a "Contacto" — el `id="contact"` ya existía en el DOM cuando corría el primer intento de `scrollToSection`, pero el layout del landing nuevo (cards sticky de Proyectos, fuentes, cabeza 3D) todavía se estaba asentando, así que el `offsetTop` real se corría después del scroll. Se corrigió reafirmando la posición varias veces mientras se asienta (300ms/900ms/1800ms) más un reintento final atado a `landing:intro-done` para el caso de un visitante nuevo con la intro todavía corriendo — ver `ScrollToTop` en `Router.jsx`.

**Sin verificar en esta sesión (rough edge, no bloqueante):** el toast de "email copiado" no se pudo confirmar visualmente en el navegador automatizado — `navigator.clipboard.writeText` se queda esperando sin resolver ni rechazar en ese contexto (CDP), algo que no pasa con un click real de una persona; el código es el mismo patrón ya en producción en `ContactSection.jsx`/`Hero.jsx` (clipboard API + fallback `execCommand`), sin cambios de lógica, así que el riesgo es bajo, pero queda pendiente confirmarlo a mano.

**Rough edge preexistente, no introducido por este cambio:** sobre `?landing=new` con el curtain revelado del todo, la cabeza 3D (fija, `z-index` por encima del contenido, pensada para quedar centrada sobre Contacto — ver "Cabeza viva" más arriba) queda flotando sobre parte de la columna de redes del Footer ("LinkedIn"/"Instagram" se ven parcialmente tapados). Ya pasaba con el Footer viejo en la misma posición de scroll (la cabeza no se oculta al entrar al área del footer); no se tocó `HeadLayer`/`useHeadRig` en esta pasada por ser una pieza central y riesgosa del sistema 3D, fuera del alcance de un rediseño de footer. Si se quiere resolver, la opción más simple sería ocultar/atenuar la cabeza cuando el footer cruza cierto umbral de scroll (mismo patrón que el header transparente/sólido, `IntersectionObserver` sobre el footer).

---

## Estado (actualizado tras los efectos "wow" de la primera pantalla)

Pase sobre `feat/landing-redesign` para que la portada impresione en los primeros segundos, sin romper nada de lo documentado más abajo (canvas `pointer-events:none`, cabeza tapada por Proyectos vía `isolation`, cards sticky, `overflow-x: clip`, `frameloop="demand"`, `gsap.context`, reduced-motion, `lenisBridge`, `useScrollRefresh`, gate de dispositivo débil). Todo respeta `prefers-reduced-motion` y el gate de capacidad existente; nada nuevo importa `three`/`drei` en el chunk de `NewLanding` (se mantiene lazy, ver `HeadLayer`).

1. **Intro con contador real (~2.5s, tope 3.5s):** `landing/intro/{IntroLoader,introState}.jsx|js`. Overlay cobalto plano con un contador 000→100 atado a progreso real — `fetch` + `ReadableStream` sobre el mismo `.glb` del header (sin tocar three.js desde acá, cachea en HTTP para que `GLTFLoader` no vuelva a bajarlo) más `document.fonts.ready`. Reveal con `clip-path: circle()` desde el centro; letras del nombre caen con `back.out` y la cabeza gira de perfil a frente (`useHeadRig`, `ENTRANCE_YAW`) al recibir `landing:intro-done`. Una vez por sesión (`sessionStorage`, con fallback si está bloqueado), saltable (click/tecla/scroll), scroll bloqueado con listeners directos (no depende del orden de montaje de Lenis) y liberado apenas arranca el reveal, no al desmontar. Refresca ScrollTrigger al terminar.
2. **Cabeza viva:** luz clave que seguí al puntero/gyro (`KeyLight` en `HeadScene.jsx`, `useFrame` propio con damp exponencial, sin tocar `FaceModel`). Reacción de click/tap con giro de 360° elástico (`useHeadRig.triggerHeadReaction` + `landing/head/useHeadClickReaction.js`, hit-test geométrico en espacio de pantalla sobre `rig.nx/ny/scale`, sin raycast — nunca bloquea clicks reales porque nunca llama `preventDefault`). Gyroscopio táctil (`hero3d/useDeviceTiltTarget.js`, pide permiso iOS en el primer tap, cae a idle sway si lo deniegan).
3. **Transición Hero→About:** `AboutSection.jsx`, `useDoorReveal` — `clip-path: circle()` scrubbed con el mismo trigger que `useHeadRig` (hero "top top"→"bottom top"), sin pin. Versión más liviana que un pin dedicado, documentada en el propio código.
4. **SplitText con máscara:** `landing/ui/useSplitReveal.js` (gsap `SplitText`, `mask:"lines"`, `autoSplit:true`) reemplaza el fade de opacidad en el manifiesto (línea por línea) y en los `<h2>` de Experiencia/Proyectos/Stack/Contacto.
5. **Mirada a proyecto en hover: NO implementado.** La cabeza está tapada por `isolation` durante toda la sección Proyectos (ver más abajo, "lo que ya está bien") — nunca es visible mientras se hace hover sobre una card, así que sesgar su yaw/pitch ahí no tendría efecto visible. Se evaluó aplicarlo en Experiencia/Contacto pero no hay tarjetas "hovereables" equivalentes en esas secciones; se dejó afuera a propósito en vez de simular el efecto en un lugar donde no tiene sentido narrativo.
6. **Cursor custom:** `landing/cursor/CustomCursor.{jsx,module.css}` — círculo `mix-blend-mode: difference`, `gsap.quickTo` (seguimiento directo si `prefers-reduced-motion`), crece sobre links/botones y muestra "VER →"/"VIEW →" sobre `[data-cursor="view"]` (cards de Proyectos). Solo con `hasHoverPointer()`; oculta el cursor nativo con una clase en `<body>` que se quita al desmontar.
7. **Grano + telón de color + footer curtain:** `landing/ui/GrainOverlay.jsx` (SVG `feTurbulence` animado por `steps()`, en Hero y Contacto). Telón de color plum→cobalto al entrar a Contacto (`useChapterWipe` en `ContactSection.jsx`, `clip-path: inset()` scrubbed). Footer "telón": `layout/Footer.jsx` (prop `curtain`, mide su alto real con `ResizeObserver` y lo escribe en `--footer-height`) + `NewLanding.module.css` (`margin-bottom`/`padding-bottom` negativos) — SOLO activo en `/` con el landing nuevo (`Router.jsx` pasa `curtain={pathname==="/" && landingVariant==="new"}`); en cualquier otra ruta el Footer sigue siendo un `<footer>` normal.

**Verificado:** `npm run build` pasa limpio. Chunks nuevos: principal 402.78 kB/129.42 kB gz (antes 402.36/129.28 — +0.14 gz, cambios menores en `Footer.jsx`); `NewLanding` 176.11 kB/65.47 kB gz (antes 161.71/60.35 — +~5 kB gz por SplitText + los componentes nuevos, three.js se mantiene fuera); CSS de `NewLanding` 18.50 kB/4.67 kB gz (antes 16.19/3.94). QA manual en Chrome (`?landing=new`, sessionStorage limpio): intro con contador visible y llegando a 100 sin trabarse, hero con cabeza de frente ya girada, scroll a About con el manifiesto revelado por máscara, cards de Proyectos (sticky) con `data-cursor="view"` confirmado por JS, sección Contacto con cabeza centrada, footer revelado al final del scroll (curtain funcionando), click sobre la cabeza con reacción visible (cambio de pose entre frames) y el cursor custom confirmado en el DOM (`[data-state]`, clase de `body` para ocultar el nativo). Sin errores de consola (solo warnings preexistentes de React Router y de deprecación de `THREE.Clock`, no relacionados).

**Rough edges conocidos:**
- El telón de color (punto 7) solo se implementó en la transición Stack→Contacto, la más dramática — no en cada borde de sección, por presupuesto de esta pasada.
- La transición Hero→About (punto 3) es una versión sin pin, más simple que "una transición pineada corta" — documentado en el propio `useDoorReveal`.
- El tope duro de la intro (3.5s) limita el CONTADOR, no el reveal completo: en el peor caso (red lentísima) el bloqueo real es ~3.5s + ~1.15s (el delay + la animación del reveal) — no se optimizó más por tiempo, pero en la práctica el fetch del `.glb` (ya cacheado por visitas previas, o liviano en banda ancha) hace que esto rara vez se note.
- No se armó un apagador global de pointer-events para el cursor custom sobre Header/Footer fuera de la portada — no aplica porque el componente solo se monta dentro de `NewLanding`, pero si el Header/Footer alguna vez se desacoplan de esa ruta habría que revisar.

---

## Estado (actualizado tras el rediseño de /all-projects y /projects/:slug)

**Rediseño de las páginas de proyectos al lenguaje visual nuevo: hecho.**
`ProjectsPage.jsx` y `ProjectDetail.jsx` (+ `ProjectGallery.jsx`, `Lightbox.jsx`, skeletons del detalle) pasaron de Tailwind a **CSS Modules**, reusando los tokens del landing (`landing/styles/tokens.css`, ahora importado UNA sola vez desde `main.jsx` para toda la app, en vez de duplicado por cada módulo — se probó duplicarlo por módulo primero y se revirtió al ver el CSS del chunk principal crecer de más). Deliberadamente LIVIANO: nada de three.js/gsap/lenis en estas rutas (una de ellas, `/all-projects`, la ve TODO visitante, incluida la variante clásica).

- **Card nueva (`cards/ProjectEditorialCard.jsx`):** separada de `cards/ProjectCard.jsx` (que sigue en Tailwind y la usa el Hero clásico, sin tocar) — mockup grande `object-contain`, título en Milker, chips mono de plataforma/tecnología, hover solo CSS (`translateY` + escala de la imagen).
- **Galería tipo Pinterest (`ProjectGallery.jsx`):** la distribución en columnas es JS, no `columns` de CSS — reparte cada imagen en la columna con menor altura ACUMULADA (estimada por `height/width`, no por cantidad de imágenes), para que mockups de celular (retrato) y de PC (paisaje) mezclados no dejen una columna mucho más larga que las otras. 1/2/3 columnas por breakpoint (`@uidotdev/usehooks`). Cada imagen reserva su hueco con `aspect-ratio` (viene de `project_images.width/height`, sin medir el DOM) — cero layout shift. 0/1/N imágenes maneja bien (gallery completa no renderiza si no hay imágenes).
- **Lightbox (`shared/ui/Lightbox.jsx`):** se mantuvo y se le sumaron: trap de foco real (Tab no se escapa del diálogo), swipe táctil (umbral 50px), precarga de las dos imágenes vecinas al navegar. Seguía teniendo `aria-modal`, scroll-lock y foco devuelto al cerrar.
- **View Transitions:** `shared/utils/viewTransition.js` centraliza el feature-detect (`document.startViewTransition` + `prefers-reduced-motion`) y expone `viewTransitionLinkProps()`. Mismo `view-transition-name` (`project-cover-<slug>`) en el mockup de la card de origen (landing `ProjectsSection.jsx` Y `ProjectEditorialCard.jsx`) y en la portada de `ProjectDetail.jsx`, para que el navegador los morphee. **Bug real encontrado y corregido en QA manual:** el prop del `<Link>` de react-router-dom 6.30.4 (la versión instalada) ya NO lleva el prefijo `unstable_` — se llama `viewTransition`, no `unstable_viewTransition`. Con el nombre viejo, React no lo reconoce como prop especial del router y lo cuela como atributo del `<a>` del DOM, con el warning de consola "React does not recognize the `%s` prop" (confirmado en Chrome). Corregido en `viewTransitionLinkProps()`.
- El `gsap` stacking tween y el cursor custom (`data-cursor="view"`) de las cards de `ProjectsSection.jsx` no se tocaron — el único cambio ahí fue agregar el prop de view transition al `Link` y el `view-transition-name` al mockup.
- Reglas `::view-transition-group/old/new` globales en `style.css` (tienen que vivir en CSS global, no en un Module: son pseudo-elementos del documento) como respaldo de `prefers-reduced-motion` además del feature-detect en JS.

**Verificado:** `npm run build` pasa limpio. Con caché de Vite limpio (`node_modules/.vite` + `dist` borrados) el chunk principal da **598.23 kB / 181.96 kB gz ANTES** de este cambio y **600.49 kB / 183.10 kB gz DESPUÉS** (+2.26 kB / +1.14 kB gz) — los ~402/129 kB que cita la revisión anterior salían de una caché de dependencias tibia, no son comparables 1:1; con caché limpio el número real ya incluía `@supabase/supabase-js` inlineado en el chunk principal desde ANTES de este cambio (se confirmó reproduciendo el mismo tamaño sobre el código previo al rediseño). Chunk de `ProjectDetail` (lazy): 7.72 kB / 3.06 kB gz (antes 7.40/2.84, +0.32/+0.22 — ahora con su propio CSS de 2.53 kB / 0.92 kB gz, antes disuelto en Tailwind global). QA manual en Chrome (`/all-projects` y `/projects/:slug`, puerto 5183): grilla 3 columnas en desktop, toggle de filtro web/mobile/empty state, claro/oscuro, hero editorial con año/stack/links, portada mockup, markdown, back-link — todo sin errores de consola salvo el bug de `viewTransition` ya corregido y los warnings preexistentes (React Router future flags, `THREE.Clock` deprecado). No había proyectos de prueba con `project_images` cargadas en la base local, así que el balance visual del masonry y el lightbox en vivo quedan sin verificar en navegador en esta pasada — sí se revisó el algoritmo de distribución y los estados 0/1/N imágenes por código.

**Rough edges conocidos:**
- `shared/ui/Markdown.jsx` no se tocó (fuera del alcance pedido) y tiene un bug preexistente: un code fence con varias líneas sueltas separadas por coma se renderiza como bloques `<code>` individuales de ancho completo en vez de una lista, porque su detección de `inline` en el renderer de `code` no distingue bien ese caso — se vio en QA manual sobre el contenido real de "Git Playground", no lo causó este cambio.
- No se verificó en navegador el balance del masonry con mezcla real de mockups retrato/paisaje ni la navegación por teclado del lightbox con una galería de varias imágenes (no había datos de prueba) — queda pendiente una pasada con proyectos que tengan `project_images` cargadas.
- El resize de ventana del QA automatizado no reprodujo el viewport mobile real (la herramienta de browser no lo tomó) — el grid 1/2/3 columnas se verificó por código/breakpoints, no visualmente en mobile.

## Estado (actualizado tras migración a CSS puro + header con vidrio líquido)

**Fase 5 (migración de Tailwind a CSS Modules + header "liquid glass"): hecha.**
- Todo `landing/**` (secciones, `ui/SectionLabel`, `head/HeadLayer`) y los componentes de `hero3d/` que solo usa el landing nuevo (`HeroNotes`, `HeroSparkles`, `HeroLeaves`, `HeaderFaceBadge`, `HeaderFaceScene`) pasaron de clases de Tailwind a **CSS Modules** (`Componente.module.css` al lado de cada `.jsx`). `landing/styles/tokens.css` centraliza las custom properties (colores copiados 1:1 de `tailwind.config.cjs`, fuentes, alto del header, z-layers 20/30/50, easings) y se importa una sola vez desde `NewLanding.jsx`. Breakpoints replicados como `@media (min-width: …)` literales (640/768/1024/1280, igual que sm/md/lg/xl de Tailwind). `dark:` pasó a `:global(.dark) .clase`. Custom properties dinámicas (`--card-step`, `--header-offset` en `ProjectsSection`, leídas desde JS para el `top` calculado de cada card sticky) se preservaron con el mismo nombre. `isolate` → `isolation: isolate` (sigue siendo lo que tapa la cabeza 3D detrás de Proyectos). Verificado con grep: cero clases de Tailwind restantes en `landing/**` ni en los archivos de `hero3d/` tocados.
- **No se tocó** la landing clásica (`Hero.jsx`), admin, páginas de proyectos ni `Footer.jsx` (sigue en Tailwind, comparte header/footer con ambos landings). `tailwind.config.cjs` se dejó intacto: todos sus tokens/keyframes (incluido `twinkle`, que ahora también vive como `@keyframes` plano en los CSS Modules del hero) siguen usándose en la landing clásica, admin y el kit de UI (`shared/ui/*`), confirmado por grep — no había nada seguro para borrar.
- **Header** (`layout/Header.jsx`) reescrito también en CSS Modules (`Header.module.css`), mismo comportamiento (grid 1fr/auto/1fr en escritorio, header transparente/sólido vía el mismo `IntersectionObserver`, menú móvil, toggle de tema, selector ES/EN, badge de la cabeza girando, CTA de contacto). Efecto de **vidrio líquido** con `@hashintel/refractive` (la misma librería que ya usaba `Hero.jsx`, mismo patrón: `refractive(motion.div)` declarado FUERA del componente). Diseño elegido: una barra flotante en pill (no el `<header>` entero) con el vidrio, más una única pill de vidrio compartida que se desliza detrás del item de nav en hover/focus (en vez de un filtro SVG por botón — más barato). El CTA de contacto lleva su propio hover (`scale` + sombra) sin filtro SVG permanente, a propósito, para no multiplicar instancias de filtro.
- **Fallback Safari/Firefox:** `shared/utils/browserSupport.js` (`supportsSvgBackdropFilter`) detecta el motor de render por user-agent — el filtro SVG de `backdrop-filter: url(#...)` que usa `refractive` es sintácticamente válido en cualquier navegador (así que `@supports` no distingue nada acá), pero solo Blink (Chrome/Edge/Opera/Brave de escritorio y Android) lo pinta de verdad; en WebKit (Safari, y CUALQUIER navegador en iOS) y Firefox se cae a clases CSS con `backdrop-filter: blur()` + borde translúcido (mismo lenguaje visual, menos "líquido"), con un `@supports not (backdrop-filter…)` adicional para navegadores sin soporte de blur alguno.
- **Verificado:** `npm run build` pasa limpio. Chunks: principal 402.36 kB / 129.28 kB gz (antes 402.12/128.73 — igual, three.js sigue fuera); `NewLanding` 161.71 kB / 60.35 kB gz (antes 163.66/60.54 — bajó un poco, menos CSS utilitario generado); CSS de `index` (Tailwind global) 46.89 kB / 9.51 kB gz (antes ~49/9.9 — bajó, como se esperaba al sacar Tailwind del landing/header); nuevo chunk de CSS `NewLanding-*.css` 16.19 kB / 3.94 kB gz (los CSS Modules del landing, antes vivían disueltos en el CSS global de Tailwind). No se corrió QA visual en navegador en esta pasada (sin herramienta de browser disponible en la sesión) — queda pendiente una pasada manual en `?landing=new`/`?landing=classic` antes de mergear.

## Estado (actualizado tras fases 3 y 4)

**Fase 1 (bloqueantes) y Fase 2 (rediseño de Proyectos): hechas.** Puntos 1, 2, 3, 6, 7, 8, 10 resueltos; Proyectos reescrito como cards apiladas con `position: sticky` (opción B) — sin pin, así que los puntos 4, 5 y 11 quedaron sin objeto. `lenisBridge` con `offset: -80`. Nuevo `landing/scroll/useScrollRefresh.js` (reemplaza `waitForStableLayout`). Nuevo `src/shared/ui/ErrorBoundary.jsx`. `presence`/`buildPresenceFade`/`waitForStableLayout` eliminados. Materiales de `FaceModel` opacos.

**Fase 3 (rendimiento y robustez): hecha.**
- Punto 14: `HeadScene` en `dpr={[1, 1.5]}` + `frameloop="demand"`, con `invalidate()` disparado desde el scroll (`onUpdate` de los tweens en `useHeadRig`), el puntero (`usePointerTarget`) y, mientras el damp no se asienta, desde el propio `useFrame` de `FaceModel` (ver `SETTLE_*_EPSILON`). `HeaderFaceScene` ahora también se pausa por `IntersectionObserver`, no solo por `visibilitychange`.
- Punto 15: `useDomParallax` corre sobre `gsap.ticker` (no un rAF propio) y se suspende con `IntersectionObserver` cuando el hero no está a la vista. El marquee de `StackSection` hace lo mismo. `will-change` de las letras del hero pasó de fijo a dinámico (`onToggle` del ScrollTrigger del tween de salida).
- Punto 9: `HeaderFaceBadge` reusa `resolveLandingVariant()` (el mismo gate que decide el landing completo) en vez de su propio chequeo de WebGL/reduced-motion — un equipo débil (o `?landing=classic`) ya no descarga three.js solo para el badge.
- Punto 12: `webgl.js` cachea el resultado, usa `failIfMajorPerformanceCaveat: true` y libera el contexto de prueba con `WEBGL_lose_context`. `deviceCapability.js` trata `navigator.connection?.saveData` como "classic".
- Punto 17: pesos JetBrains Mono 500/600 quitados de `index.html` (no se usaban en ningún lado). El preload de Milker ahora se inyecta por JS solo en `"/"` (ver su comentario en `index.html` — la limitación conocida es que no distingue variante de landing dentro de esa ruta, solo la ruta). `drei` se mantiene por ahora (riesgo de reemplazarlo documentado, no se tocó). La cabeza tiene entrada: crece desde escala 0 al montar (`ENTRANCE_SCALE` en `FaceModel`), respetando que el landing nuevo ya filtró `prefers-reduced-motion` en el gate.
- Puntos 18-20: header con `intersectionRatio >= 0.2`; `targetSpeed` del marquee decae hacia `BASE_SPEED` en cada tick; `useMagnetic` sigue con `gsap.to` simple pero sin `transition-transform` en el botón de contacto (confirmado, ya no competía con gsap).

**Fase 4 (a11y, SEO, limpieza): hecha.**
- A11y: `<h1>` del landing nuevo con `aria-label` y letras `aria-hidden`; `AboutSection` con `<h2 className="sr-only">`; contraste subido en labels chicos (`text-white/40-50` → `/60-70`, `text-plum-300` → `text-plum-200`); marquee con la primera copia legible y las otras `aria-hidden` (documentado como intencional); nav reparada — `AboutSection` pasó a `id="about"` (el "Sobre mí" real) y `ContactSection` a `id="contact"`, con el botón dedicado "Hablemos" del Header apuntando a uno u otro según la variante (`contactSectionId`); reduced-motion ahora se escucha en vivo (`onReducedMotionChange`) en el marquee y el parallax del hero, no solo al montar; Footer con `href` reales + `preventDefault` + `scrollToSection`, labels traducidos vía `languaje.header.*`.
- Código muerto borrado: `hero3d/FaceHeroSection.jsx`, `FaceScene.jsx`, `HeroName.jsx`, `HeroStackStrip.jsx` (nada los importaba) y los modos `pointer`/`idle`/`static` de `FaceModel` (solo esos archivos los usaban).
- Comentarios desactualizados corregidos: `useHeadRig` (ya no hace falta, los comentarios actuales ya reflejan el fix), `Header.jsx` ("wordmark serif"), `StackSection.jsx` ("dos copias" → "tres"), `style.css`, `HeroNotes.jsx` ("70vmin"), `Spanish.js`/`English.js` ("sección experimental").
- i18n: `landing.contact.kicker` y `landing.projects.scrollHint` eliminados (no se usaban, confirmado por grep). Nueva clave `footer.rights`.
- `useLenisScroll.js`: ya no mata todos los `ScrollTrigger` de la página al desmontar (cada hook mata los suyos) y restaura `gsap.ticker.lagSmoothing` a sus valores por defecto.
- Cleanups con `gsap.context`/`ctx.revert()` en `AboutSection` y `ExperienceSection` (antes dejaban `opacity`/`transform` inline al desmontar a mitad de scroll).
- Detalles menores: material tweaks movidos al `useMemo` del clon (sin flash del material metálico original); offset del marquee se reenvuelve proporcionalmente al cambiar el ancho de la copia (resize/idioma); parallax de imagen de proyecto gateado por `hasHoverPointer()` (ya no se evalúa `prefersReducedMotion()` en cada `mousemove`, y no queda "pegado" en touch); `ContactSection` ya no mostraba el toast en caso de fallo (confirmado, estaba bien); `usePointerTarget` muta el mismo objeto en vez de crear uno por evento.

**Verificado:** `npm run build` pasa limpio. Chunks: principal 402.12 kB / 128.73 kB gz (antes 401.5/128.5 — sin cambio relevante, three.js sigue fuera); `NewLanding` 163.66 kB / 60.54 kB gz (antes 162.8/60.2); el chunk de three (`FaceModel` + `events-e51d7528.esm`, antes un solo chunk "FaceModel" de 997.9/266.2) ahora 79.33+919.59 kB / 24.23+243.37 kB gz ≈ 999/267.6 — equivalente, sin regresión. QA manual en Chrome sobre `?landing=new`: entrada de la cabeza, viaje hero→esquina→contacto con `frameloop="demand"`, badge del header girando, cards de Proyectos tapando la cabeza, footer y botón "Contact" navegando a las secciones correctas (`about` → manifiesto real, `contact` → CTA), toast de "Email copiado", sin errores de consola. `?landing=classic`: `<h1>` presente, cero `<canvas>` en la página (badge del header cae a la foto estática, confirmado por JS), sin errores.

**Queda pendiente** (fuera del alcance de fases 3-4, documentado en el plan original):
- R1 (cabeza como función pura de scroll), R3 (un solo contexto WebGL o ninguno fuera de la landing — hoy sigue habiendo dos: landing + header), R4 (adoptar `@gsap/react`/`useGSAP` + `StrictMode`).
- Reemplazar `drei`/`useGLTF` por `GLTFLoader` + `setMeshoptDecoder` manual (riesgo alto, dejado afuera a propósito, ver punto 17).
- `NewLanding`/`Hero.jsx` siguen duplicando el bloque de SEO/JSON-LD — no se extrajo un helper compartido (quedó fuera por tiempo, es un cambio de bajo riesgo pendiente).
- Restaurar posición de scroll por `location.key` al volver atrás (ver "Detalles menores", no abordado).
- El preload de Milker en `index.html` se gatea solo por ruta (`"/"`), no por el resultado completo de `resolveLandingVariant()` — un visitante con hardware débil en `"/"` recibe el preload aunque termine viendo la landing clásica (que no usa Milker). Duplicar la heurística completa en un script inline se consideró más riesgo que beneficio.

---

**Cómo se hizo.** Se hicieron dos revisiones independientes que coincidieron en los bugs principales:

- un análisis de mejoras (animación, rendimiento, accesibilidad, arquitectura);
- una revisión de bugs a nivel máximo.

En ambas se leyó todo el código del alcance y se revisó el código fuente de las librerías instaladas en `node_modules`: gsap 3.15, @react-three/fiber 9.8.2 y Lenis 1.3. Después se compiló (`npm run build`) y se inspeccionaron los chunks. Dos hallazgos se reprodujeron en jsdom con el mismo gsap del repo. Los hallazgos P0 y P1 se volvieron a verificar a mano contra el código y el fuente de las librerías.

**Números de línea.** Corresponden al estado de la rama a esta fecha y pueden correrse cuando se edite.

**Leyendas.**

- Prioridad:
  - **P0:** rompe la experiencia o el deploy; va primero.
  - **P1:** importante.
  - **P2:** rendimiento, bugs menores de animación, accesibilidad y SEO.
  - **P3:** mantenibilidad y detalles.
- Confianza:
  - **Confirmado:** se verificó en el código, en el fuente de la librería o en el build.
  - **Probable:** el razonamiento es sólido, pero no se reprodujo en el navegador.
  - **Especulativo:** posible, sin pruebas.
- Esfuerzo:
  - **S:** menos de 1 h.
  - **M:** unas horas.
  - **L:** un día o más.

---

## Resumen en 30 segundos

1. **La pestaña se puede congelar.** El "esperar a que el layout se asiente" de `useHeadRig` entra en un bucle infinito con `ScrollTrigger.refresh()` (P0).
2. **El canvas de la cabeza bloquea los clics.** Los links del footer no funcionan en la landing nueva, y las cards de proyectos no responden mientras la galería está fijada (P0).
3. **La sección de proyectos está rota por varias causas:**
   - el contenido mide más que la pantalla y se recorta;
   - el cálculo del scroll lateral deja afuera el final de la última card;
   - la cabeza reaparece en medio por varios bugs de GSAP encadenados.
4. **Riesgo al publicar:** `public/models/` y `public/fonts/` no están en git, y la app no tiene ningún error boundary. Si el modelo da 404, **todo el sitio queda en blanco** (P0).
5. **El viaje de la cabeza depende del largo total de la página** y no de las secciones (P1).
6. **La landing clásica (el respaldo) se quedó sin `<h1>`** (P1).
7. **Rendimiento:**
   - la landing espera a three.js (102 kB gz) solo para convertir grados;
   - el canvas de pantalla completa se redibuja siempre;
   - el 3D del header se carga incluso en equipos débiles.

**Recomendación para Proyectos:** quitar el scroll horizontal fijo y pasar a **cards apiladas con `position: sticky`** (ver "Rediseño de Proyectos").

---

## P0 · Arreglar primero

### 1. Bucle infinito que congela la pestaña

- **Dónde:** `landing/head/useHeadRig.js:297-301` (el `MutationObserver` de `waitForStableLayout`; `ScrollTrigger.refresh()` en la L298).
- **Qué pasa:**
  - `ScrollTrigger.refresh()` sin argumentos llama a `_refreshAll(true)` (`node_modules/gsap/ScrollTrigger.js:2256-2257`). Ese método siempre ejecuta `_refresh100vh()`, que agrega y quita un `<div>` en `<body>` (L466-471). Además saca y vuelve a meter las secciones fijadas en su `.pin-spacer`.
  - El observer vigila justamente los cambios de nodos (`childList`) de `<body>`. Cada `refresh()` dispara el observer, que vuelve a llamar a `refresh()`.
  - Es un bucle de microtareas sin salida. Los timers de 250 ms y 5 s nunca llegan a ejecutarse y la pestaña se cuelga ("La página no responde").
- **Cuándo pasa:** el observer se crea en **cada** montaje de la landing nueva, porque Proyectos siempre tiene `data-head="hidden"`. Cualquier nodo que se agregue o quite durante los primeros ~250 ms dispara el bucle. Por ejemplo:
  - el `<canvas>` de la cabeza se monta con el chunk de three.js ya en caché;
  - las listas de Supabase se renderizan rápido (volviendo de un proyecto con la conexión ya abierta);
  - aparece un `toast.error` sin red.
  - Es una carrera de tiempos: en la primera carga en frío casi nunca pasa. Probablemente explica el congelamiento de Chrome que se vio durante las pruebas.
- **Arreglo:**
  - **Inmediato:** no llamar a `refresh()` dentro del observer, es decir `new MutationObserver(scheduleFinish)`.
  - **Correcto:** borrar `waitForStableLayout` por completo. Deja de hacer falta con los arreglos 3 y 7, y la estrategia de refresh pasa al punto 13.
- **Confianza:** el mecanismo está confirmado (fuente de gsap más una reproducción en jsdom con 200 reentradas). La frecuencia en uso real es probable.
- **Esfuerzo:** S

### 2. El canvas de la cabeza bloquea los clics

- **Dónde:** `landing/head/HeadScene.jsx:28` (el `<Canvas>`) dentro de `HeadLayer.jsx:28` (`pointer-events-none fixed inset-0 z-20`).
- **Qué pasa:**
  - En @react-three/fiber 9.8.2, el `<Canvas>` envuelve el canvas en un `<div>` con `pointerEvents: 'auto'` en línea cuando no se le pasa `eventSource` (`react-three-fiber.esm.js:159-168`).
  - Ese `auto` en el hijo le gana al `pointer-events-none` del contenedor. Resultado: un canvas invisible de pantalla completa en `z-20` se come los clics y el hover de todo lo que está pintado por debajo.
- **A quién afecta:**
  - **El footer** (estático, sin z-index, renderizado después de la landing): sus links de navegación y de redes **no funcionan** en la landing nueva.
  - **Las cards de proyectos mientras la galería está fijada:** al fijarla, gsap le pone `position: fixed` a la sección, que crea su propio contexto de apilamiento por debajo de `z-20`. Los links y el parallax de las imágenes dejan de responder justo mientras se recorren.
- **Arreglo:** `<Canvas style={{ pointerEvents: "none" }} …>`. El `style` se aplica después del valor por defecto. La cabeza no necesita eventos del canvas, porque el puntero se lee desde `window`.
- **Confianza:** confirmado (fuente de r3f).
- **Esfuerzo:** S

### 3. La cabeza aparece en medio de Proyectos

Son cuatro causas que se suman.

**3a. Orden de refresh de ScrollTrigger**

- **Dónde:** el timeline principal en `useHeadRig.js:119-127` (se crea al montar) y el pin en `ProjectsSection.jsx:35-45` (se crea después, cuando llegan los datos de Supabase).
- **Qué pasa:**
  - ScrollTrigger quita todos los spacers y refresca los triggers en orden de creación. Solo los reordena si alguno define `refreshPriority` (`_sort`, `ScrollTrigger.js:1037`, y `_sort && ScrollTrigger.sort()` dentro de `_refreshAll`).
  - Por eso el timeline mide `endTrigger: contactEl` **sin** el espacio del pin (~1100 px con 3 cards a 1440 px). El tramo de "volver al centro" termina antes de tiempo, con la galería todavía fijada.
  - El rango de velocidad del marquee (`StackSection.jsx:132-140`) se corre igual.
- **Confianza:** confirmado (fuente de gsap y simulación de scroll a 1440×900).

**3b. Tres tweens escriben `presence` a la vez**

- **Dónde:** `CORNER` (L26), `CORNER_MOBILE` (L39) y `CONTACT_CENTER` (L44) incluyen `presence: 1`, y se expanden dentro de los tweens del timeline (L133-134).
- **Qué pasa:** el timeline también anima `presence` y le gana a los fades de `data-head="hidden"`:
  - el tramo 2 registra `presence ≈ 0` al renderizarse por primera vez y después lo sube de 0 a 1 en todo su rango;
  - cuando el tramo 2 empieza después del fade, la cabeza se atenúa a ~0,3 camino al contacto.
- Esto contradice los comentarios de las L49-51 y L163-166.
- **Confianza:** confirmado.

**3c. El fade de entrada no hace nada**

- **Dónde:** `fadeIn` en `useHeadRig.js:222-228`.
- **Qué pasa:**
  - Al crearse, ScrollTrigger renderiza su animación en el tiempo 0, salvo que se le pase `immediateRender: false` (`ScrollTrigger.js:1069`).
  - `fadeIn` registra entonces `presence = 1` como valor inicial y anima de 1 a 1. No hay fade: la cabeza salta a opacidad completa cuando se suelta el pin, y el resultado cambia según la dirección del scroll.
- **Confianza:** confirmado.

**3d. Variante con Supabase lento**

- **Qué pasa:** si la ventana de 250 ms termina antes de que lleguen los proyectos, los fades se crean antes que el pin y se miden sin su distancia. La cabeza vuelve a verse durante casi toda la galería.
- **Confianza:** probable.

**Mientras la sección está fijada, la cabeza se dibuja encima**

- **Dónde:** la sección no tiene z-index (`ProjectsSection.jsx:136`) y la capa de la cabeza es `fixed z-20`.
- **Qué pasa:** el `position: fixed` del pin crea un contexto de apilamiento. El `z-30` de los hijos queda encerrado ahí adentro, y toda la sección queda debajo de la cabeza.
- **Confianza:** probable (reglas de CSS).

**Arreglo recomendado (con esto se eliminan 1, 3a, 3b, 3c y 3d):**

1. **Esconder la cabeza por apilamiento, no por opacidad.** Darle a la sección de Proyectos `relative z-30 isolate`. Su fondo opaco tapa la cabeza, y al entrar con scroll la cabeza "se mete debajo" de la sección, un efecto de profundidad que se ve bien.
   - Con eso sobran `data-head="hidden"`, `buildPresenceFade`, `waitForStableLayout` y el fade de opacidad del material.
   - En `FaceModel` se puede volver a materiales opacos.
   - Si en el futuro otra sección necesita tapar la cabeza, usa la misma convención: `relative z-30`.
2. **Sacar `presence` de las poses** `HERO`, `CORNER`, `CORNER_MOBILE` y `CONTACT_CENTER`.
3. **Anclar cada tramo del viaje a su sección** (punto 7), con `refreshPriority: -1` en el tramo del contacto.
4. Si se mantiene el pin, después de crearlo llamar a `ScrollTrigger.sort(); ScrollTrigger.refresh();`.

Si alguna vez hace falta un fade real (no apilamiento), usar un toggle que no dependa del orden de creación:

```js
ScrollTrigger.create({
  trigger: section,
  start: "top 75%",
  endTrigger: nextSection,
  end: "top 75%",
  refreshPriority: -1,
  onToggle: (self) =>
    gsap.to(values, { presence: self.isActive ? 0 : 1, duration: 0.35, overwrite: true }),
});
```

Para fades con scrub: `gsap.fromTo(values, { presence: 1 }, { presence: 0, immediateRender: false, … })`, y el fade inverso igual pero de 0 a 1.

- **Esfuerzo:** M

### 4. No se ve el último proyecto

- **Dónde:** `ProjectsSection.jsx:33`, en `getDistance = () => Math.max(track.scrollWidth - section.clientWidth, 0)`.
- **Qué pasa:**
  - El carril empieza dentro de un contenedor centrado (`mx-auto max-w-6xl`, L138, más `px-6/sm:px-10`, L136), pero la distancia se calcula contra el ancho de toda la sección.
  - Al final del pin, el borde derecho de la última card queda siempre corrido hacia afuera por el margen izquierdo del contenedor, y el `overflow-hidden` lo recorta.
- **Cuánto se pierde:**
  - 40 px entre 768 y 1279 px de ancho;
  - 64 px a 1280;
  - 144 px a 1440;
  - 384 px a 1920;
  - unos 700 px (media card) a 2560.
- **Bug relacionado** (`ProjectsSection.jsx:43`):
  - La traslación se escribe con `gsap.set` dentro de `onUpdate`, y `gsap.matchMedia` no registra esa escritura.
  - Ejemplo: un teléfono horizontal o una tablet de 768 px o más recorre la galería y después gira a vertical. El `translateX` viejo (hasta ~-1100 px) queda pegado en el carril, que en mobile es el scroll nativo, y las primeras cards quedan fuera de alcance.
- **Arreglo** (si se conserva la galería horizontal). Una tween creada **dentro** del contexto de `matchMedia`, que se revierte sola:

  ```js
  const getDistance = () => Math.max(track.scrollWidth - track.clientWidth, 0);

  gsap.to(track, {
    x: () => -getDistance(),
    ease: "none",
    scrollTrigger: {
      trigger: section,
      start: "top top",
      end: () => `+=${getDistance()}`,
      pin: true,
      scrub: true,
      invalidateOnRefresh: true,
    },
  });
  ```

  - Agregar un padding final para que la última card no quede pegada al borde.
  - Esto también elimina la lectura de layout en cada frame que hacía el `onUpdate`.
- **Confianza:** confirmado.
- **Esfuerzo:** S

### 5. Texto cortado en Proyectos

- **Dónde:** `ProjectsSection.jsx`:
  - L136: `overflow-hidden … md:h-screen md:py-0`;
  - L138: `md:justify-center`;
  - L169: `md:w-[64vw] lg:w-[58vw]`;
  - L93: `aspect-[16/10]`.
  - Además, el header fijo de `Header.jsx:170` (`h-16 sm:h-20`).
- **Qué pasa:**
  - El alto de la card crece con el **ancho** de la pantalla: la imagen mide ≈ 0,36 vw de alto, más ~280 px de contenido de la card y ~176 px del encabezado de la sección.
  - La sección mide exactamente una pantalla de alto y recorta el resto. Como el contenido está centrado, se corta arriba y abajo, y el header fijo tapa los primeros 80 px.

  | Pantalla | Contenido aprox. | Alto disponible |
  |---|---|---|
  | 1366×768 | ~925 px | 768 px |
  | 1440×900 | ~957 px | 900 px |
  | 1920×1080 | ~1130 px | 1080 px |

  - En la práctica: el label, el kicker y la parte de arriba de "PROYECTOS" quedan debajo del header; la lista de tecnologías y "VER PROYECTO →" se cortan abajo.
  - En iPad Safari, `h-screen` (100vh) también esconde la parte de abajo detrás de la barra del navegador.
- **Arreglo** (si se conserva el pin):
  - `md:h-[100svh] md:pt-20`;
  - cards dimensionadas por el alto: `md:w-[min(58vw,calc((100svh-22rem)*1.6))]`;
  - `[justify-content:safe_center]`.
- **Confianza:** probable. El cálculo sale de las clases; la métrica real de la fuente mueve los números exactos.
- **Esfuerzo:** S–M

### 6. Antes de publicar: assets sin commitear y sin error boundary

- **Dónde:**
  - `git status` muestra `public/models/` y `public/fonts/` sin seguimiento;
  - no hay ningún error boundary en `src/` (ni `componentDidCatch` ni `getDerivedStateFromError`);
  - el 3D se carga en `hero3d/HeaderFaceBadge.jsx:44` y en `HeadLayer`.
- **Qué pasa:**
  - El `<Canvas>` de r3f relanza en el componente padre los errores del renderer y de la escena, y `React.lazy` relanza los fallos de import.
  - Sin un boundary, cualquier fallo del 3D desmonta **toda la app** y deja la página en blanco. Eso incluye todas las rutas que muestran el header.
- **Cuándo pasa:**
  - se hace commit del código sin `public/models` (el `face.glb` da 404) o sin `public/fonts`;
  - un chunk con hash viejo después de un deploy a gh-pages (el `index` cacheado pide un archivo que ya no existe);
  - un GLB corrupto;
  - el `WebGLRenderer` falla aunque la prueba de `isWebglAvailable()` haya pasado.
- **Arreglo:**
  - Commitear `public/models/face.glb` y `public/fonts/Milker.woff2` junto con el código.
  - Envolver el 3D (badge del header y capa de la cabeza) en un error boundary que, si falla, muestre la foto estática o simplemente nada.
- **Confianza:** confirmado.
- **Esfuerzo:** S

---

## P1 · Importantes

### 7. El viaje de la cabeza es proporcional al largo de la página

- **Dónde:** `useHeadRig.js:129-134` (posiciones 0–1 / 1–3 / 3–4 repartidas entre el tope del hero y el centro del contacto) y `HeroSection.jsx:30-35, 54-59`.
- **Qué pasa:**
  - El tramo hero → esquina ocupa el primer 25% de toda la distancia (~1300–1600 px), pero las letras del hero salen en ~900 px. Cuando "Sobre mí" ya llena la pantalla, la cabeza todavía está grande y a media pantalla.
  - El tramo de vuelta empieza donde caiga el 75%, casi siempre dentro de Proyectos o del stack y no en Contacto.
  - Si cambia la cantidad de proyectos o experiencias, cambia el ritmo de todo el viaje.
- **Arreglo:** dos tweens anclados, cada uno a su sección:

  ```js
  gsap.fromTo(values, HERO_POSE, {
    ...CORNER_POSE,
    ease: "power2.inOut",
    immediateRender: false,
    scrollTrigger: { trigger: heroEl, start: "top top", end: "bottom top", scrub: true },
  });

  gsap.fromTo(values, CORNER_POSE, {
    ...CONTACT_POSE,
    ease: "power2.inOut",
    immediateRender: false,
    scrollTrigger: {
      trigger: contactEl,
      start: "top bottom",
      end: "center center",
      scrub: true,
      refreshPriority: -1,
    },
  });
  ```

  - Así la salida de la cabeza queda sincronizada con la de las letras.
  - La vuelta al centro ocurre de verdad al llegar al contacto.
- **Confianza:** confirmado.
- **Esfuerzo:** S

### 8. La landing clásica no tiene `<h1>`

- **Dónde:** `src/assets/components/Hero.jsx:206-212`, donde el `<h1>` se cambió a `<h2>`. La rama clásica se renderiza sola en `Router.jsx:101`.
- **Qué pasa:**
  - `HeroName`/`FaceHeroSection` ya no se montan en ningún lado. La landing de respaldo (equipos débiles, sin WebGL, con movimiento reducido o `?landing=classic`) se queda sin ningún `<h1>`.
  - Los buscadores también pueden recibir esa versión, porque su WebGL y sus núcleos varían.
- **Arreglo:** volver a poner el `<h1>` en `Hero.jsx`.
- **Confianza:** confirmado.
- **Esfuerzo:** S

### 9. La cabecita 3D del header ignora la decisión de equipo débil

- **Dónde:** `hero3d/HeaderFaceBadge.jsx:36`. Su condición es solo WebGL + sin movimiento reducido.
- **Qué pasa:**
  - En todas las rutas, incluida la landing clásica servida a equipos débiles **justamente para no cargar three.js**, descarga ~270 kB gz de three.js y el modelo de 410 kB.
  - Además mantiene un segundo contexto WebGL dibujando todo el tiempo para un badge de 48 px.
- **Arreglo:** usar la misma decisión de variante del Router (por ejemplo, pasar `variant === "new"`). Si no aplica, mostrar la foto. Mejor todavía, ver la refactorización R3.
- **Confianza:** confirmado.
- **Esfuerzo:** S

### 10. La landing espera a three.js solo para convertir grados

- **Dónde:** `useHeadRig.js:2` (`import * as THREE from "three"`), usado solo en L26 y L37 para `degToRad`.
- **Qué pasa:** según el build, el chunk `NewLanding` importa de forma estática `three.core` (102 kB gz). El loader de página completa no desaparece hasta descargar y procesar los dos.
- **Arreglo:** `const deg = (d) => (d * Math.PI) / 180;`, sin importar three.
- **Confianza:** confirmado (inspección de `dist/`).
- **Esfuerzo:** S

### 11. Teclado y navegación dentro de la galería fijada

Solo aplica si se mantiene el pin.

- **Dónde:** `ProjectsSection.jsx:136` (`overflow-hidden`) y `landing/scroll/lenisBridge.js:40` (`offset: 0`).
- **Qué pasa:**
  - **Navegar a Proyectos desde más abajo** (el link del footer siempre, o el del header si ya pasaste la galería) cae al **final** de la galería, con solo la última card visible:
    - Lenis calcula el destino con el `getBoundingClientRect()` de la sección;
    - después del pin, la sección queda desplazada por toda su distancia.
  - **Al tabular** a una card fuera de pantalla, el navegador desplaza de lado la sección con `overflow-hidden`. Ese desplazamiento se suma a la traslación de gsap y no avanza el pin.
  - `offset: 0` deja el tope de cada sección debajo del header fijo.
- **Arreglo:**
  - navegar al `start` del trigger del pin y no al elemento;
  - usar `overflow-x: clip` en vez de `hidden`;
  - al hacer foco en una card, llevar Lenis a la posición equivalente del pin;
  - pasar `offset: -alturaDelHeader`.
- **Confianza:** confirmado (el mecanismo de Lenis desde abajo). El resto es probable.
- **Esfuerzo:** M

### 12. Gate de capacidad: falsos positivos y contextos WebGL que no se liberan

- **Dónde:** `hero3d/webgl.js:8-18` y `src/shared/utils/deviceCapability.js:31-43`.
- **Qué pasa:**
  - Cada llamada a `isWebglAvailable()` crea un contexto WebGL nuevo y nunca lo libera. En la ruta nueva se llama tres veces (Router en cada arranque, HeadLayer, badge), lo que cuesta tiempo en el primer pintado y suma contra el límite de contextos del navegador.
  - El WebGL por software (SwiftShader, llvmpipe, GPUs bloqueadas) pasa el filtro.
  - `navigator.connection.saveData` (modo ahorro de datos) se ignora.
  - Que `deviceMemory` no exista en Safari y Firefox y cuente como "capaz" era la intención y está bien.
- **Arreglo:**

  ```js
  let cached;
  export function isWebglAvailable() {
    if (cached !== undefined) return cached;
    try {
      const canvas = document.createElement("canvas");
      const options = { failIfMajorPerformanceCaveat: true };
      const gl = canvas.getContext("webgl2", options) || canvas.getContext("webgl", options);
      cached = !!gl;
      gl?.getExtension("WEBGL_lose_context")?.loseContext();
    } catch {
      cached = false;
    }
    return cached;
  }
  ```

  Además, tratar `saveData` como "classic".
- **Confianza:** la fuga de contextos está confirmada; el falso positivo por software es probable.
- **Esfuerzo:** S

### 13. Los triggers quedan desactualizados con contenido que llega tarde

- **Dónde:**
  - `ExperienceSection.jsx:22`: la lista llega async;
  - ningún efecto vuelve a hacer refresh cuando cambia `languaje` (`NewLanding.jsx` y las secciones).
- **Qué pasa:**
  - Los triggers que no son pin no piden un refresh completo al crearse; solo los pines lo hacen. Y ScrollTrigger no vigila el alto de la página: solo refresca con `visibilitychange`, `DOMContentLoaded`, `load` y `resize`.
  - Si las experiencias llegan **después** que los proyectos (las dos consultas compiten), la sección crece ~1000 px y todo lo de abajo queda con números viejos. El pin de Proyectos arranca ~1000 px antes de tiempo y la sección "salta" arriba con Experiencia todavía en pantalla.
  - Lo mismo pasa al cambiar de idioma: los textos en español e inglés miden distinto.
- **Arreglo:** una sola estrategia de refresh que reemplace a `waitForStableLayout`:
  - `ResizeObserver` sobre `<main>` → `ScrollTrigger.refresh()` con debounce;
  - más `document.fonts.ready`;
  - más el cambio de idioma.
- **Confianza:** probable (depende del orden en que respondan las consultas).
- **Esfuerzo:** S

---

## P2 · Rendimiento

### 14. El canvas de la cabeza se redibuja siempre a pantalla completa

- **Dónde:** `landing/head/HeadScene.jsx:30-31` (`dpr={[1, 2]}`, `frameloop="always"`).
- **Qué pasa:**
  - Redibuja un canvas del tamaño de la pantalla en cada frame, a 60–120 Hz. En una pantalla 2x son ~5 megapíxeles por frame.
  - Lo hace incluso con la cabeza oculta o quieta en la esquina.
- **Arreglo:**
  - `dpr={[1, 1.5]}` más `PerformanceMonitor` de drei;
  - `frameloop="demand"` con `invalidate()` desde scroll y puntero, y mientras el damping no se haya asentado;
  - como mínimo, no dibujar mientras está oculta.
  - Si se mantiene algún fade, hacerlo con la `opacity` de CSS de la capa: es más barato, evita ver el interior de la malla durante el fade y hace innecesarios los clones de material.
- **Confianza:** la configuración está confirmada; el impacto es probable.
- **Esfuerzo:** M

### 15. Bucles de animación corriendo fuera de pantalla

- **Dónde:**
  - `hero3d/useDomParallax.js:32-45`: su propio rAF, nunca se detiene;
  - `StackSection.jsx:144-175`: el marquee corre siempre, y en la L54 hay un `will-change` permanente;
  - `HeroSection.jsx:24`: `will-change` en cada letra.
- **Arreglo:**
  - mover `useDomParallax` a `gsap.ticker` con `gsap.quickTo` y saltarlo cuando el hero no está a la vista;
  - pausar el marquee cuando su ScrollTrigger no está activo;
  - quitar `will-change` al terminar cada animación.
- **Confianza:** confirmado.
- **Esfuerzo:** S–M

### 16. Dos contextos WebGL

- **Qué pasa:** la landing y el header suben cada uno su propia copia de las texturas del modelo a la GPU. El comentario de `FaceModel.jsx:73-74`, que dice "sin memoria extra", no es cierto entre dos contextos.
- **Arreglo:** ver R3: un turntable pre-renderizado para el header, o un solo canvas con `<View>` de drei.
- **Confianza:** confirmado.
- **Esfuerzo:** M–L

### 17. Bundle y carga

- **Tamaños actuales:**
  - chunk principal: 128 kB gz, sin three, gsap ni lenis (framer-motion ya estaba);
  - `FaceModel`: 167,6 kB gz, más `three.core` 102 kB gz;
  - `NewLanding`: 60,6 kB gz.
- **drei:** solo se usa para `Center` y `useGLTF`, pero arrastra `DRACOLoader` y `KTX2Loader`, que el modelo no necesita. El modelo ya está optimizado: Meshopt, WebP, cuantizado, ~40k triángulos.
  - Alternativa: `GLTFLoader` de three con `setMeshoptDecoder` vía `useLoader`, y centrado manual con `Box3`.
- **Fuentes:**
  - Milker se precarga en **todas** las rutas (`index.html:109-115`), aunque solo la usa la landing nueva;
  - se piden los pesos 500 y 600 de JetBrains Mono que no se usan (`index.html:101`).
- **Carga de la cabeza:** no tiene estado de carga (`Suspense fallback={null}`). Aparece de golpe a escala 1 y después se achica a 0,8 (`FaceModel.jsx:139-142`).
- **Confianza:** confirmado.
- **Esfuerzo:** M

---

## P2 · Bugs menores de animación

### 18. El header sigue transparente hasta que el hero sale del todo

- **Dónde:** `layout/Header.jsx:100-104`, donde `setTransparent(entry.isIntersecting)` con `threshold: 0.2`.
- **Qué pasa:** al cruzar el 20%, `isIntersecting` sigue en `true`, así que el umbral no hace nada. El header cambia recién cuando sale el último píxel del hero, y durante los últimos ~64–80 px el menú blanco queda sobre la sección clara "Sobre mí", sin fondo.
- **Arreglo:** `entry.intersectionRatio >= 0.2`, o un `rootMargin` superior negativo igual a la altura del header.
- **Confianza:** confirmado.
- **Esfuerzo:** S

### 19. El marquee del stack se puede quedar acelerado

- **Dónde:** `StackSection.jsx:136`. `targetSpeed` solo se actualiza en `onUpdate`.
- **Qué pasa:** `onUpdate` solo se dispara mientras cambia el progreso del trigger. Si el scroll se detiene en seco (arrastrando la barra o saltando con el teclado), o si sales del rango rápido, `targetSpeed` queda cerca de 260 px/s. El marquee sigue corriendo ~4x más rápido, también al volver.
- **Arreglo:** en el `tick`, hacer decaer `targetSpeed` hacia `BASE_SPEED` en cada frame.
- **Confianza:** probable.
- **Esfuerzo:** S

### 20. El botón magnético tiembla

- **Dónde:** `landing/ui/useMagnetic.js:23` y el botón en `ContactSection.jsx:90`.
- **Qué pasa:**
  - cada `mousemove` crea un `gsap.to` nuevo sin `overwrite`, y se acumulan tweens superpuestos;
  - el tween elástico de salida sigue vivo si vuelves a entrar antes de 0,5 s;
  - además, el `transition-transform` de Tailwind del botón vuelve a animar cada transform que escribe gsap.
- **Arreglo:** `gsap.quickTo` (o `overwrite: "auto"`), y quitar `transition-transform` del botón.
- **Confianza:** confirmado.
- **Esfuerzo:** S

---

## P2 · Accesibilidad y SEO

1. **El `<h1>` partido letra por letra** (`HeroSection.jsx:119-122`) puede leerse letra por letra. Ponerle `aria-label="José Martínez"` y `aria-hidden` a los `<span>` de cada letra. Confirmado.
2. **La sección de introducción no tiene `<h2>`** (`AboutSection.jsx:96-112`). Confirmado.
3. **Contraste bajo en textos chicos.** Probable.
   - kicker `text-plum-300` sobre plum-800: ≈ 4,3:1;
   - micro-labels con `text-white/40–50` (lista de tecnologías, pista de scroll, "Copiar email" en `ContactSection.jsx:96`): ≈ 3,3–3,6:1.
4. **La primera copia del marquee no está en `aria-hidden`** (`StackSection.jsx:58`), así que el lector lee la lista. Es una decisión válida, pero conviene que sea intencional.
5. **La navegación confunde.** Confirmado.
   - `id="about"` está en Contacto (`ContactSection.jsx:67`), así que "Acerca de" salta a "¿HABLAMOS?";
   - la introducción real (`#intro`, `AboutSection.jsx:80`) no es accesible desde el menú.
6. **El movimiento reducido solo se revisa al montar** (`motionPreferences.js:1-7`, `useLenisScroll.js:27`), y el balanceo idle de la cabeza lo ignora (`FaceModel.jsx:154-158`). Usar `gsap.matchMedia` con `(prefers-reduced-motion: no-preference)`. Probable.
7. **Footer:** los `<a onClick>` no tienen `href`, así que no se alcanzan con teclado, y sus textos no están traducidos (`Footer.jsx:26-43`). Además hoy no reciben clics en la landing nueva (punto 2). Confirmado.

**Esfuerzo:** M en total.

---

## P3 · Mantenibilidad

- **Código muerto** (confirmado):
  - nadie importa `hero3d/FaceHeroSection.jsx`; `FaceScene.jsx`, `HeroName.jsx` y `HeroStackStrip.jsx` solo los usaba esa sección;
  - en `FaceModel.jsx:189-205` sobran los modos `pointer`, `idle` y `static`.
- **Duplicación:**
  - `NAME_SIZE_CLASS` está en `HeroSection.jsx:14` y en `HeroName.jsx:24`;
  - `NewLanding.jsx` repite el bloque de SEO y datos estructurados del Hero clásico.
- **Estructura:**
  - `FaceModel` concentra cinco modos en un solo componente;
  - las poses de la cabeza, las capas de z-index, la altura del header y los breakpoints son números mágicos repartidos; el rig usa 639/640 px y la galería 768 px;
  - acoplamiento por atributos e ids del DOM (`data-head`, `data-transparent-header`, `id="about"`).
- **Limpieza global desde un hook hoja:**
  - `useLenisScroll.js:55` mata **todos** los ScrollTriggers al desmontar;
  - `useLenisScroll.js:48` pone `gsap.ticker.lagSmoothing(0)` global y nunca lo restaura.
- **Cleanups incompletos:** algunos solo matan el trigger y dejan estilos inline (`AboutSection.jsx:57`, `ExperienceSection.jsx:69`).
- **Comentarios desactualizados o incorrectos:**
  - `useHeadRig.js:182-185, 256-258`: "el refresh no recalcula". En realidad el problema es el orden de refresh.
  - `useHeadRig.js:49-51, 163-166`: "no hay pelea". Sí la hay (3b).
  - `Header.jsx:29`: "wordmark serif".
  - `StackSection.jsx:93-96`: "dos copias", pero son tres.
  - `style.css:23-29`.
  - `HeroNotes.jsx:9-10`: "70vmin".
  - `Spanish.js`/`English.js:20-22`: "sección experimental".
- **i18n:**
  - `landing.contact.kicker` no se usa (`Spanish.js:124`, `English.js:123`);
  - `Spanish.js:126` dice "Escribime…" (voseo rioplatense); en español neutro, "Escríbeme y vemos qué construimos."

**Esfuerzo:** S–M.

---

## P3 · Detalles menores

- **Material:** los ajustes se aplican en un `useEffect` (`FaceModel.jsx:93-105`), así que los primeros frames salen con el material metálico oscuro original. Hacerlo dentro del `useMemo` que clona.
- **Marquee:** el offset no se reajusta al rango cuando cambia el breakpoint (`StackSection.jsx:107-119`), y puede quedar un hueco breve.
- **Parallax de imagen en proyectos:**
  - en touch queda "pegado" después de un tap (`ProjectsSection.jsx:72-86`); limitarlo con `hasHoverPointer`;
  - además llama a `matchMedia` y `getBoundingClientRect` en cada movimiento.
- **Contacto:** muestra "Email copiado" aunque falle el método alternativo de copia.
- **iOS:** el canvas fijo de pantalla completa cambia de tamaño cuando la barra del navegador aparece o desaparece. Usar una capa de `100lvh`. Probable.
- **Volver atrás siempre te lleva al tope** (`main.jsx:15-17` + `Router.jsx:53-61`). Restaurar la posición por `location.key` cuando el layout esté listo.
- **`usePointerTarget`:** crea un objeto nuevo en cada evento de puntero.
- **`main.jsx` no usa `<StrictMode>`.** Hoy no hay efectos duplicados, pero si se activa, varios efectos de gsap y Lenis se duplicarían (ver R4).

---

## Rediseño de Proyectos

| | Opción A: arreglar el pin horizontal | **Opción B: cards apiladas (sticky)** ✅ | Opción C: lista editorial con hover |
|---|---|---|---|
| Cómo | Arreglos 2–5 y 11 sobre el diseño actual | Cada card con `position: sticky; top: calc(80px + i * 1.25rem)`. Al taparla la siguiente, la anterior se achica a ~0.94 y se oscurece (un tween con scrub por card) | Nombres de proyecto gigantes en Milker como filas (número, plataformas, año). En escritorio el mockup sigue al cursor; en touch, miniatura en la fila |
| Pros | Conserva la idea actual | Sin pin, sin spacer, sin cálculo de distancias. No le afecta el orden de refresh ni los datos async. Foco, anclas y navegación nativos. La misma estructura sirve en celular. Los mockups 16:10 se ven grandes | La más robusta y accesible (una lista de links), la más liviana, escala a cualquier cantidad de proyectos y queda muy en línea con la marca |
| Contras | Sigue siendo el patrón más frágil de la página (pin + datos async + Lenis + gsap moviendo el DOM). El foco, el padding final, la navegación desde abajo y los tamaños por breakpoint siguen costando | La página crece con cada proyecto (bien para 3–6). Hay que cambiar `overflow-hidden` por `overflow-x: clip` en `<main>` (`NewLanding.jsx:86`) y en la sección, o `sticky` no funciona | Los mockups pierden protagonismo y touch necesita su propio diseño |

**Recomendación:** **B** para mostrar 3–6 proyectos visuales. Si se busca robustez máxima o un aire más editorial, **C**. Las dos quitan el pin, y con eso desaparecen los puntos 4, 5 y 11, casi toda la complejidad de esconder la cabeza y el riesgo de congelamiento.

En cualquier opción, la sección lleva `relative z-30 isolate` para que la cabeza pase por debajo.

---

## Ideas de pulido de animación

- **Entrada de la cabeza:** que crezca desde escala 0 con un pequeño giro cuando termine de cargar el modelo, en vez de aparecer de golpe.
- **Easing** `power2.inOut` en los viajes de la cabeza. Un poco de suavizado de scrub es opcional, porque Lenis ya suaviza.
- **Al llegar a Contacto:** inclinar la cabeza levemente hacia el botón de email y devolverle el seguimiento completo del puntero.
- **Manifiesto:** revelar las líneas con máscara (`y: 100% → 0` dentro de un clip), en vez del fade desde 0,12 de opacidad.
- **Marquee:** un `skew` leve según la velocidad del scroll.
- **Cambios de color entre secciones:** transiciones con `clip-path` o tipo telón.
- **Cabecita del header:** que reaccione al hover, por ejemplo acelerando el giro o mirando al cursor.

---

## Refactorizaciones grandes

- **R1. Una sola fuente de verdad para la cabeza:** su pose como función pura de la posición de scroll. Las posiciones de las secciones se miden en el evento `refresh` de ScrollTrigger y se leen en `useFrame`; se oculta por apilamiento. Elimina las peleas entre tweens, la dependencia del orden de creación y los casos raros al saltar rápido con el menú.
- **R2. Rediseño de Proyectos** (opción B o C).
- **R3. Un solo contexto WebGL, o ninguno fuera de la landing:** el badge del header como video o sprite pre-renderizado (WebM/HEVC con alfa o WebP animado), o `<View>` de drei sobre un solo canvas. Fuera de la landing, nada de three.js.
- **R4. Adoptar `@gsap/react` (`useGSAP`):** contextos con revert automático, más `gsap.matchMedia` con condiciones de movimiento reducido en todos lados. Con eso se puede quitar el `kill` global de `useLenisScroll` y queda listo para `StrictMode`.
- **R5. Centralizar la configuración:** poses, capas z, altura del header y breakpoints en un solo módulo. Dividir `FaceModel` en un cargador del modelo más un controlador por uso (rig y spin).
- **R6. Una sola estrategia de refresh:** `ResizeObserver` en `<main>`, fuentes listas y cambio de idioma. Más restauración de scroll y deep links por hash.

---

## Plan sugerido

1. **Fase 1, bloqueantes** (medio día):
   - punto 1: borrar `waitForStableLayout`;
   - punto 2: `pointerEvents: "none"` en el `<Canvas>`;
   - punto 3: `z-30` en Proyectos y sacar `presence`;
   - punto 7: tramos anclados;
   - punto 6: error boundary y commitear los assets;
   - puntos 10 y 8: `degToRad` sin three y restaurar el `<h1>`.
2. **Fase 2, Proyectos** (1 día): rediseño con la opción B, o C. Con eso se cierran los puntos 4, 5 y 11.
3. **Fase 3, rendimiento y robustez** (1 día):
   - puntos 14 y 15: canvas y bucles;
   - puntos 9 y 12: badge del header y gate;
   - punto 13: estrategia de refresh;
   - puntos 18–20: bugs menores de animación.
4. **Fase 4, accesibilidad y limpieza** (medio día): la lista de accesibilidad, código muerto, comentarios, i18n y navegación.
5. **Después:** R1, R3 y R4 cuando el diseño esté estable.

---

## Lo que ya está bien (no tocar)

- **Signo del giro en la esquina:** correcto. Un yaw negativo mira hacia la página.
- **Opacidad compartida entre la cabeza del landing y la del header:** resuelto con clones de material por instancia. Si el fade pasa a CSS o a apilamiento, esos clones se pueden quitar.
- **Marquee:** el wrapper de recorte fijo, la pista `w-max`, las tres copias y `deltaTime` en milisegundos son correctos. Lo pendiente está en los puntos 15 y 19 y en "Detalles menores".
- **`lenisBridge`:** sólido para navegar hacia abajo. Lo pendiente está en el punto 11.
- **`MutationObserver` del Header para el hero lazy:** sólido. Es barato, no llama a `refresh()` y se desconecta al encontrar el nodo.
- **`duration: 1.1` de Lenis:** sí tiene efecto (Lenis pone un easing por defecto), así que no es un bug.

---

## Cómo reproducir los bugs principales

- **Congelamiento (punto 1):**
  1. Abre la portada nueva (`?landing=new`) y espera a que cargue todo.
  2. Entra a un proyecto y vuelve con el botón Atrás.
  3. Repite varias veces. Si algo se monta en menos de ~250 ms, la pestaña se congela.
  - Variante: con la red desconectada (DevTools → Offline), recarga la portada; el `toast.error` dispara el bucle.
- **Clics bloqueados (punto 2):**
  - en la landing nueva, baja hasta el footer y haz clic en cualquier link: no pasa nada;
  - en escritorio, con la galería de proyectos fijada, haz clic en una card: no navega.
- **Cabeza en medio de Proyectos (punto 3):** en escritorio, baja despacio hasta Proyectos y sigue a través de la galería. La cabeza empieza a aparecer y crecer hacia el centro durante el pin, y al salir hacia el stack está grande y centrada.
- **Último proyecto (punto 4):** a 1440 px o más de ancho, recorre la galería hasta el final. La última card queda cortada a la derecha.
- **Texto cortado (punto 5):** en una laptop de 1366×768 o 1440×900, mira el título "PROYECTOS" (debajo del header) y la parte de abajo de las cards ("VER PROYECTO →").

---

## Estado (actualizado tras el fix del nav del Header, el nuevo loader de entrada, la cabeza sobre el Footer y el link a "todos los proyectos")

**Bug real encontrado y corregido — el nav del Header no llevaba a las secciones:** la causa raíz NO era un overlay tapando los clics (cursor custom, pill de vidrio, `IntroLoader`, etc. — todo eso se revisó y funciona bien) sino que `Header.jsx` (`handleScroll`) llamaba `scrollToSection(id)` directo SIEMPRE, sin importar la ruta actual. En "/" eso funciona (Lenis montado, o `getElementById` encuentra la sección), pero en cualquier otra ruta (`/all-projects`, `/projects/:slug`) no hay ningún id de sección en el DOM — el click no hacía nada, ni scrolleaba ni navegaba, confirmado reproduciendo en Chrome (`document.elementFromPoint` sobre cada botón del nav devolvía el botón correcto, descartando overlays). El Footer ya tenía el patrón correcto (`<Link to="/#id">` + `ScrollToTop` con reintentos en Router.jsx) — el Header ahora usa el mismo: todos los items de nav (desktop, menú móvil, CTA de contacto, logo/home) son `<Link>` reales con `onClick` que intercepta solo en "/" (`isHome`). Verificado a mano: click en "Experiencia" desde `/all-projects` navega a `/#experience` y scrollea a la posición correcta (80px de offset por el header fijo).
- Archivos: `src/assets/components/layout/Header.jsx`, `src/assets/components/layout/Header.module.css` (varios `display` explícitos porque `<Link>` es `inline` por defecto y antes eran `<button>`).

**Nuevo loader de entrada para "/" con el landing nuevo:** antes el `Suspense` de `NewLanding` mostraba el monograma "JM" genérico mientras bajaba el chunk (que incluye a `IntroLoader`, cobalto + contador) — dos pantallas de carga distintas, una atrás de la otra, para la misma espera. Ahora el fallback es `landing/intro/IntroFallback.jsx`: mismo fondo cobalto, mismo layout, mismo contador gigante en Milker que el primer frame real de `IntroLoader`, para que la transición sea invisible. El contador "cuenta" con CSS puro (`@property` + `@counter-style`, sin gsap ni progreso real — nada de eso puede colarse en el chunk principal) y se apaga solo (`withCounter=false`, ver `shouldShowIntro`) cuando la intro no va a mostrarse esta sesión, para no animar algo que después desaparece de golpe. Verificado: `CSS.supports` y una prueba inyectada confirman que `@property` anima el entero correctamente en Chrome; en navegadores sin soporte el contador queda fijo en "000" (mismo fondo/layout, sin rotura visible).
- El loader genérico (`FullPageLoader`, admin/login/verificación de sesión) se migró de Tailwind a CSS Modules (`shared/ui/Loader.module.css`) — mismo monograma "JM" con el trazo y el riel animados. Las keyframes `trace-glyph`/`slide-track` se borraron de `tailwind.config.cjs` (solo las usaba este componente).
- Archivos: `src/assets/components/landing/intro/IntroFallback.jsx` + `.module.css` (nuevos), `src/shared/ui/Loader.jsx` + `Loader.module.css`, `src/Router/Router.jsx`, `tailwind.config.cjs`.

**Bug real encontrado y corregido — la cabeza 3D flotaba sobre el Footer:** el primer intento fue subir el `z-index` del Footer por encima de la cabeza (mismo patrón que usa `ProjectsSection`), pero eso reveló un problema más profundo: el Footer (`position: sticky; bottom: 0`) está "pegado" al fondo del viewport durante TODO el scroll, no solo al final — lo que hace que solo se vea al final es que `<main>` (con `z-index` más alto) lo tapa hasta que su contenido se termina. Subir el Footer por encima de `<main>` rompía ese mecanismo: se veía sticky desde el principio del scroll, tapando contenido real. Se revirtió ese z-index y se resolvió del otro lado, en `useHeadRig.js`: un tercer tween de scroll (`refreshPriority: -2`) achica `rig.scale` a 0 justo antes de que el Footer entre en pantalla, usando `document.body` como trigger (no el propio `<footer>` — un trigger `position: sticky` reporta su posición ya pegada al fondo desde el primer frame, así que ScrollTrigger lo medía mal y la cabeza no se veía NUNCA, ni en el hero; se detectó en QA manual y se corrigió). Verificado en Chrome: la cabeza se ve completa en el hero y en Contacto (centrada, como estaba diseñado) y se achica a nada antes de que el Footer la tape — "LinkedIn"/"Instagram" completamente legibles en el scroll final.
- Archivos: `src/assets/components/landing/head/useHeadRig.js`, `src/assets/components/layout/Footer.module.css` (comentario explicando por qué el z-index NO se toca).

**Link a "todos los proyectos" agregado a la landing nueva:** sección Proyectos (después de las cards apiladas), Header (desktop: link mono junto a GitHub, solo ≥1024px; menú móvil: ítem más en la lista) y Footer (nav, después de Contacto). Misma ruta (`/all-projects`) y mismas claves de i18n (`header.allProjects`, `landing.projects.seeAll`) en español/inglés. La landing clásica ya tenía su propio link (`Hero.jsx`, `projects.projectsBtn`) — no se tocó.
- Archivos: `src/assets/components/landing/sections/ProjectsSection.jsx` + `.module.css`, `src/assets/components/layout/Header.jsx`, `src/assets/components/layout/Footer.jsx`, `src/shared/utils/Languajes/{Spanish,English}.js`.

**`execCommand('copy')` centralizado:** `Footer.jsx` y `ContactSection.jsx` tenían cada uno su propia copia de la función de copiar al portapapeles (`navigator.clipboard.writeText` + fallback `execCommand`, el mismo patrón que sigue usando `Hero.jsx` sin tocar, fuera del alcance pedido). Ahora las dos usan `shared/utils/clipboard.js` (`copyToClipboard`) — el fallback deprecado vive en un solo lugar.

**Verificado:** `rm -rf dist && npm run build` pasa limpio. Chunk principal: **606.66 kB / 184.97 kB gz** (antes de esta pasada: 605.6/184.6 — +~1 kB/+0.37 kB gz por `IntroFallback`, los links nuevos y `clipboard.js`). QA manual en Chrome (`?landing=new`, puerto 5183): nav de escritorio y menú móvil probados item por item desde "/" y desde `/all-projects` (el caso que antes fallaba), footer nav también, cabeza oculta en el tramo final sin tapar el Footer, contador del `IntroFallback` confirmado animando con CSS puro. No se corrió una pasada de red throttled para ver el `IntroFallback` real en cámara lenta (el chunk carga casi instantáneo en local) — la lógica se verificó por código + inyección directa del CSS en una pestaña de prueba.

**Rough edges / sin verificar en esta pasada:**
- El toast de "email copiado" (Footer y Contacto) no se re-verificó visualmente tras centralizar `copyToClipboard` — mismo patrón que ya estaba, sin cambios de lógica, riesgo bajo.
- No se probó el `IntroFallback` bajo throttling de red real (Slow 3G) para confirmar en cámara lenta que no hay un salto hacia `IntroLoader` — se verificó la lógica (mismas clases CSS, mismos tokens) pero no en vivo con una descarga lenta real.
- `Hero.jsx` (landing clásico) sigue con su propio `copyEmail` duplicado — fuera del alcance pedido (solo Footer + ContactSection).
- **Pantalla en blanco (punto 6):** renombra temporalmente `public/models/face.glb` y recarga cualquier página. Todo el sitio queda en blanco.
