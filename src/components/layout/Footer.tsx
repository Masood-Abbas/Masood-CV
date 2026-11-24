import { Lock } from "lucide-react";
import { usePortfolio } from "@/data/PortfolioContext";
import { getIcon } from "@/data/icons";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { data } = usePortfolio();
  const { site, socialLinks } = data;

  return (
    <footer className="border-t border-border/30 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {currentYear} {site.firstName} {site.lastName}. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            {socialLinks.map((link) => {
              const Icon = getIcon(link.icon);
              return (
                <a
                  key={`${link.label}-${link.href}`}
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
            <a
              href="/admin"
              className="text-muted-foreground/50 hover:text-primary transition-colors"
              aria-label="Admin panel"
              title="Admin panel"
            >
              <Lock className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
