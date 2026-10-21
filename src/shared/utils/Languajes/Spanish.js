export const Spanish = {
  languaje: "Español",
  header: {
    home: "Inicio",
    experience: "Experiencia",
    about: "Acerca de",
    projects: "Proyectos",
    contact: "Contacto",
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
};
