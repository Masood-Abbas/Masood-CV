import { motion } from "framer-motion";
import { Code2, Server, Wrench } from "lucide-react";
import Layout from "@/components/layout/Layout";
import SectionHeading from "@/components/ui/SectionHeading";
import { Suspense, lazy } from "react";

const FloatingShape = lazy(() => import("@/components/3d/FloatingShape"));

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

const Skills = () => {
  return (
    <Layout>
      <section className="py-20 min-h-screen relative overflow-hidden">
        {/* 3D Background */}
        <Suspense fallback={<div className="absolute inset-0 bg-gradient-to-b from-background to-card" />}>
          <FloatingShape />
        </Suspense>

        <div className="container mx-auto px-4 relative z-10">
          <SectionHeading
            title="Skills"
            subtitle="Technologies and tools I work with"
          />

          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
            {skillCategories.map((category, index) => (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass-card rounded-2xl p-6"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 rounded-lg bg-primary/10 text-primary">
                    <category.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold">{category.title}</h3>
                </div>

                <div className="flex flex-wrap gap-2">
                  {category.skills.map((skill, i) => (
                    <motion.span
                      key={skill}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: index * 0.1 + i * 0.05 }}
                      className="skill-badge"
                    >
                      {skill}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="max-w-3xl mx-auto mt-12"
          >
            <div className="glass-card rounded-2xl p-8 text-center">
              <h3 className="text-2xl font-semibold mb-4">MERN Stack Expertise</h3>
              <p className="text-muted-foreground mb-6">
                Specialized in building full-stack web applications using MongoDB, Express.js, 
                React.js, and Node.js. From responsive frontend interfaces to scalable backend 
                APIs, I deliver complete solutions.
              </p>
              <div className="flex justify-center gap-4 flex-wrap">
                {["MongoDB", "Express.js", "React.js", "Node.js"].map((tech) => (
                  <span
                    key={tech}
                    className="px-6 py-3 rounded-xl bg-primary/10 text-primary font-medium border border-primary/20"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Skills;
