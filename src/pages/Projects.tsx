import { motion } from "framer-motion";
import { ExternalLink, Github, Users } from "lucide-react";
import Layout from "@/components/layout/Layout";
import SectionHeading from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/button";
import { Suspense, lazy } from "react";

const Interactive3DBackground = lazy(() => import("@/components/3d/Interactive3DBackground"));

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

const Projects = () => {
  return (
    <Layout>
      <section className="py-20 min-h-screen relative overflow-hidden">
        {/* Interactive 3D Background */}
        <Suspense fallback={<div className="absolute inset-0 bg-gradient-to-b from-background to-card" />}>
          <Interactive3DBackground />
        </Suspense>

        <div className="container mx-auto px-4 relative z-10">
          <SectionHeading
            title="Projects"
            subtitle="Featured work showcasing my development expertise"
          />

          <div className="max-w-4xl mx-auto space-y-8">
            {projects.map((project, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="glass-card rounded-2xl overflow-hidden"
              >
                <div className="p-8">
                  <div className="flex items-start justify-between mb-6">
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
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button variant="outline" size="sm" className="gap-2">
                            <Github className="h-4 w-4" />
                            View Code
                          </Button>
                        </a>
                      )}
                      {project.githubFrontend && (
                        <a
                          href={project.githubFrontend}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button variant="outline" size="sm" className="gap-2">
                            <Github className="h-4 w-4" />
                            Frontend
                          </Button>
                        </a>
                      )}
                      {project.githubBackend && (
                        <a
                          href={project.githubBackend}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button variant="outline" size="sm" className="gap-2">
                            <Github className="h-4 w-4" />
                            Backend
                          </Button>
                        </a>
                      )}
                    </div>
                  </div>

                  <p className="text-muted-foreground mb-6">{project.description}</p>

                  <div className="mb-6">
                    <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                      Key Features
                    </h4>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {project.features.map((feature, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-sm"
                        >
                          <span className="text-primary mt-0.5">✓</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                      Technologies Used
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech) => (
                        <span key={tech} className="skill-badge text-xs">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-center mt-12"
            >
              <p className="text-muted-foreground mb-4">
                Want to see more of my work?
              </p>
              <a
                href="https://github.com/Masood-Abbas"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" className="gap-2">
                  <Github className="h-4 w-4" />
                  Visit My GitHub
                </Button>
              </a>
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Projects;
