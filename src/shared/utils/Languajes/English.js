import { v4 as uuid } from "uuid";

export const English = {
  languaje: "English",
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
    subtitle: "About me and contact ways.",
    description:
      "Web developer with experience in designing, developing and maintaining front-end web applications.",
    paragraphs: [
      "I am passionate about technology and web development. With solid experience in the Full Stack field, I have specialized in the exciting MERN ecosystem (MongoDB, Express.js, React.js, and Node.js).",
      "I love to challenge myself and explore new technologies to create innovative and efficient solutions. As a developer, I stand out for my ability to design, develop, and maintain complete and engaging web applications, which not only meet client requirements but also provide an interactive and satisfying experience for the end user.",
      "I am a proactive, adaptable professional committed to the team's success. I enjoy working collaboratively, bringing my skills and knowledge to effectively and creatively achieve established goals.",
      "I am excited to continue growing and learning in this exciting world of web development and technology!",
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
    experiences: [
      {
        id: uuid(),
        date: "Currently...",
        title: "Freelancer",
        company: "Freelancer",
        description:
          "As a freelance developer, I have successfully delivered custom applications to various clients, ensuring their specific needs were met, from creating websites to implementing complete web applications. I have worked closely with clients to ensure their goals are met and their expectations exceeded. My focus on quality and customer satisfaction has resulted in a high rate of retention and recommendation.",
        link: "https://www.linkedin.com/in/jose-martinez-dev/",
      },
      {
        id: uuid(),
        date: "March 2024 - September 2024",
        title: "Junior Data Analyst",
        company: "La Romana, DO",
        description:
          "In my role as a data entry specialist, I meticulously entered individual information into a centralized database to facilitate the marketing team's communication. Ensuring accuracy in sensitive data, while preventing duplicates, was paramount. Collaborating closely with the marketing team, I kept information up to date to support their strategies, meeting high quality standards and consistently meeting deadlines.",
      },
      {
        id: uuid(),
        date: "Currently...",
        title: "Fullstack Developer",
        company: "Freelancer",
        description:
          "As a full-stack developer, I have designed, developed, and maintained web applications from start to finish, ensuring that they meet client requirements and provide an engaging user experience. I have experience working with the MERN stack (MongoDB, Express.js, React.js, and Node.js) to create dynamic and responsive web applications that deliver value to clients and users.",
        link: "https://www.linkedin.com/in/jose-martinez-dev/",
      },
    ],
  },
  projects: {
    title: "Projects",
    description: "Some of my main projects.",
    projects: [
      {
        id: "uuid()",
        name: "Gestipol",
        image: "https://i.imgur.com/Y1WgyYI.png",
        description:
          "Gestipol is an application that allows political candidates to manage the status of their voters to have clearer information about the process during the campaign.",
        tech: ["React", "Node.js", "Tailwind CSS", "MongoDB"],
        urls: [
          {
            id: "uuid()",
            name: "Github",
            url: "https://github.com/ElJosecito/crm-frontend",
          },
          {
            id: "uuid()",
            name: "Live",
            url: "https://gestipol.onrender.com/home",
          },
        ],
      },
      {
        id: "uuid()",
        name: "Bank Landing Page",
        image: "https://i.imgur.com/LbmEbD2.png",
        description:
          "This is a landing page for a fictional bank, which was created in order to practice and improve my web development skills. The page is fully responsive and was inspired by a design from frontend mentor.",
        tech: ["React", "Tailwind CSS", "SASS", "Vite"],
        urls: [
          {
            id: "uuid()",
            name: "Github",
            url: "https://github.com/ElJosecito/bank-Landing",
          },
          {
            id: "uuid()",
            name: "Live",
            url: "https://vermillion-kashata-e30b59.netlify.app/",
          },
        ],
      },
      {
        id: "uuid()",
        name: "Flags App",
        image: "https://i.imgur.com/clPtB70.png",
        description:
          "Flags App is a web application that allows users to search for and view information about countries around the world. The application was created in order to practice and improve my web development skills. Inspired by a design from frontend mentor.",
        tech: ["React", "Tailwind CSS", "SASS", "Vite"],
        urls: [
          {
            id: "uuid()",
            name: "Github",
            url: "https://github.com/ElJosecito/country-app",
          },
          {
            id: "uuid()",
            name: "Live",
            url: "https://guileless-daffodil-25c071.netlify.app/",
          },
        ],
      },
    ],
  },
};
