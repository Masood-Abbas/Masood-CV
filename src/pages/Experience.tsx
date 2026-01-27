import { motion } from "framer-motion";
import { Briefcase, Calendar } from "lucide-react";
import Layout from "@/components/layout/Layout";
import SectionHeading from "@/components/ui/SectionHeading";

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
    location: "Lahore",
    responsibilities: [
      "Completed comprehensive training in HTML, CSS, JavaScript (ES6), React.js, Node.js, Express.js, and MongoDB",
      "Applied skills in web development to design and develop responsive web pages",
      "Utilized Node.js and Express.js to build backend services and RESTful APIs",
      "Enhanced proficiency in advanced JavaScript and frontend frameworks",
      "Gained practical experience in integrating frontend and backend components",
    ],
  },
];

const Experience = () => {
  return (
    <Layout>
      <section className="py-20 min-h-screen">
        <div className="container mx-auto px-4">
          <SectionHeading
            title="Experience"
            subtitle="My professional journey and career highlights"
          />

          <div className="max-w-3xl mx-auto">
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-0 md:left-1/2 transform md:-translate-x-px h-full w-0.5 bg-border" />

              {experiences.map((exp, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  className={`relative mb-12 md:w-1/2 ${
                    index % 2 === 0 ? "md:pr-12 md:ml-0" : "md:pl-12 md:ml-auto"
                  }`}
                >
                  {/* Timeline dot */}
                  <div
                    className={`absolute top-0 w-4 h-4 rounded-full bg-primary glow-box ${
                      index % 2 === 0
                        ? "left-0 md:left-auto md:-right-2"
                        : "left-0 md:-left-2"
                    } transform -translate-x-1/2 md:translate-x-0`}
                  />

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
                        <li
                          key={i}
                          className="text-sm text-muted-foreground flex items-start gap-2"
                        >
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
    </Layout>
  );
};

export default Experience;
