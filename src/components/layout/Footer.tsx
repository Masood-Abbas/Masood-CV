import { Github, Linkedin, Mail } from "lucide-react";
import { site, socialLinks } from "@/data/portfolio";

const iconMap: Record<string, any> = {
  GitHub: Github,
  Linkedin: Linkedin,
  Mail: Mail,
};

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border/30 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {currentYear} {site.firstName} {site.lastName}. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            {socialLinks.map((link) => {
              const Icon = iconMap[link.label] ?? Mail;
              return (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                  aria-label={link.label}
                >
                  <Icon className="h-5 w-5" />
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
