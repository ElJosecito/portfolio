export const English = {
  languaje: "English",
  header: {
    home: "Home",
    experience: "Experience",
    about: "About",
    projects: "Projects",
    contact: "Contact",
    allProjects: "All projects",
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
    emailCopied: "Email copied",
    emailAlreadyCopied: "Email already copied",
    downloadCv: "Download CV",
  },
  // Copy for the 3D section: the giant name behind the head and the
  // technical side notes (see landing/sections/HeroSection, the new
  // landing's hero). Kept apart from `hero` since it belongs to that
  // section, not the classic hero below it (`hero`, above).
  hero3d: {
    firstName: "José",
    lastName: "Martínez",
    notes: {
      topLeft: [
        "MOBILE TECH LEAD",
        "REACT NATIVE · TYPESCRIPT",
        "4+ YEARS IN PRODUCTION",
        "LA ROMANA · DOMINICAN REP.",
      ],
      midLeft: [
        "LENDY — 10K+ DOWNLOADS",
        "VECINIA — 2 APPS, SOLO",
        "MEDYCORE — LEADING FRONTEND",
      ],
      topRight: ["FROM ARCHITECTURE", "TO APP STORE", "AND GOOGLE PLAY"],
      midRight: ["LEARNING", "NATIVE iOS", "SWIFT · SWIFTUI", "OWN APP: DEBY"],
    },
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

  // Copy exclusive to the new landing (hero3d + scroll). Kept in its own
  // namespace: `about`/`experience`/`projects` above stay the single source
  // of truth for facts (titles, descriptions, loading states) and the
  // classic landing still consumes them too; this is just the editorial
  // voice of the new sections (manifesto, contact CTA), not data that needs
  // to be kept in two places.
  landing: {
    sectionLabels: {
      intro: "How I work",
      experience: "Experience",
      projects: "Featured projects",
      stack: "Stack",
      contact: "Contact",
    },
    intro: {
      kicker: "Manifesto",
      // `**word**` gets parsed in AboutSection as a cobalt highlight — same
      // idea as a `<mark>`, without pulling in a full markdown parser for
      // four lines of copy.
      manifesto: [
        "I think in **whole products**, not loose screens.",
        "React Native **end to end**: from architecture to the App Store.",
        "Consistency across platforms **is not optional**.",
        "And now, adding **Swift** to the mix.",
      ],
    },
    experience: {
      kicker: "Track record",
    },
    projects: {
      kicker: "Latest work",
      viewProject: "View project",
      seeAll: "See all projects",
    },
    stack: {
      title: "What I work with",
      subtitle: "What I use every day to take apps from idea to store.",
      areas: {
        ios: "Native iOS",
        crossPlatform: "Cross-platform",
        frontend: "Frontend",
        aiTools: "AI & tools",
      },
      nativeModules: "Native modules (Swift/Kotlin)",
    },
    contact: {
      ctaTitle: "Let's talk",
      ctaSubtitle: "Write to me and let's see what we can build.",
      copyEmail: "Copy email",
      emailCopied: "Email copied",
      whatsapp: "WhatsApp",
      whatsappMessage: "Hi José, I saw your portfolio and I'd like to talk.",
    },
  },

  // Global footer (see layout/Footer.jsx). The nav links reuse `header.*`
  // above, not duplicated here. The email-copied toast reuses
  // `landing.contact.emailCopied` (same copy, same tone) instead of
  // duplicating the key here.
  footer: {
    rights: "All rights reserved.",
    cta: "Shall we build something together?",
    availability: "Available for work",
    localTimeLabel: "Local time",
    location: "La Romana, DR",
    backToTop: "Back to top",
    navAriaLabel: "Footer navigation",
    socialsAriaLabel: "Social links",
    builtWith: "Built with React · GSAP · Three.js",
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
  common: {
    loading: "Loading",
  },
  errors: {
    loadProjects: "Couldn't load projects",
    loadProject: "Couldn't load the project",
    loadExperience: "Couldn't load experience",
    loadGallery: "Couldn't load the gallery",
  },
};
