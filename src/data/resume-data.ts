import { Github, Instagram, Linkedin } from "lucide-react";

export const RESUME_DATA = {
  name: "Kent Liusudarso",
  initials: "KL",
  location: "South Tangerang, Indonesia, UTC+7",
  locationLink: "https://www.google.com/maps/place/South+Tangerang",
  about:
    "Final year student at Institut Teknologi Bandung majoring in Computer Science",
  summary:
    "As a final year student at Institut Teknologi Bandung, I have experience in building various types of applications, such as web, native mobile, even 3D video game. I am a fast learner and I am always looking for new challenges. Currently, I work mostly with React, Node.js, Golang, GCP, and K8s.",
  avatarUrl: "https://avatars.githubusercontent.com/u/71258048?v=4",
  personalWebsiteUrl: "https://kentliu.me",
  contact: {
    email: "kent.liusudarso@gmail.com",
    tel: "+6289630922739",
    social: [
      {
        name: "GitHub",
        url: "https://github.com/kentlius",
        icon: Github,
      },
      {
        name: "LinkedIn",
        url: "https://www.linkedin.com/in/kentliusudarso/",
        icon: Linkedin,
      },
      {
        name: "Instagram",
        url: "https://www.instagram.com/kent_lius/",
        icon: Instagram,
      },
    ],
  },
  education: [
    {
      school: "Institut Teknologi Bandung",
      degree: "Bachelor's Degree in Computer Science",
      start: "2020",
      end: "2024",
    },
  ],
  work: [
    {
      company: "PT Bank Central Asia Tbk (BCA)",
      link: "https://www.bca.co.id/",
      badges: ["Internship"],
      title: "Application Developer",
      start: "Jun. 2023",
      end: "Nov. 2023",
      description:
        "Developed dashboard for monitoring ATMs hardware inventory, created frontend prototype for machines, built an API to help integrate applications, developed agents to monitor ATM sensors and software inventory.",
    },
    {
      company: "School of Electrical Engineering and Informatics ITB",
      link: "https://stei.itb.ac.id/",
      badges: ["Part-Time"],
      title: "System Administrator",
      start: "Sep. 2022",
      end: "Present",
      description:
        "Maintaining hundreds of computers for labs and events using Ansible, setup network and proxy server for STEI ITB, worked on Moodle load testing for thousands users using JMeter",
    },
    {
      company: "PT Indojaya Mitra Sarana (IMS Automation)",
      link: "https://ims-automation.com/",
      badges: ["Internship"],
      title: "Software Engineer",
      start: "Jun. 2022",
      end: "Aug. 2022",
      description:
        "Built EV Charging App for embedded device, developed OCPP Server for controlling and testing EV Charger, implemented payment gateway by utilizing Xendit API",
    },
    {
      company: "Institut Teknologi Bandung",
      link: "https://itb.ac.id/",
      badges: ["Part Time"],
      title: "Introduction to Computation Lab Assistant	",
      start: "Oct. 2021",
      end: "Dec. 2021",
      description:
        "Assisted 60 students to teach them basic computation skills, evaluated their code by checking each program and giving comments",
    },
  ],
  skills: [
    "JavaScript/TypeScript",
    "React/Next.js",
    "Node.js",
    "Golang",
    "C/C++",
    "Java",
    "Android",
    "Python",
    "SQL/NoSQL",
    "Linux",
    "Git",
    "GCP",
    "CI/CD",
    "Kubernetes",
    "Ansible",
    "JMeter",
    "WPF",
    "WebGL",
  ],
  awards: [
    {
      title: "2nd Place, Digihatch: Dexa Group Hackathon",
      techStack: ["Side Project", "TypeScript", "Next.js", "Vite"],
      description:
        "Developed an intelligent transportation management system for pharmaceutical drugs distribution.",
      link: {
        label: "Digihatch: Dexa Group Hackathon",
        href: "https://sites.google.com/dexa-medica.com/digihatch/",
      },
    },
  ],
  projects: [
    {
      title: "2D & 3D CAD",
      techStack: ["Side Project", "HTML", "CSS", "JavaScript", "WebGL"],
      description:
        "Render 2D and 3D models on the web using pure WebGL with functional tools such as transform, edit, save/load, and camera adjustments.",
      link: {
        label: "github.com",
        href: "https://github.com/kentlius/3d-hollow-object",
      },
    },
    {
      title: "Kentang",
      techStack: ["Side Project", "Astro", "MDX"],
      description:
        "My personal website and blog. Built with Astro and Tailwind CSS.",
      link: {
        label: "kentliu.me",
        href: "https://kentliu.me/",
      },
    },
  ],
} as const;
