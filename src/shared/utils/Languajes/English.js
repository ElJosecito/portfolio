export const English = {
  languaje: "English",
  header: {
    home: "Home",
    experience: "Experience",
    about: "About",
    projects: "Projects",
    contact: "Contact",
  },
  hero: {
    name: "Jose Miguel Martinez Florimon",
    subtitle: [
      "Mobile Tech Lead",
      "React Native",
      "Mobile Developer",
      "Front-End",
      "Learning native iOS",
    ],
  },
  about: {
    title: "About me",
    // La tarjeta del bento y la sección de abajo decían las dos "About me", así
    // que la página tenía dos encabezados de mismo nivel con el mismo texto.
    summaryTitle: "At a glance",
    subtitle: "About me and contact ways.",
    description:
      "Mobile Tech Lead working in React Native: I take apps end to end, from architecture to release on the App Store and Google Play.",
    paragraphs: [
      "I work mostly on mobile, with React Native and TypeScript. I led the mobile architecture of Lendy, a lending platform with over 10,000 downloads, and built Vecinia on my own, a platform for residential communities with two apps live on the App Store and Google Play.",
      "Today I lead frontend at Medycore: migrating a production web app to React Native, owning the design system, and setting the code review standards for a team of four developers.",
      "Working across both platforms means I think about a product as a whole: shared APIs, consistent design, and the details that change when an interface moves from a desktop screen to a thumb.",
      "I'm currently learning native iOS with Swift and SwiftUI, through my own apps like DEBY, to better understand the platform I ship to.",
    ],
  },
  country: {
    title: "Country",
    description: "From La Romana, DO, 🇩🇴",
  },
  skills: {
    title: "Skills",
    description: "Technologies that I have experience with.",
    skillsBtn: "See all",
  },
  experience: {
    title: "Experience",
    description: "My work experience.",
    loading: "Loading experience...",
    empty: "No experience listed yet",
  },
  projects: {
    title: "Projects",
    description: "Some of my main projects.",
    projectsBtn: "See all",
    loading: "Loading projects...",
    empty: "No projects available",
    filters: {
      all: "All",
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
        "Portfolio of Jose Martinez, Mobile Tech Lead based in La Romana, Dominican Republic. React Native apps live on the App Store and Google Play, plus web projects built with React and Next.js.",
    },
    projects: {
      title: "Projects — Jose Martinez",
      description:
        "Web and mobile projects by Jose Martinez, built with React Native, React, Next.js and TypeScript.",
    },
  },
};
