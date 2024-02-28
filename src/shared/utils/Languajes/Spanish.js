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
    title: "Sobre mí",
    subtitle: "Acercade de mi y formas de contacto.",
    description:
      "Desarrollador web con experiencia en diseño, desarrollo y mantenimiento de aplicaciones web front-end.",
    paragraphs: [
      "Soy un apasionado de la tecnología y el desarrollo web. Con una sólida experiencia en el ámbito Full Stack, me he especializado en el emocionante ecosistema MERN (MongoDB, Express.js, React.js y Node.js).",
      "Me encanta desafiarme a mí mismo y explorar nuevas tecnologías para crear soluciones innovadoras y eficientes. Como desarrollador, me destaco por mi capacidad para diseñar, desarrollar y mantener aplicaciones web completas y atractivas, que no solo cumplan con los requisitos del cliente, sino que también ofrezcan una experiencia interactiva y satisfactoria para el usuario final.",
      "Soy un profesional proactivo, adaptable y comprometido con el éxito del equipo. Me gusta trabajar en colaboración, aportando mis habilidades y conocimientos para alcanzar los objetivos establecidos con eficacia y creatividad.",
      "¡Estoy emocionado de seguir creciendo y aprendiendo en este apasionante mundo del desarrollo web y la tecnología!",
    ],
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
