// ============================================================
//  PORTFOLIO DATA FILE
//  Edit this file to add or change anything on your website.
//  No database needed — save the file and the site updates.
// ============================================================

import {
  Github,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  GraduationCap,
  Code2,
  Server,
  Wrench,
} from "lucide-react";

// ---------- Site basics (shown in the header logo + CV button) ----------
export const site = {
  firstName: "Masood",
  lastName: "Abbas",
  // Path of your CV file inside the "public" folder
  cvPath: "/Masood_Abbas.pdf",
};

// ---------- Hero (top section) ----------
export const hero = {
  badge: "MERN Stack Developer",
  showBadge: true,
  name: "Masood Abbas",
  description:
    "I build efficient, user-friendly web applications with modern technologies. Passionate about creating seamless digital experiences.",
  techTags: ["React.js", "Node.js", "MongoDB", "Express.js", "TypeScript"],
  showTechTags: true,
  cta: { text: "Get In Touch", href: "#contact" },
  secondaryCta: { text: "Download CV", href: "/Masood_Abbas.pdf", show: true },
  showSocials: true,
};

// ---------- About Me ----------
export const about = {
  paragraphs: [
    "I am a passionate and dedicated MERN stack developer with a strong foundation in modern web technologies. With expertise in HTML5, CSS3, JavaScript (ES6), Node.js, Express.js, MongoDB, and React.js, I specialize in building scalable, high-performance web applications that deliver exceptional user experiences.",
    "My approach combines clean code practices with innovative problem-solving to create solutions that are both technically robust and user-friendly. I have hands-on experience developing full-stack applications, RESTful APIs, and real-time features using WebSockets and modern authentication systems.",
    "Committed to continuous learning and staying updated with the latest industry trends, I thrive in collaborative environments where I can contribute to meaningful projects and grow alongside talented teams.",
  ],
  details: [
    { icon: MapPin, label: "Location", value: "Lahore, Punjab" },
    { icon: Mail, label: "Email", value: "masoodabas421@gmail.com" },
    { icon: Phone, label: "Phone", value: "0304 4606847" },
    { icon: GraduationCap, label: "Degree", value: "BS in Information Technology" },
  ],
};

// ---------- Education (shown inside the About section) ----------
export const education = [
  {
    degree: "Bachelor of Science in Information Technology",
    institution: "University of the Punjab, Lahore",
    period: "Graduated 2024",
  },
  {
    degree: "FSC (Pre-Engineering)",
    institution: "Unique Group of Institutions",
    period: "Completed 2019",
  },
];

// ---------- Experience ----------
export const experiences = [
  {
    title: "Associate Software Engineer",
    company: "Sky IT Services",
    period: "December 2024 - September 2025",
    responsibilities: [
      "Developed SEO-optimized and fast-loading web applications",
      "Skilled in responsive web design and cross-browser compatibility",
      "Proficient in Node.js and Express.js for building scalable RESTful APIs",
      "Experience with MongoDB (Mongoose) and SQL databases for data storage and management",
      "Developed secure authentication & authorization using JWT",
    ],
  },
  {
    title: "Training Software Engineer",
    company: "SeeBiz PVT LTD",
    period: "January 2024 - July 2024",
    responsibilities: [
      "Completed comprehensive training in HTML, CSS, JavaScript (ES6), React.js, Node.js, Express.js, and MongoDB",
      "Applied skills in web development to design and develop responsive web pages",
      "Utilized Node.js and Express.js to build backend services and RESTful APIs",
      "Enhanced proficiency in advanced JavaScript and frontend frameworks",
      "Gained practical experience in integrating frontend and backend components",
    ],
  },
];

// ---------- Projects ----------
// github          -> single repo link (shows a "View Code" button)
// githubFrontend / githubBackend -> use these instead when the project
//                                   has separate frontend & backend repos
export const projects = [
  {
    title: "E-commerce Website",
    category: "Full Stack Application",
    description:
      "A complete e-commerce platform with product management, shopping cart, user authentication, and order processing capabilities.",
    features: [
      "Login with Google authentication",
      "Redux Toolkit for state management",
      "Product catalog with categories and filters",
      "Shopping cart and checkout system",
      "Order management and tracking",
      "Responsive design for all devices",
    ],
    technologies: ["MongoDB", "Express.js", "React.js", "Node.js", "Redux Toolkit", "Google OAuth", "JWT", "REST API"],
    github: null as string | null,
    githubFrontend: "https://github.com/Masood-Abbas/ecommerce-frontend.git",
    githubBackend: "https://github.com/Masood-Abbas/ecommerce-backend.git",
  },
  {
    title: "Social Media App",
    category: "Full Stack Application",
    description:
      "A full-featured social media application with real-time features including authentication, posts, likes, comments, and replies.",
    features: [
      "Authentication and authorization with JWT",
      "Secure user login and registration",
      "User roles and permissions management",
      "Real-time like, comment, and reply features using WebSockets",
      "Reusable React components with Context API",
    ],
    technologies: ["MongoDB", "Express.js", "React.js", "Node.js", "JWT", "WebSockets"],
    github: "https://github.com/Masood-Abbas/Social-Media-app.git",
    githubFrontend: null as string | null,
    githubBackend: null as string | null,
  },
];

// ---------- Skills ----------
export const skillCategories = [
  {
    title: "Frontend",
    icon: Code2,
    skills: ["HTML5", "CSS3", "JavaScript (ES6)", "React.js", "Redux Toolkit", "Responsive Design", "Bootstrap", "Tailwind CSS"],
  },
  {
    title: "Backend",
    icon: Server,
    skills: ["Node.js", "Express.js", "MongoDB", "RESTful APIs", "JWT Authentication", "Mongoose", "SQL"],
  },
  {
    title: "Tools & Technologies",
    icon: Wrench,
    skills: ["Git", "GitHub", "NPM", "VS Code", "Postman", "WebSockets"],
  },
];

// ---------- Contact section ----------
export const contactInfo = [
  { icon: Mail, label: "Email", value: "masoodabas421@gmail.com", href: "mailto:masoodabas421@gmail.com" },
  { icon: Phone, label: "Phone", value: "0304 4606847", href: "tel:+923044606847" },
  { icon: MapPin, label: "Location", value: "Lahore, Punjab", href: null as string | null },
];

// ---------- Social links (hero + contact section) ----------
export const socialLinks = [
  { icon: Github, label: "GitHub", href: "https://github.com/Masood-Abbas" },
  { icon: Linkedin, label: "LinkedIn", href: "https://linkedin.com/in/masood-abbas" },
];
