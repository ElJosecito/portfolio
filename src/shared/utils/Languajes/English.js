import { v4 as uuid } from "uuid";

export const English = {
  header: {
    home: "Home",
    expecience: "Experience",
    about: "About",
    projects: "Projects",
    contact: "Contact",
  },
  hero: {
    name: "Jose Miguel Martinez Florimon",
    subtitle: ["Desarrollador Web", "Front-End", "Back-End", "Full-Stack"],
  },
  about: {
    title: "About me",
    description:
      "Web developer with experience in designing, developing and maintaining front-end web applications.",
  },
  experience: {
    title: "Experience",
    description: "years of experience",
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
  },
  projects: {
    title: "Projects",
    description: "Some of my main projects.",
    projects: [
      {
        id: uuid(),
        name: "Gestipol",
        image: "../../../../src/assets/images/GestipolMockup.png",
        description:
          "Gestipol es una app que le permite a los candidatos politicos gestionar el estado de sus votantes para asi tener informacion mas clara del proceso durante la capaña.",
        tech: ["React", "Node.js", "Tailwind CSS", "MongoDB"],
        urls: [
          {
            id: uuid(),
            name: "Github",
            url: "",
          },
          {
            id: uuid(),
            name: "Live",
            url: "",
          },
        ],
      },

      {
        id: uuid(),
        name: "E-commerce",
        description: "E-commerce website.",
        tech: ["React", "Node", "Express", "MongoDB"],
        urls: [
          {
            id: uuid(),
            name: "Github",
            url: "",
          },
          {
            id: uuid(),
            name: "Live",
            url: "",
          },
        ],
      },
      {
        id: uuid(),
        name: "Social Media",
        description: "Social media website.",
        tech: ["React", "Node", "Express", "MongoDB"],
        urls: [
          {
            id: uuid(),
            name: "Github",
            url: "",
          },
          {
            id: uuid(),
            name: "Live",
            url: "",
          },
        ],
      },
    ],
  },
};
