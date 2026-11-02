export const Spanish = {
  languaje: "Español",
  header: {
    home: "Inicio",
    experience: "Experiencia",
    about: "Acerca de",
    projects: "Proyectos",
    contact: "Contacto",
    allProjects: "Todos los proyectos",
  },
  hero: {
    name: "Jose Miguel Martinez Florimon",
    subtitle: [
      "Mobile Tech Lead",
      "React Native",
      "Desarrollador Móvil",
      "Front-End",
      "Aprendiendo iOS nativo",
    ],
    emailCopied: "Email copiado",
    emailAlreadyCopied: "Email ya copiado",
    downloadCv: "Descargar CV",
  },
  // Copy de la sección 3D: el nombre gigante detrás de la cabeza y las notas
  // técnicas a los costados (ver landing/sections/HeroSection, el hero del
  // landing nuevo). Separado de `hero` porque es contenido propio de esa
  // sección, no del hero clásico de abajo (`hero`, arriba).
  hero3d: {
    firstName: "José",
    lastName: "Martínez",
    notes: {
      topLeft: [
        "MOBILE TECH LEAD",
        "REACT NATIVE · TYPESCRIPT",
        "+4 AÑOS EN PRODUCCIÓN",
        "LA ROMANA · REP. DOMINICANA",
      ],
      midLeft: [
        "LENDY — +10K DESCARGAS",
        "VECINIA — 2 APPS, SOLO",
        "MEDYCORE — LIDERANDO FRONTEND",
      ],
      topRight: ["DE ARQUITECTURA", "A GOOGLE PLAY", "Y APP STORE"],
      midRight: ["APRENDIENDO", "iOS NATIVO", "SWIFT · SWIFTUI", "APP PROPIA: DEBY"],
    },
  },
  about: {
    title: "Sobre mí",
    // La tarjeta del bento y la sección de abajo decían las dos "Sobre mí", así
    // que la página tenía dos encabezados de mismo nivel con el mismo texto.
    summaryTitle: "En resumen",
    subtitle: "Acercade de mi y formas de contacto.",
    description:
      "Mobile Tech Lead con React Native: llevo apps de punta a punta, desde la arquitectura hasta la publicación en App Store y Google Play.",
    paragraphs: [
      "Trabajo sobre todo en móvil, con React Native y TypeScript. Lideré la arquitectura móvil de Lendy, una plataforma de préstamos con más de 10,000 descargas, y construí solo Vecinia, una plataforma para comunidades residenciales con dos apps publicadas en App Store y Google Play.",
      "Hoy lidero el frontend en Medycore: la migración de una aplicación web en producción a React Native, el design system y los estándares de code review de un equipo de cuatro desarrolladores.",
      "Trabajar en las dos plataformas me obliga a pensar el producto entero: APIs compartidas, diseño consistente, y los detalles que cambian cuando una interfaz pasa de una pantalla de escritorio a un pulgar.",
      "Ahora estoy aprendiendo iOS nativo con Swift y SwiftUI, con apps propias como DEBY, para entender mejor la plataforma en la que publico.",
    ],
  },
  country: {
    title: "País",
    description: "Desde La Romana, DO, 🇩🇴",
  },
  skills: {
    title: "Habilidades",
    description: "Tecnologías con las que tengo experiencia.",
    skillsBtn: "Ver todas",
  },

  experience: {
    title: "Experiencia",
    description: "Mi experiencia laboral.",
    loading: "Cargando experiencia...",
    empty: "Todavía no hay experiencia cargada",
  },
  projects: {
    title: "Proyectos",
    description: "Algunos de mis proyectos principales.",
    projectsBtn: "Ver todos",
    loading: "Cargando proyectos...",
    empty: "No hay proyectos disponibles",
    filters: {
      all: "Todos",
      web: "Web",
      mobile: "Mobile",
    },
  },

  // Copy exclusiva del landing nuevo (hero3d + scroll). Namespace separado a
  // propósito: `about`/`experience`/`projects` de arriba siguen siendo la
  // fuente de verdad para los hechos (títulos, descripciones, estados de
  // carga) y las consume también el landing clásico; esto es solo la voz
  // editorial puntual de las secciones nuevas (manifiesto, CTA de contacto),
  // no datos que haya que mantener en dos lugares.
  landing: {
    sectionLabels: {
      intro: "Cómo trabajo",
      experience: "Experiencia",
      projects: "Proyectos destacados",
      stack: "Stack",
      contact: "Contacto",
    },
    intro: {
      kicker: "Manifiesto",
      // `**palabra**` se parsea en AboutSection como resaltado en cobalto —
      // mismo patrón simple que un `<mark>`, sin traer un parser de markdown
      // completo para cuatro líneas.
      manifesto: [
        "Pienso en **producto completo**, no en pantallas sueltas.",
        "React Native **de punta a punta**: de la arquitectura al App Store.",
        "La consistencia entre plataformas **no es opcional**.",
        "Y ahora, sumando **Swift** a la mezcla.",
      ],
    },
    experience: {
      kicker: "Trayectoria",
    },
    projects: {
      kicker: "Lo último",
      viewProject: "Ver proyecto",
      seeAll: "Ver todos los proyectos",
    },
    stack: {
      title: "Con qué trabajo",
    },
    contact: {
      ctaTitle: "¿Hablamos?",
      ctaSubtitle: "Escríbeme y vemos qué construimos.",
      copyEmail: "Copiar email",
      emailCopied: "Email copiado",
    },
  },

  // Pie global (ver layout/Footer.jsx). Los links de nav reusan `header.*`
  // de arriba, no se duplican acá. El toast de email copiado reusa
  // `landing.contact.emailCopied` (mismo texto, mismo tono) en vez de
  // duplicar la clave acá.
  footer: {
    rights: "Todos los derechos reservados.",
    cta: "¿Construimos algo juntos?",
    availability: "Disponible para proyectos",
    localTimeLabel: "Hora local",
    location: "La Romana, RD",
    backToTop: "Volver arriba",
    navAriaLabel: "Navegación del pie de página",
    socialsAriaLabel: "Redes sociales",
    builtWith: "Hecho con React · GSAP · Three.js",
  },

  // Textos que solo ven los buscadores y las tarjetas al compartir. Van
  // separados de la copy de pantalla a propósito: un título de pestaña y un
  // encabezado de sección se optimizan para cosas distintas, y mezclarlos
  // termina con uno de los dos mal.
  seo: {
    jobTitle: "Mobile Tech Lead · React Native",
    home: {
      title: "Jose Martinez — Mobile Tech Lead · React Native",
      description:
        "Portfolio de Jose Martinez, Mobile Tech Lead desde La Romana, República Dominicana. Apps con React Native publicadas en App Store y Google Play, y proyectos web con React y Next.js.",
    },
    projects: {
      title: "Proyectos — Jose Martinez",
      description:
        "Proyectos web y mobile de Jose Martinez, construidos con React Native, React, Next.js y TypeScript.",
    },
  },
  common: {
    loading: "Cargando",
  },
  errors: {
    loadProjects: "Error al cargar proyectos",
    loadProject: "Error al cargar el proyecto",
    loadExperience: "Error al cargar la experiencia",
    loadGallery: "Error al cargar la galería",
  },
};
