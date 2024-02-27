import { v4 as uuid } from "uuid";

export const Spanish = {
  header: {
    home: "Inicio",
    experience: "Experiencia",
    about: "Acerca de",
    projects: "Proyectos",
    contact: "Contacto",
  },
  hero: {
    name: "Jose Miguel Martinez Florimon",
    subtitle: ["Desarrollador Web", "Front-End", "Back-End", "Full-Stack"],
  },
  about: {
    title: "Acerca de mí",
    description:
      "Desarrollador web con experiencia en diseño, desarrollo y mantenimiento de aplicaciones web front-end.",
  },
  experience: {
    title: "Experiencia",
    description: "años de experiencia",
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
  },
  projects: {
    title: "Proyectos",
    description: "Algunos de mis proyectos principales.",
    projects: [
      {
        id: uuid(),
        name: "Gestipol",
        image: "../../../../src/assets/images/gestipolMuckup.webp",
        description:
          "Gestipol es una aplicación que permite a los candidatos políticos gestionar el estado de sus votantes para tener una información más clara sobre el proceso durante la campaña.",
        tech: ["React", "Node.js", "Tailwind CSS", "MongoDB"],
        urls: [
          {
            id: uuid(),
            name: "Github",
            url: "",
          },
          {
            id: uuid(),
            name: "En Vivo",
            url: "",
          },
        ],
      },
      {
        id: uuid(),
        name: "Gestipol",
        image: "../../../../src/assets/images/BankLandingMuckup.webp",
        description:
          "Gestipol es una aplicación que permite a los candidatos políticos gestionar el estado de sus votantes para tener una información más clara sobre el proceso durante la campaña.",
        tech: ["React", "Node.js", "Tailwind CSS", "MongoDB"],
        urls: [
          {
            id: uuid(),
            name: "Github",
            url: "",
          },
          {
            id: uuid(),
            name: "En Vivo",
            url: "",
          },
        ],
      },
      {
        id: uuid(),
        name: "Gestipol",
        image: "../../../../src/assets/images/countryAppMuckup.webp",
        description:
          "Gestipol es una aplicación que permite a los candidatos políticos gestionar el estado de sus votantes para tener una información más clara sobre el proceso durante la campaña.",
        tech: ["React", "Node.js", "Tailwind CSS", "MongoDB"],
        urls: [
          {
            id: uuid(),
            name: "Github",
            url: "",
          },
          {
            id: uuid(),
            name: "En Vivo",
            url: "",
          },
        ],
      },
      {
        id: uuid(),
        name: "Gestipol",
        image: "../../../../src/assets/images/StatslandingMuckup.webp",
        description:
          "Gestipol es una aplicación que permite a los candidatos políticos gestionar el estado de sus votantes para tener una información más clara sobre el proceso durante la campaña.",
        tech: ["React", "Node.js", "Tailwind CSS", "MongoDB"],
        urls: [
          {
            id: uuid(),
            name: "Github",
            url: "",
          },
          {
            id: uuid(),
            name: "En Vivo",
            url: "",
          },
        ],
      },
    ],
  },
};
