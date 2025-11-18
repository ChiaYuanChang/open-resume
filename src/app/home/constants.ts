import {
  initialEducation,
  initialProfile,
  initialProject,
  initialWorkExperience,
} from "lib/redux/resumeSlice";
import type { Resume } from "lib/redux/types";
import { deepClone } from "lib/deep-clone";

export const END_HOME_RESUME: Resume = {
  profile: {
    name: "John Doe",
    summary:
      "Software engineer obsessed with building exceptional products that people love",
    email: "hello@openresume.com",
    phone: "123-456-7890",
    location: "NYC, NY",
    url: "linkedin.com/in/john-doe",
  },
  workExperiences: [
    {
      company: "ABC Company",
      jobTitle: "Software Engineer",
      date: "May 2023 - Present",
      description: "**Key Achievements:**\n- Lead a cross-functional team of 5 engineers in developing a search bar, which enables thousands of daily active users to search content across the entire platform\n- Create stunning home page product demo animations that drives up sign up rate by 20%\n- Write clean code that is modular and easy to maintain while ensuring 100% test coverage\n\n**Technologies:** React, Node.js, TypeScript",
    },
    {
      company: "DEF Organization",
      jobTitle: "Software Engineer Intern",
      date: "Summer 2022",
      description: "**Projects:**\n- Re-architected the existing content editor to be mobile responsive that led to a 10% increase in mobile user engagement\n- Created a progress bar to help users track progress that drove up user retention by 15%\n- Discovered and fixed 5 bugs in the existing codebase to enhance user experience",
    },
    {
      company: "XYZ University",
      jobTitle: "Research Assistant",
      date: "Summer 2021",
      description: "**Research Contributions:**\n- Devised a new NLP algorithm in text classification that results in 10% accuracy increase\n- Compiled and presented research findings to a group of 20+ faculty and students\n\n**Skills:** Python, Machine Learning, Data Analysis",
    },
  ],
  educations: [
    {
      school: "XYZ University",
      degree: "Bachelor of Science in Computer Science",
      date: "Sep 2019 - May 2023",
      gpa: "3.8",
      description: "**Awards:** Won 1st place in 2022 Education Hackathon, 2nd place in 2023 Health Tech Competition\n\n**Teaching:** Teaching Assistant for Programming for the Web (2022 - 2023)\n\n**Coursework:** Object-Oriented Programming (A+), Programming for the Web (A+), Cloud Computing (A), Introduction to Machine Learning (A-), Algorithms Analysis (A-)",
    },
  ],
  projects: [
    {
      project: "OpenResume",
      date: "Spring 2023",
      description: "**Overview:** Created and launched a free resume builder web app that allows thousands of users to create professional resume easily and land their dream jobs.\n\n**Key Features:**\n- Drag-and-drop interface\n- Real-time PDF preview\n- Multiple templates\n\n**Technologies:** React, Next.js, TypeScript, Tailwind CSS\n\n**Impact:** Helped 10,000+ users create professional resumes",
    },
  ],
  skills: {
    featuredSkills: [
      { skill: "HTML", rating: 4 },
      { skill: "CSS", rating: 4 },
      { skill: "Python", rating: 3 },
      { skill: "TypeScript", rating: 3 },
      { skill: "React", rating: 3 },
      { skill: "C++", rating: 2 },
    ],
    descriptions: [
      "Tech: React Hooks, GraphQL, Node.js, SQL, Postgres, NoSql, Redis, REST API, Git",
      "Soft: Teamwork, Creative Problem Solving, Communication, Learning Mindset, Agile",
    ],
  },
  custom: {
    description: "**Additional Information:**\n\n**Languages:**\n- English (Native)\n- Spanish (Fluent)\n- French (Conversational)\n\n**Certifications:**\n- [AWS Certified Solutions Architect](https://aws.amazon.com/certification/)\n- Google Cloud Professional Developer\n\n**Volunteer Work:**\n- Code mentor at local coding bootcamp\n- Open source contributor to React ecosystem",
  },
};

export const START_HOME_RESUME: Resume = {
  profile: deepClone(initialProfile),
  workExperiences: END_HOME_RESUME.workExperiences.map(() =>
    deepClone(initialWorkExperience)
  ),
  educations: [deepClone(initialEducation)],
  projects: [deepClone(initialProject)],
  skills: {
    featuredSkills: END_HOME_RESUME.skills.featuredSkills.map((item) => ({
      skill: "",
      rating: item.rating,
    })),
    descriptions: [],
  },
  custom: {
    description: "**Additional Information:**\n\n**Languages:**\n- English (Native)\n- Spanish (Fluent)\n- French (Conversational)\n\n**Certifications:**\n- [AWS Certified Solutions Architect](https://aws.amazon.com/certification/)\n- Google Cloud Professional Developer\n\n**Volunteer Work:**\n- Code mentor at local coding bootcamp\n- Open source contributor to React ecosystem",
  },
};
