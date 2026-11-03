import React, { Suspense, lazy, useEffect, useState } from "react";

// Gate de capacidad: decide, antes del primer render, si el visitante ve el
// landing nuevo (3D + scroll animado) o el clásico. Ver deviceCapability.js.
import { resolveLandingVariant } from "../shared/utils/deviceCapability";

// Landing nuevo: three.js, gsap y lenis viven todos en este chunk, aparte del
// principal — igual que el panel de abajo, nadie que caiga en el landing
// clásico tiene que pagar ese peso.
const NewLanding = lazy(() => import("../assets/components/landing/NewLanding"));

// La landing clásica y /all-projects también van aparte: antes se importaban
// directo y TODO visitante los descargaba en el chunk principal, aunque
// viera la portada nueva (la mayoría). Cada uno se baja solo si se usa.
const Hero = lazy(() => import("../assets/components/Hero"));
const ProjectsPage = lazy(() => import("../assets/components/pages/ProjectsPage"));

// Precarga del 3D en paralelo: la capa de la cabeza (three + fiber + el
// modelo) se pedía recién cuando NewLanding ya había cargado y montado
// HeadLayer — una cadena index → NewLanding → HeadScene. Pedirla apenas se
// sabe la variante la baja en paralelo con NewLanding; el `lazy()` de
// HeadLayer reusa la misma promesa del módulo (mismo specifier), no lo
// descarga dos veces.
function preloadNewLanding() {
  import("../assets/components/landing/NewLanding");
  import("../assets/components/landing/head/HeadScene");
}

// El panel se carga aparte: nadie que entre a ver el portfolio necesita
// descargar el dashboard, los formularios ni el kit de componentes del admin.
const AdminLogin = lazy(() => import("../assets/components/AdminLogin"));
const AdminDashboard = lazy(() => import("../assets/components/AdminDashboard"));
// El guard del panel también: era el único import directo de Supabase en el
// chunk principal, así que todo visitante bajaba el cliente (auth, realtime,
// storage) antes del primer pintado. Ahora llega en paralelo, con la sección
// que de verdad lo usa.
const ProtectedRoute = lazy(() => import("../assets/components/ProtectedRoute"));

// El detalle también, porque arrastra el renderer de markdown y la portada no
// lo necesita.
const ProjectDetail = lazy(() => import("../assets/components/pages/ProjectDetail"));

import { Route, Routes } from "react-router-dom";
import { useLocation } from "react-router-dom";
import Header from "../assets/components/layout/Header";
import Footer from "../assets/components/layout/Footer";

//import languajes
import { initLanguage, storeLanguage } from "../shared/utils/language";

//loader
import { FullPageLoader } from "../shared/ui/Loader";

// Fallback de "/" con el landing nuevo: mismo primer frame que IntroLoader
// (cobalto + contador), no el monograma genérico — ver IntroFallback.jsx.
// `shouldShowIntro` es liviano (sin gsap/three, solo sessionStorage), así
// que importarlo acá no mete nada pesado en el chunk principal.
import IntroFallback from "../assets/components/landing/intro/IntroFallback";
import { shouldShowIntro } from "../assets/components/landing/intro/introState";

//fallback del detalle: el mismo skeleton que usa la página ya cargada
import ProjectDetailFallback from "../assets/components/skeletons/ProjectDetailFallback";

// Puente a Lenis: si el landing nuevo está montado, Lenis intercepta el
// scroll nativo y un `window.scrollTo` directo no alcanza (ver el comentario
// en lenisBridge.js). Este módulo es liviano a propósito — no importa Lenis
// ni gsap — así que no mete esos paquetes en el chunk principal solo por
// este reset, que corre en TODAS las rutas.
import { resetScrollPosition, scrollToSection } from "../assets/components/landing/scroll/lenisBridge";

// El landing nuevo bloquea/anima el scroll durante su intro (~2.5s, tope
// 3.5s, ver docs/landing-redesign-review.md "Estado"); si el hash-scroll de
// abajo encuentra la sección y scrollea ANTES de que la intro termine, la
// intro puede volver a tocar el scroll (o el layout todavía se está
// asentando) y la posición final queda mal (confirmado en QA manual: un
// link a "/#contact" desde otra ruta terminaba mostrando "Proyectos"). Este
// evento es liviano — no importa nada del landing nuevo, solo el nombre del
// evento — así que escucharlo acá no mete three.js/gsap en el chunk
// principal por una ruta que puede ni estar sobre el landing nuevo.
import { INTRO_DONE_EVENT } from "../assets/components/landing/intro/introState";

// Toast global (ver Footer.jsx, botón de copiar email): antes había un
// `<Toaster />` separado montado dentro de Hero.jsx Y de NewLanding.jsx, cada
// uno solo vivo en "/" — en `/all-projects` o `/projects/:slug` no había
// ningún `<Toaster />` en el árbol, así que un toast disparado desde el
// Footer (que sí se monta en todas las rutas) no tenía dónde pintarse. Se
// centraliza acá, una sola vez, para que el Footer (y cualquier otra ruta)
// pueda mostrar toasts sin depender de qué página esté montada.
import { Toaster } from "react-hot-toast";

/**
 * Sube al tope cada vez que cambia la ruta, o scrollea a la sección del hash
 * si la navegación trae uno (`/#contact`, ver Footer.jsx: los links de nav
 * navegan así cuando no se está ya en "/").
 *
 * Antes cada página lo hacía por su cuenta desde un `useEffect`, así que la
 * portada —que no lo hacía— heredaba el scroll de donde venías. `instant` es
 * explícito para que no dependa de que nadie vuelva a poner `scroll-behavior:
 * smooth` global: ahí el salto se vuelve un deslizamiento y parece un glitch.
 */
function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      resetScrollPosition();
      return undefined;
    }

    // El landing nuevo carga su chunk de forma perezosa (Suspense todavía
    // puede estar mostrando el fallback cuando este efecto corre), así que
    // el nodo del id puede no existir todavía — se reintenta por un rato
    // corto en vez de rendirse en el primer frame.
    const sectionId = hash.slice(1);
    let frame;
    let attempts = 0;
    const timeouts = [];

    // Encontrar el nodo no alcanza: justo después de montarse, el landing
    // nuevo todavía está acomodando layout (fuentes, cards sticky de
    // Proyectos midiendo su alto real, la cabeza 3D) — un `scrollToSection`
    // disparado ahí apunta a un `offsetTop` que todavía va a correrse hacia
    // abajo. Confirmado en QA manual: un link a "/#contact" desde otra ruta
    // terminaba mostrando "Proyectos". Por eso se re-afirma la posición un
    // par de veces más mientras el layout se asienta, en vez de confiar en
    // un solo intento.
    const rescroll = () => scrollToSection(sectionId);

    const tryScroll = () => {
      if (document.getElementById(sectionId)) {
        rescroll();
        timeouts.push(setTimeout(rescroll, 300));
        timeouts.push(setTimeout(rescroll, 900));
        timeouts.push(setTimeout(rescroll, 1800));
        return;
      }
      attempts += 1;
      if (attempts < 100) frame = requestAnimationFrame(tryScroll);
    };

    tryScroll();

    // Reintento extra si la intro del landing nuevo (tope 3.5s, ver
    // docs/landing-redesign-review.md "Estado") todavía sigue corriendo
    // pasados los reintentos de arriba — cubre el caso de un visitante
    // nuevo (sin `sessionStorage` todavía) con una conexión lenta. Si la
    // intro no corre esta sesión (ya se mostró antes, o el landing es el
    // clásico), este evento nunca se dispara y el listener solo queda sin
    // usar hasta el cleanup.
    window.addEventListener(INTRO_DONE_EVENT, rescroll);

    return () => {
      cancelAnimationFrame(frame);
      timeouts.forEach(clearTimeout);
      window.removeEventListener(INTRO_DONE_EVENT, rescroll);
    };
  }, [pathname, hash]);

  return null;
}

function Router() {
  // Inicializador perezoso: el idioma guardado se resuelve antes del primer
  // render, no en un efecto posterior. Ver shared/utils/language.js.
  const [languaje, setLanguaje] = useState(initLanguage);

  // Mismo patrón para la variante del landing: se resuelve de una sola vez,
  // antes de pintar nada, para que no haya un flash del landing nuevo (o del
  // clásico) corrigiéndose después del primer render. Ver deviceCapability.js.
  const [landingVariant] = useState(() => {
    const variant = resolveLandingVariant();
    if (variant === "new" && window.location.pathname === "/") preloadNewLanding();
    return variant;
  });

  // Mismo criterio una sola vez por montaje (ver comentario de arriba): si
  // la intro no va a mostrarse esta sesión, el fallback de "/" no debería
  // ponerse a contar para nada (ver IntroFallback.jsx, `withCounter`).
  const [showIntroThisSession] = useState(shouldShowIntro);

  const location = useLocation();
  const hideLayout = location.pathname.startsWith('/admin');

  //handle children languaje
  const handleLanguaje = (code) => {
    setLanguaje(storeLanguage(code === "es" ? "es" : "en"));
  };

  return (
    <>
      <ScrollToTop />
      <Toaster />
      {/* <!-- Page content here --> */}
      {!hideLayout && (
        <Header
          onDatos={handleLanguaje}
          languaje={languaje}
          transparentHero={landingVariant === "new"}
        />
      )}
      <Routes>
        <Route
          path="/"
          element={
            landingVariant === "new" ? (
              <Suspense fallback={<IntroFallback withCounter={showIntroThisSession} />}>
                <NewLanding languaje={languaje} />
              </Suspense>
            ) : (
              <Suspense fallback={<FullPageLoader label={languaje.common.loading} />}>
                <Hero languaje={languaje} />
              </Suspense>
            )
          }
        ></Route>
        <Route
          path="/all-projects"
          element={
            <Suspense fallback={<FullPageLoader label={languaje.common.loading} />}>
              <ProjectsPage languaje={languaje} />
            </Suspense>
          }
        ></Route>
        <Route
          path="/projects/:slug"
          element={
            <Suspense fallback={<ProjectDetailFallback />}>
              <ProjectDetail languaje={languaje} />
            </Suspense>
          }
        ></Route>
        <Route
          path="/admin/login"
          element={
            <Suspense fallback={<FullPageLoader label="Cargando panel" />}>
              <AdminLogin />
            </Suspense>
          }
        ></Route>
        <Route
          path="/admin"
          element={
            <Suspense fallback={<FullPageLoader label="Cargando panel" />}>
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            </Suspense>
          }
        ></Route>
        <Route path="*" element={<h1>404</h1>}></Route>
      </Routes>
      {!hideLayout && (
        <Footer
          languaje={languaje}
          // "Telón" del footer (ver Footer.jsx): solo en la portada CON el
          // landing nuevo — el clásico y el resto de las rutas lo siguen
          // usando como un footer normal, en flujo.
          curtain={location.pathname === "/" && landingVariant === "new"}
          // Mismo cálculo que `contactSectionId` en Header.jsx: el landing
          // nuevo tiene una sección de contacto propia (`id="contact"`), el
          // clásico sigue combinando "acerca de" + contacto en un solo
          // bloque (`id="about"`, ver Hero.jsx).
          contactSectionId={landingVariant === "new" ? "contact" : "about"}
        />
      )}
    </>
  );
}

export default Router;
