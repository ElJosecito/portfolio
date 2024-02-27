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
    subtitle: ["Web Developer", "Front-End", "Back-End", "Full-Stack"],
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
        image: "../../../../src/assets/images/gestipolMuckup.webp",
        description:
          "Gestipol is an app that allows political candidates to manage the status of their voters in order to have clearer information about the process during the campaign.",
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
        name: "Gestipol",
        image: "../../../../src/assets/images/BankLandingMuckup.webp",
        description:
          "Gestipol is an app that allows political candidates to manage the status of their voters in order to have clearer information about the process during the campaign.",
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
        name: "Gestipol",
        image: "../../../../src/assets/images/countryAppMuckup.webp",
        description:
          "Gestipol is an app that allows political candidates to manage the status of their voters in order to have clearer information about the process during the campaign.",
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
        name: "Gestipol",
        image: "../../../../src/assets/images/StatslandingMuckup.webp",
        description:
          "Gestipol is an app that allows political candidates to manage the status of their voters in order to have clearer information about the process during the campaign.",
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
    ],
  },
};
