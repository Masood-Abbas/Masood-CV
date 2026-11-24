import { useEffect, useState, Suspense, lazy } from "react";
import { motion } from "framer-motion";
import {
  ArrowDown,
  Briefcase,
  Calendar,
  Download,
  ExternalLink,
  Github,
  GraduationCap,
  Loader2,
  Send,
  Users,
} from "lucide-react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Layout from "@/components/layout/Layout";
import SectionHeading from "@/components/ui/SectionHeading";
import { useToast } from "@/hooks/use-toast";
import { usePortfolio } from "@/data/PortfolioContext";
import { getIcon } from "@/data/icons";

const Interactive3DBackground = lazy(() => import("@/components/3d/Interactive3DBackground"));

const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: "Please enter your name" })
    .max(100, { message: "Name must be less than 100 characters" }),
  email: z
    .string()
    .trim()
    .email({ message: "Please enter a valid email address" })
    .max(255, { message: "Email must be less than 255 characters" }),
  message: z
    .string()
    .trim()
    .min(1, { message: "Please enter a message" })
    .max(5000, { message: "Message must be less than 5000 characters" }),
});

const Home = () => {
  const { toast } = useToast();
  const { data, addMessage } = usePortfolio();
  const { site, hero, about, sections, education, experiences, projects, skillCategories, socialLinks, contactInfo, settings } =
    data;

  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reflect admin-managed content in the browser tab and meta description.
  useEffect(() => {
    if (site.siteTitle) document.title = site.siteTitle;
    if (site.metaDescription) {
      let meta = document.head.querySelector<HTMLMetaElement>('meta[name="description"]');
      if (!meta) {
        meta = document.createElement("meta");
        meta.name = "description";
        document.head.appendChild(meta);
      }
      meta.content = site.metaDescription;
    }
  }, [site.siteTitle, site.metaDescription]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
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

    const values = parsed.data as { name: string; email: string; message: string };

    setIsSubmitting(true);
    try {
      const endpoint = settings.formEndpoint.trim();
      if (endpoint) {
        const response = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({ ...values, _subject: `Portfolio message from ${values.name}` }),
        });
        if (!response.ok) throw new Error("The form service rejected the message");
      } else {
        // No backend configured: keep the message in this browser's inbox.
        addMessage(values);
      }

      toast({ title: "Thank you! Your message has been sent successfully." });
      setFormData({ name: "", email: "", message: "" });
    } catch {
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
      <section
        id="home"
        className="min-h-[calc(100vh-4rem)] flex items-center justify-center relative overflow-hidden"
      >
        <Suspense fallback={<div className="absolute inset-0 bg-gradient-to-b from-background to-card" />}>
          <Interactive3DBackground />
        </Suspense>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {hero.showBadge && hero.badge && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 border border-primary/20 backdrop-blur-sm">
                  {hero.badge}
                </span>
              </motion.div>
            )}

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6"
            >
              Hi, I'm <span className="gradient-text">{hero.name}</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-4"
            >
              {hero.description}
            </motion.p>

            {hero.showTechTags && hero.techTags.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.25 }}
                className="flex flex-wrap justify-center gap-3 mb-8"
              >
                {hero.techTags.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm border border-primary/20 backdrop-blur-sm"
                  >
                    {tech}
                  </span>
                ))}
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
            >
              {hero.ctaText && (
                <a href={hero.ctaHref || "#contact"}>
                  <Button size="lg" className="gap-2 glow-box">
                    {hero.ctaText}
                  </Button>
                </a>
              )}
              {hero.showSecondaryCta && hero.secondaryCtaText && (
                <a
                  href={hero.secondaryCtaHref || site.cvPath}
                  download={
                    (hero.secondaryCtaHref || site.cvPath).endsWith(".pdf")
                      ? (hero.secondaryCtaHref || site.cvPath).split("/").pop()
                      : undefined
                  }
                >
                  <Button size="lg" variant="outline" className="gap-2 backdrop-blur-sm">
                    <Download className="h-4 w-4" />
                    {hero.secondaryCtaText}
                  </Button>
                </a>
              )}
            </motion.div>

            {hero.showSocials && socialLinks.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex items-center justify-center gap-6"
              >
                {socialLinks.map((link) => {
                  const Icon = getIcon(link.icon);
                  return (
                    <a
                      key={`${link.label}-${link.href}`}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary transition-colors p-2"
                      aria-label={link.label}
                    >
                      <Icon className="h-6 w-6" />
                    </a>
                  );
                })}
              </motion.div>
            )}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        >
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
          <SectionHeading title={sections.about.title} subtitle={sections.about.subtitle} />
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="glass-card rounded-2xl p-8 mb-8"
            >
              {about.cardTitle && <h3 className="text-2xl font-semibold mb-4">{about.cardTitle}</h3>}
              {about.paragraphs.map((paragraph, index) => (
                <p
                  key={index}
                  className={`text-muted-foreground leading-relaxed ${
                    index < about.paragraphs.length - 1 ? "mb-4" : ""
                  }`}
                >
                  {paragraph}
                </p>
              ))}
            </motion.div>

            {about.details.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {about.details.map((detail, index) => {
                  const Icon = getIcon(detail.icon);
                  return (
                    <motion.div
                      key={`${detail.label}-${index}`}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className="glass-card rounded-xl p-6 flex items-center gap-4"
                    >
                      <div className="p-3 rounded-lg bg-primary/10 text-primary">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">{detail.label}</p>
                        <p className="font-medium">{detail.value}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}

            {education.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="glass-card rounded-2xl p-8 mt-8"
              >
                <h3 className="text-2xl font-semibold mb-4 flex items-center gap-3">
                  <GraduationCap className="h-6 w-6 text-primary" />
                  {about.educationTitle}
                </h3>
                <div className="space-y-6">
                  {education.map((entry, index) => (
                    <div key={`${entry.degree}-${index}`} className="border-l-2 border-primary/30 pl-6">
                      <h4 className="text-lg font-medium">{entry.degree}</h4>
                      <p className="text-muted-foreground">{entry.institution}</p>
                      {entry.period && <span className="text-sm text-primary">{entry.period}</span>}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Experience */}
      {experiences.length > 0 && (
        <section id="experience" className="py-20 relative overflow-hidden">
          <Suspense fallback={<div className="absolute inset-0 bg-gradient-to-b from-background to-card" />}>
            <Interactive3DBackground />
          </Suspense>
          <div className="container mx-auto px-4 relative z-10">
            <SectionHeading title={sections.experience.title} subtitle={sections.experience.subtitle} />
            <div className="max-w-3xl mx-auto">
              <div className="relative">
                <div className="absolute left-0 md:left-1/2 transform md:-translate-x-px h-full w-0.5 bg-border" />
                {experiences.map((experience, index) => (
                  <motion.div
                    key={`${experience.title}-${index}`}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.2 }}
                    className={`relative mb-12 md:w-1/2 ${
                      index % 2 === 0 ? "md:pr-12 md:ml-0" : "md:pl-12 md:ml-auto"
                    }`}
                  >
                    <div
                      className={`absolute top-0 w-4 h-4 rounded-full bg-primary glow-box ${
                        index % 2 === 0 ? "left-0 md:left-auto md:-right-2" : "left-0 md:-left-2"
                      } transform -translate-x-1/2 md:translate-x-0`}
                    />
                    <div className="ml-8 md:ml-0 glass-card rounded-2xl p-6">
                      {experience.company && (
                        <div className="flex items-center gap-2 text-primary mb-2">
                          <Briefcase className="h-4 w-4" />
                          <span className="text-sm font-medium">{experience.company}</span>
                        </div>
                      )}
                      <h3 className="text-xl font-semibold mb-2">{experience.title}</h3>
                      {experience.period && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                          <Calendar className="h-4 w-4" />
                          <span>{experience.period}</span>
                        </div>
                      )}
                      {experience.responsibilities.length > 0 && (
                        <ul className="space-y-2">
                          {experience.responsibilities.map((responsibility, responsibilityIndex) => (
                            <li
                              key={responsibilityIndex}
                              className="text-sm text-muted-foreground flex items-start gap-2"
                            >
                              <span className="text-primary mt-1.5">•</span>
                              {responsibility}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <section id="projects" className="py-20 relative overflow-hidden">
          <Suspense fallback={<div className="absolute inset-0 bg-gradient-to-b from-background to-card" />}>
            <Interactive3DBackground />
          </Suspense>
          <div className="container mx-auto px-4 relative z-10">
            <SectionHeading title={sections.projects.title} subtitle={sections.projects.subtitle} />
            <div className="max-w-4xl mx-auto space-y-8">
              {projects.map((project, index) => {
                const ProjectIcon = index % 2 === 0 ? ExternalLink : Users;
                return (
                  <motion.div
                    key={`${project.title}-${index}`}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="glass-card rounded-2xl overflow-hidden"
                  >
                    <div className="p-8">
                      <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
                        <div className="flex items-center gap-4">
                          <div className="p-4 rounded-xl bg-primary/10 text-primary">
                            <ProjectIcon className="h-8 w-8" />
                          </div>
                          <div>
                            <h3 className="text-2xl font-bold">{project.title}</h3>
                            <p className="text-muted-foreground">{project.category}</p>
                          </div>
                        </div>
                        <div className="flex gap-2 flex-wrap">
                          {project.github && !project.githubFrontend && !project.githubBackend && (
                            <a href={project.github} target="_blank" rel="noopener noreferrer">
                              <Button variant="outline" size="sm" className="gap-2">
                                <Github className="h-4 w-4" />
                                View Code
                              </Button>
                            </a>
                          )}
                          {project.githubFrontend && (
                            <a href={project.githubFrontend} target="_blank" rel="noopener noreferrer">
                              <Button variant="outline" size="sm" className="gap-2">
                                <Github className="h-4 w-4" />
                                Frontend
                              </Button>
                            </a>
                          )}
                          {project.githubBackend && (
                            <a href={project.githubBackend} target="_blank" rel="noopener noreferrer">
                              <Button variant="outline" size="sm" className="gap-2">
                                <Github className="h-4 w-4" />
                                Backend
                              </Button>
                            </a>
                          )}
                          {project.github && (project.githubFrontend || project.githubBackend) && (
                            <a href={project.github} target="_blank" rel="noopener noreferrer">
                              <Button variant="outline" size="sm" className="gap-2">
                                <Github className="h-4 w-4" />
                                All code
                              </Button>
                            </a>
                          )}
                        </div>
                      </div>
                      {project.description && (
                        <p className="text-muted-foreground mb-6">{project.description}</p>
                      )}
                      {project.features.length > 0 && (
                        <div className="mb-6">
                          <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                            Key Features
                          </h4>
                          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {project.features.map((feature, featureIndex) => (
                              <li key={featureIndex} className="flex items-start gap-2 text-sm">
                                <span className="text-primary mt-0.5">✓</span>
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {project.technologies.length > 0 && (
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
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Skills */}
      {skillCategories.length > 0 && (
        <section id="skills" className="py-20 relative overflow-hidden">
          <Suspense fallback={<div className="absolute inset-0 bg-gradient-to-b from-background to-card" />}>
            <Interactive3DBackground />
          </Suspense>
          <div className="container mx-auto px-4 relative z-10">
            <SectionHeading title={sections.skills.title} subtitle={sections.skills.subtitle} />
            <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
              {skillCategories.map((category, index) => {
                const Icon = getIcon(category.icon);
                return (
                  <motion.div
                    key={`${category.title}-${index}`}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="glass-card rounded-2xl p-6"
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-3 rounded-lg bg-primary/10 text-primary">
                        <Icon className="h-6 w-6" />
                      </div>
                      <h3 className="text-xl font-semibold">{category.title}</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {category.skills.map((skill, skillIndex) => (
                        <motion.span
                          key={`${skill}-${skillIndex}`}
                          initial={{ opacity: 0, scale: 0.8 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.3, delay: index * 0.1 + skillIndex * 0.05 }}
                          className="skill-badge"
                        >
                          {skill}
                        </motion.span>
                      ))}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Contact */}
      <section id="contact" className="py-20 relative overflow-hidden">
        <Suspense fallback={<div className="absolute inset-0 bg-gradient-to-b from-background to-card" />}>
          <Interactive3DBackground />
        </Suspense>
        <div className="container mx-auto px-4 relative z-10">
          <SectionHeading title={sections.contact.title} subtitle={sections.contact.subtitle} />
          <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="text-2xl font-semibold mb-6">Contact Information</h3>
              {sections.contact.intro && (
                <p className="text-muted-foreground mb-8">{sections.contact.intro}</p>
              )}
              <div className="space-y-4 mb-8">
                {contactInfo.map((info, index) => {
                  const Icon = getIcon(info.icon);
                  return (
                    <div key={`${info.label}-${index}`} className="flex items-center gap-4">
                      <div className="p-3 rounded-lg bg-primary/10 text-primary">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">{info.label}</p>
                        {info.href ? (
                          <a href={info.href} className="font-medium hover:text-primary transition-colors">
                            {info.value}
                          </a>
                        ) : (
                          <p className="font-medium">{info.value}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              {socialLinks.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                    Connect with me
                  </h4>
                  <div className="flex gap-3">
                    {socialLinks.map((link) => {
                      const Icon = getIcon(link.icon);
                      return (
                        <a
                          key={`${link.label}-${link.href}`}
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-3 rounded-lg bg-secondary hover:bg-primary/10 hover:text-primary transition-colors"
                          aria-label={link.label}
                        >
                          <Icon className="h-5 w-5" />
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-8">
                <h3 className="text-2xl font-semibold mb-6">Send a Message</h3>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-2">
                      Your Name
                    </label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(event) => setFormData({ ...formData, name: event.target.value })}
                      required
                      className="bg-secondary/50 border-border"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2">
                      Your Email
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={(event) => setFormData({ ...formData, email: event.target.value })}
                      required
                      className="bg-secondary/50 border-border"
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium mb-2">
                      Message
                    </label>
                    <Textarea
                      id="message"
                      placeholder="Your message..."
                      rows={5}
                      value={formData.message}
                      onChange={(event) => setFormData({ ...formData, message: event.target.value })}
                      required
                      className="bg-secondary/50 border-border resize-none"
                    />
                  </div>
                  <Button type="submit" disabled={isSubmitting} className="w-full gap-2 glow-box">
                    {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    {isSubmitting ? "Sending..." : "Send Message"}
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
