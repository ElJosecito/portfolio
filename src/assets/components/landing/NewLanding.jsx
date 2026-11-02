import React, { useRef, useState } from "react";
// Tokens compartidos del landing nuevo: se importan UNA sola vez acá (ver
// styles/tokens.css) para que todas las secciones puedan usar sus
// custom properties sin volver a declararlas.
import "./styles/tokens.css";
import styles from "./NewLanding.module.css";
import { useLenisScroll } from "./scroll/useLenisScroll";
import { useScrollRefresh } from "./scroll/useScrollRefresh";
import { useHeadRig } from "./head/useHeadRig";
import HeadLayer from "./head/HeadLayer";
import IntroLoader from "./intro/IntroLoader";
import { shouldShowIntro } from "./intro/introState";
import CustomCursor from "./cursor/CustomCursor";
import HeroSection from "./sections/HeroSection";
import AboutSection from "./sections/AboutSection";
import ExperienceSection from "./sections/ExperienceSection";
import ProjectsSection from "./sections/ProjectsSection";
import StackSection from "./sections/StackSection";
import ContactSection from "./sections/ContactSection";
import { useSiteSettings } from "../../../shared/hooks/useSiteSettings";
import { useSeo } from "../../../shared/hooks/useSeo";
import { isEnglish } from "../../../shared/utils/i18n";
import { SITE_URL, SOCIAL_LINKS, absoluteUrl } from "../../../shared/utils/seo";

const EMAIL = "josemartinezflorimon@gmail.com";

/**
 * Landing nuevo: hero 3D + secciones con animación de scroll. Solo se monta
 * cuando el gate de capacidad (ver shared/utils/deviceCapability.js) decide
 * "new" — y por eso vive en su propio chunk, lazy desde Router: three.js,
 * gsap y lenis no tienen que pesarle a quien cae en el landing clásico.
 *
 * Mismo SEO que el Hero clásico (ver useSeo acá abajo): las dos ramas son
 * mutuamente excluyentes en la misma ruta "/", así que cada una tiene que
 * declarar el suyo — no hay forma de compartir el efecto sin montar las dos.
 */
function NewLanding({ languaje }) {
  useLenisScroll();

  const mainRef = useRef(null);
  const heroRef = useRef(null);
  const contactRef = useRef(null);
  const rig = useHeadRig({ heroRef, contactRef });
  useScrollRefresh(mainRef, languaje);

  // Se resuelve UNA sola vez por montaje (ver introState.js) y se pasa para
  // abajo: IntroLoader decide si se monta, HeroSection si arranca con las
  // letras ocultas esperando el evento de fin de intro o visibles de una.
  const [showIntro] = useState(shouldShowIntro);
  const [introActive, setIntroActive] = useState(showIntro);

  const { settings } = useSiteSettings();
  const english = isEnglish(languaje);

  useSeo({
    title: languaje.seo.home.title,
    description: languaje.seo.home.description,
    path: "/",
    locale: english ? "en_US" : "es_DO",
    lang: english ? "en" : "es",
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "Person",
        name: "Jose Miguel Martinez Florimon",
        alternateName: "Jose Martinez",
        jobTitle: languaje.seo.jobTitle,
        description: languaje.about.description,
        url: SITE_URL,
        image: absoluteUrl(settings?.hero_image_url || "/jose-martinez.png"),
        email: `mailto:${EMAIL}`,
        sameAs: SOCIAL_LINKS,
        address: {
          "@type": "PostalAddress",
          addressLocality: "La Romana",
          addressCountry: "DO",
        },
        knowsAbout: [
          "React Native",
          "React",
          "TypeScript",
          "Expo",
          "Next.js",
          "Swift",
          "Desarrollo web",
          "Desarrollo móvil",
        ],
      },
      {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "Jose Martinez",
        url: SITE_URL,
        inLanguage: english ? "en" : "es",
      },
    ],
  });

  return (
    <>
      {introActive && <IntroLoader onComplete={() => setIntroActive(false)} />}
      <HeadLayer rig={rig} />
      <CustomCursor languaje={languaje} />
      <main ref={mainRef} className={styles.main}>
        <HeroSection ref={heroRef} languaje={languaje} awaitIntro={showIntro} />
        <AboutSection languaje={languaje} heroRef={heroRef} />
        <ExperienceSection languaje={languaje} />
        <ProjectsSection languaje={languaje} />
        <StackSection languaje={languaje} />
        <ContactSection ref={contactRef} languaje={languaje} email={EMAIL} />
      </main>
    </>
  );
}

export default NewLanding;
