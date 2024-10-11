import { v4 as uuid } from "uuid";

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
    experiences: [
      {
        id: uuid(),
        date: "Actualmente...",
        title: "Freelancer",
        company: "Freelancer",
        description:"Como desarrollador freelance, he entregado con éxito aplicaciones personalizadas a varios clientes, asegurando que sus necesidades específicas fueran satisfechas, desde la creación de sitios web hasta la implementación de aplicaciones web completas. He trabajado en estrecha colaboración con los clientes para garantizar que sus objetivos se cumplan y que sus expectativas se superen. Mi enfoque en la calidad y la satisfacción del cliente ha resultado en una alta tasa de retención y recomendación.",
        link: "https://www.linkedin.com/in/jose-martinez-dev/",
      },
      {
        id: uuid(),
        date: "Marzo 2024 - Septiembre 2024",
        title: "Analista de datos Junior",
        company: "La Romana, DO",
        description:"En mi rol como especialista en entrada de datos, ingresé meticulosamente la información individual en una base de datos centralizada para facilitar la comunicación del equipo de marketing. Asegurar la precisión en los datos sensibles, mientras prevenía duplicados, fue primordial. Colaborando estrechamente con el equipo de marketing, mantuve información actualizada para apoyar sus estrategias, cumpliendo con altos estándares de calidad y cumpliendo plazos consistentemente."
      },
      {
        id: uuid(),
        date: "Actualmente...",
        title: "Fullstack Developer",
        company: "JGI Solutions and Marketing",
        description:"Como Desarrollador Fullstack en JGI and Marketing Solutions, trabajo de cerca con los equipos de frontend y backend para asegurar el rendimiento óptimo de los tickets de los proyectos actuales. En este entorno dinámico, contribuyo activamente al diseño y desarrollo de aplicaciones web.",
      },
    ]
  },
  projects: {
    title: "Proyectos",
    description: "Algunos de mis proyectos principales.",
    projectsBtn: "Ver todos",
    projects: [
      {
        id: uuid(),
        name: "Gestipol",
        image: "https://i.imgur.com/Y1WgyYI.png",
        description:
          "Gestipol es una aplicación que permite a los candidatos políticos gestionar el estado de sus votantes para tener una información más clara sobre el proceso durante la campaña.",
        tech: ["React", "Node.js", "Tailwind CSS", "MongoDB"],
        urls: [
          {
            id: uuid(),
            name: "Github",
            url: "https://github.com/ElJosecito/crm-frontend",
          },
          {
            id: uuid(),
            name: "En Vivo",
            url: "https://gestipol.onrender.com/home",
          },
        ],
      },
      {
        id: uuid(),
        name: "Bank Landing Page",
        image: "https://i.imgur.com/LbmEbD2.png",
        description:
          "Esta es una landing page de un banco ficticio, la cual fue creada con el fin de practicar y mejorar mis habilidades en el desarrollo web. La página es completamente responsive y fue inspirada en un diseño de frontend mentor.",
        tech: ["React", "Tailwind CSS", "SASS", "Vite"],
        urls: [
          {
            id: uuid(),
            name: "Github",
            url: "https://github.com/ElJosecito/bank-Landing",
          },
          {
            id: uuid(),
            name: "En Vivo",
            url: "https://vermillion-kashata-e30b59.netlify.app/",
          },
        ],
      },
      {
        id: uuid(),
        name: "Dental Clinic Web",
        image: "https://imgur.com/u6wEWGK.png",
        description:
          "Dental Clinic Web es una landing page que permite al cliente tener mas informacion sobre la clinica dental que visitara y de sus doctores. La web fue desarrollada con el fin de brindar informacion de manera comoda y facil. Inspirada en un diseño personal.",
        tech: ["React", "Tailwind CSS", "Vite"],
        urls: [
          {
            id: uuid(),
            name: "Github",
            url: "https://github.com/ElJosecito/vdc-web",
          },
          {
            id: uuid(),
            name: "En Vivo",
            url: "https://vdc-web.netlify.app/",
          },
        ],
      },

      {
        id: uuid(),
        name: "Multisemar Web",
        image: "https://imgur.com/jEVndxk.png",
        description:
          "Multisemar Web es una landing page que permite al cliente tener mas informacion sobre la empresa y sus servicios. La web fue desarrollada con el fin de brindar informacion de manera comoda y facil. Inspirada en un diseño personal.",
        tech: ["React", "Tailwind CSS", "Next.js"],
        urls: [
          {
            id: uuid(),
            name: "Github",
            url: "https://github.com/ElJosecito/multisemar-web",
          },
          {
            id: uuid(),
            name: "En Vivo",
            url: "https://landingmultisemar.netlify.app/",
          },
        ],
      },

      {
        id: uuid(),
        name: "Flags App",
        image: "https://i.imgur.com/clPtB70.png",
        description:
          "Flags App es una aplicación web que permite a los usuarios buscar y ver información sobre los países del mundo. La aplicación fue creada con el fin de practicar y mejorar mis habilidades en el desarrollo web. Inspirada en un diseño de frontend mentor.",
        tech: ["React", "Tailwind CSS", "SASS", "Vite"],
        urls: [
          {
            id: uuid(),
            name: "Github",
            url: "https://github.com/ElJosecito/country-app",
          },
          {
            id: uuid(),
            name: "En Vivo",
            url: "https://guileless-daffodil-25c071.netlify.app/",
          },
        ],
      },
    ],
  },
};
