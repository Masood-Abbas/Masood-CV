import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowDown,
  Download,
  Github,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  GraduationCap,
  Briefcase,
  Calendar,
  ExternalLink,
  Users,
  Code2,
  Server,
  Wrench,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Layout from "@/components/layout/Layout";
import SectionHeading from "@/components/ui/SectionHeading";
import { useToast } from "@/hooks/use-toast";
import { Suspense, lazy } from "react";

const Interactive3DBackground = lazy(() => import("@/components/3d/Interactive3DBackground"));

const aboutDetails = [
  { icon: MapPin, label: "Location", value: "Lahore, Punjab" },
  { icon: Mail, label: "Email", value: "masoodabbas421@gmail.com" },
  { icon: Phone, label: "Phone", value: "0304 4606847" },
  { icon: GraduationCap, label: "Degree", value: "BS in Information Technology" },
];

const experiences = [
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

const projects = [
  {
    title: "E-commerce Website",
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
    githubFrontend: "https://github.com/Masood-Abbas/ecommerce-frontend.git",
    githubBackend: "https://github.com/Masood-Abbas/ecommerce-backend.git",
    icon: ExternalLink,
  },
  {
    title: "Social Media App",
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
    icon: Users,
  },
];

const skillCategories = [
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

const contactInfo = [
  { icon: Mail, label: "Email", value: "masoodabbas421@gmail.com", href: "mailto:masoodabbas421@gmail.com" },
  { icon: Phone, label: "Phone", value: "0304 4606847", href: "tel:+923044606847" },
  { icon: MapPin, label: "Location", value: "Lahore, Punjab", href: null },
];

const socialLinks = [
  { icon: Github, label: "GitHub", href: "https://github.com/Masood-Abbas" },
  { icon: Linkedin, label: "LinkedIn", href: "https://linkedin.com/in/masood-abbas" },
];

const contactSchema = z.object({
  name: z.string().trim().min(1, { message: "Please enter your name" }).max(100, { message: "Name must be less than 100 characters" }),
  email: z.string().trim().email({ message: "Please enter a valid email address" }).max(255, { message: "Email must be less than 255 characters" }),
  message: z.string().trim().min(1, { message: "Please enter a message" }).max(5000, { message: "Message must be less than 5000 characters" }),
});

const Home = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    const parsed = contactSchema.safeParse(formData);
    if (!parsed.success) {
      toast({
        variant: "destructive",
        title: "Please check the form",
        description: parsed.error.errors[0].message,
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { data, error } = await supabase.functions.invoke("submit-contact", {
        body: parsed.data,
      });
      if (error || (data && data.error)) throw new Error(error?.message ?? data.error);

      toast({ title: "Thank you! Your message has been sent successfully." });
      setFormData({ name: "", email: "", message: "" });
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Message could not be sent",
        description: "Something went wrong. Please try again in a moment.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      {/* Hero */}
      <section id="home" className="min-h-[calc(100vh-4rem)] flex items-center justify-center relative overflow-hidden">
        <Suspense fallback={<div className="absolute inset-0 bg-gradient-to-b from-background to-card" />}>
          <Interactive3DBackground />
        </Suspense>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 border border-primary/20 backdrop-blur-sm">
                MERN Stack Developer
              </span>
            </motion.div>

            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
              Hi, I'm <span className="gradient-text">Masood Abbas</span>
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-4">
              I build efficient, user-friendly web applications with modern technologies. Passionate about creating seamless digital experiences.
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.25 }} className="flex flex-wrap justify-center gap-3 mb-8">
              {["React.js", "Node.js", "MongoDB", "Express.js", "TypeScript"].map((tech) => (
                <span key={tech} className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm border border-primary/20 backdrop-blur-sm">
                  {tech}
                </span>
              ))}
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <a href="#contact">
                <Button size="lg" className="gap-2 glow-box">Get In Touch</Button>
              </a>
              <a href="/Masood_Abbas.pdf" download="Masood_Abbas.pdf">
                <Button size="lg" variant="outline" className="gap-2 backdrop-blur-sm">
                  <Download className="h-4 w-4" />
                  Download CV
                </Button>
              </a>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.4 }} className="flex items-center justify-center gap-6">
              <a href="https://github.com/Masood-Abbas" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors p-2" aria-label="GitHub Profile">
                <Github className="h-6 w-6" />
              </a>
              <a href="https://linkedin.com/in/masood-abbas" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors p-2" aria-label="LinkedIn Profile">
                <Linkedin className="h-6 w-6" />
              </a>
              <a href="mailto:masoodabbas421@gmail.com" className="text-muted-foreground hover:text-primary transition-colors p-2" aria-label="Email Contact">
                <Mail className="h-6 w-6" />
              </a>
            </motion.div>
          </div>
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.8 }} className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
          <a href="#about" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Scroll to About section">
            <ArrowDown className="h-6 w-6 animate-bounce" />
          </a>
        </motion.div>
      </section>

      {/* About */}
      <section id="about" className="py-20 relative overflow-hidden">
        <Suspense fallback={<div className="absolute inset-0 bg-gradient-to-b from-background to-card" />}>
          <Interactive3DBackground />
        </Suspense>
        <div className="container mx-auto px-4 relative z-10">
          <SectionHeading title="About Me" subtitle="Get to know more about my background and expertise" />
          <div className="max-w-4xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="glass-card rounded-2xl p-8 mb-8">
              <h3 className="text-2xl font-semibold mb-4">Who I Am</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                I am a passionate and dedicated MERN stack developer with a strong foundation in modern web technologies. With expertise in HTML5, CSS3, JavaScript (ES6), Node.js, Express.js, MongoDB, and React.js, I specialize in building scalable, high-performance web applications that deliver exceptional user experiences.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                My approach combines clean code practices with innovative problem-solving to create solutions that are both technically robust and user-friendly. I have hands-on experience developing full-stack applications, RESTful APIs, and real-time features using WebSockets and modern authentication systems.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Committed to continuous learning and staying updated with the latest industry trends, I thrive in collaborative environments where I can contribute to meaningful projects and grow alongside talented teams.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {aboutDetails.map((detail, index) => (
                <motion.div key={detail.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: index * 0.1 }} className="glass-card rounded-xl p-6 flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-primary/10 text-primary">
                    <detail.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{detail.label}</p>
                    <p className="font-medium">{detail.value}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.3 }} className="glass-card rounded-2xl p-8 mt-8">
              <h3 className="text-2xl font-semibold mb-4 flex items-center gap-3">
                <GraduationCap className="h-6 w-6 text-primary" />
                Education
              </h3>
              <div className="space-y-6">
                <div className="border-l-2 border-primary/30 pl-6">
                  <h4 className="text-lg font-medium">Bachelor of Science in Information Technology</h4>
                  <p className="text-muted-foreground">University of the Punjab, Lahore</p>
                  <span className="text-sm text-primary">Graduated 2024</span>
                </div>
                <div className="border-l-2 border-primary/30 pl-6">
                  <h4 className="text-lg font-medium">FSC (Pre-Engineering)</h4>
                  <p className="text-muted-foreground">Unique Group of Institutions</p>
                  <span className="text-sm text-primary">Completed 2019</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Experience */}
      <section id="experience" className="py-20 relative overflow-hidden">
        <Suspense fallback={<div className="absolute inset-0 bg-gradient-to-b from-background to-card" />}>
          <Interactive3DBackground />
        </Suspense>
        <div className="container mx-auto px-4 relative z-10">
          <SectionHeading title="Experience" subtitle="My professional journey and career highlights" />
          <div className="max-w-3xl mx-auto">
            <div className="relative">
              <div className="absolute left-0 md:left-1/2 transform md:-translate-x-px h-full w-0.5 bg-border" />
              {experiences.map((exp, index) => (
                <motion.div key={index} initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.2 }} className={`relative mb-12 md:w-1/2 ${index % 2 === 0 ? "md:pr-12 md:ml-0" : "md:pl-12 md:ml-auto"}`}>
                  <div className={`absolute top-0 w-4 h-4 rounded-full bg-primary glow-box ${index % 2 === 0 ? "left-0 md:left-auto md:-right-2" : "left-0 md:-left-2"} transform -translate-x-1/2 md:translate-x-0`} />
                  <div className="ml-8 md:ml-0 glass-card rounded-2xl p-6">
                    <div className="flex items-center gap-2 text-primary mb-2">
                      <Briefcase className="h-4 w-4" />
                      <span className="text-sm font-medium">{exp.company}</span>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{exp.title}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                      <Calendar className="h-4 w-4" />
                      <span>{exp.period}</span>
                    </div>
                    <ul className="space-y-2">
                      {exp.responsibilities.map((resp, i) => (
                        <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-primary mt-1.5">•</span>
                          {resp}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Projects */}
      <section id="projects" className="py-20 relative overflow-hidden">
        <Suspense fallback={<div className="absolute inset-0 bg-gradient-to-b from-background to-card" />}>
          <Interactive3DBackground />
        </Suspense>
        <div className="container mx-auto px-4 relative z-10">
          <SectionHeading title="Projects" subtitle="Featured work showcasing my development expertise" />
          <div className="max-w-4xl mx-auto space-y-8">
            {projects.map((project, index) => (
              <motion.div key={index} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="glass-card rounded-2xl overflow-hidden">
                <div className="p-8">
                  <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
                    <div className="flex items-center gap-4">
                      <div className="p-4 rounded-xl bg-primary/10 text-primary">
                        <project.icon className="h-8 w-8" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold">{project.title}</h3>
                        <p className="text-muted-foreground">Full Stack Application</p>
                      </div>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      {project.github && (
                        <a href={project.github} target="_blank" rel="noopener noreferrer">
                          <Button variant="outline" size="sm" className="gap-2"><Github className="h-4 w-4" />View Code</Button>
                        </a>
                      )}
                      {project.githubFrontend && (
                        <a href={project.githubFrontend} target="_blank" rel="noopener noreferrer">
                          <Button variant="outline" size="sm" className="gap-2"><Github className="h-4 w-4" />Frontend</Button>
                        </a>
                      )}
                      {project.githubBackend && (
                        <a href={project.githubBackend} target="_blank" rel="noopener noreferrer">
                          <Button variant="outline" size="sm" className="gap-2"><Github className="h-4 w-4" />Backend</Button>
                        </a>
                      )}
                    </div>
                  </div>
                  <p className="text-muted-foreground mb-6">{project.description}</p>
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">Key Features</h4>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {project.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <span className="text-primary mt-0.5">✓</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">Technologies Used</h4>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech) => (
                        <span key={tech} className="skill-badge text-xs">{tech}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Skills */}
      <section id="skills" className="py-20 relative overflow-hidden">
        <Suspense fallback={<div className="absolute inset-0 bg-gradient-to-b from-background to-card" />}>
          <Interactive3DBackground />
        </Suspense>
        <div className="container mx-auto px-4 relative z-10">
          <SectionHeading title="Skills" subtitle="Technologies and tools I work with" />
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
            {skillCategories.map((category, index) => (
              <motion.div key={category.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.1 }} className="glass-card rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 rounded-lg bg-primary/10 text-primary">
                    <category.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold">{category.title}</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {category.skills.map((skill, i) => (
                    <motion.span key={skill} initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.3, delay: index * 0.1 + i * 0.05 }} className="skill-badge">
                      {skill}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-20 relative overflow-hidden">
        <Suspense fallback={<div className="absolute inset-0 bg-gradient-to-b from-background to-card" />}>
          <Interactive3DBackground />
        </Suspense>
        <div className="container mx-auto px-4 relative z-10">
          <SectionHeading title="Get In Touch" subtitle="Have a project in mind? Let's work together!" />
          <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
              <h3 className="text-2xl font-semibold mb-6">Contact Information</h3>
              <p className="text-muted-foreground mb-8">Feel free to reach out to me for any opportunities, collaborations, or just to say hello!</p>
              <div className="space-y-4 mb-8">
                {contactInfo.map((info) => (
                  <div key={info.label} className="flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-primary/10 text-primary">
                      <info.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{info.label}</p>
                      {info.href ? (
                        <a href={info.href} className="font-medium hover:text-primary transition-colors">{info.value}</a>
                      ) : (
                        <p className="font-medium">{info.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div>
                <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Connect with me</h4>
                <div className="flex gap-3">
                  {socialLinks.map((link) => (
                    <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer" className="p-3 rounded-lg bg-secondary hover:bg-primary/10 hover:text-primary transition-colors" aria-label={link.label}>
                      <link.icon className="h-5 w-5" />
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
              <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-8">
                <h3 className="text-2xl font-semibold mb-6">Send a Message</h3>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-2">Your Name</label>
                    <Input id="name" type="text" placeholder="John Doe" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required className="bg-secondary/50 border-border" />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2">Your Email</label>
                    <Input id="email" type="email" placeholder="john@example.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required className="bg-secondary/50 border-border" />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium mb-2">Message</label>
                    <Textarea id="message" placeholder="Your message..." rows={5} value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} required className="bg-secondary/50 border-border resize-none" />
                  </div>
                  <Button type="submit" className="w-full gap-2 glow-box">
                    <Send className="h-4 w-4" />
                    Send Message
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Home;
