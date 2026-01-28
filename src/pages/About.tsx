import { motion } from "framer-motion";
import { MapPin, Mail, Phone, GraduationCap } from "lucide-react";
import Layout from "@/components/layout/Layout";
import SectionHeading from "@/components/ui/SectionHeading";
import { Suspense, lazy } from "react";

const Interactive3DBackground = lazy(() => import("@/components/3d/Interactive3DBackground"));

const About = () => {
  const details = [
    { icon: MapPin, label: "Location", value: "Lahore, Punjab" },
    { icon: Mail, label: "Email", value: "masoodabbas421@gmail.com" },
    { icon: Phone, label: "Phone", value: "0304 4606847" },
    { icon: GraduationCap, label: "Degree", value: "BS in Information Technology" },
  ];

  return (
    <Layout>
      <section className="py-20 min-h-screen relative overflow-hidden">
        {/* Interactive 3D Background */}
        <Suspense fallback={<div className="absolute inset-0 bg-gradient-to-b from-background to-card" />}>
          <Interactive3DBackground />
        </Suspense>

        <div className="container mx-auto px-4 relative z-10">
          <SectionHeading
            title="About Me"
            subtitle="Get to know more about my background and expertise"
          />

          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="glass-card rounded-2xl p-8 mb-8"
            >
              <h3 className="text-2xl font-semibold mb-4">Who I Am</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                I am a passionate and dedicated MERN stack developer with a strong foundation in modern web technologies. 
                With expertise in HTML5, CSS3, JavaScript (ES6), Node.js, Express.js, MongoDB, and React.js, I specialize 
                in building scalable, high-performance web applications that deliver exceptional user experiences.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                My approach combines clean code practices with innovative problem-solving to create solutions that are 
                both technically robust and user-friendly. I have hands-on experience developing full-stack applications, 
                RESTful APIs, and real-time features using WebSockets and modern authentication systems.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Committed to continuous learning and staying updated with the latest industry trends, I thrive in 
                collaborative environments where I can contribute to meaningful projects and grow alongside talented teams. 
                My goal is to leverage technology to solve complex problems and create impactful digital solutions.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {details.map((detail, index) => (
                <motion.div
                  key={detail.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="glass-card rounded-xl p-6 flex items-center gap-4"
                >
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

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="glass-card rounded-2xl p-8 mt-8"
            >
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
    </Layout>
  );
};

export default About;
