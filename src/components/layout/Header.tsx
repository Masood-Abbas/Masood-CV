import { useState } from "react";

import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import cvAsset from "@/assets/Masood_Abbas.pdf.asset.json";
import profilePhoto from "@/assets/profile-photo.jpg";

const navLinks = [
  { name: "Home", path: "#home" },
  { name: "About", path: "#about" },
  { name: "Experience", path: "#experience" },
  { name: "Projects", path: "#projects" },
  { name: "Skills", path: "#skills" },
  { name: "Contact", path: "#contact" },
];

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-border/30">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <a href="#home" className="flex items-center gap-2">
            <img 
              src={profilePhoto} 
              alt="Masood Abbas" 
              className="w-10 h-10 rounded-full object-cover border-2 border-primary/30"
            />
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.path}
                href={link.path}
                className="nav-link text-sm font-medium"
              >
                {link.name}
              </a>
            ))}
            <a href="/Masood_Abbas.pdf" download>
              <Button size="sm" className="gap-2">
                <Download className="h-4 w-4" />
                Download CV
              </Button>
            </a>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-foreground p-2"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass-card border-t border-border/30"
          >
            <nav className="container mx-auto px-4 py-4 flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.path}
                  href={link.path}
                  onClick={() => setIsOpen(false)}
                  className="text-sm font-medium py-2 text-muted-foreground hover:text-primary"
                >
                  {link.name}
                </a>
              ))}
              <a href="/Masood_Abbas.pdf" download className="w-full">
                <Button size="sm" className="w-full gap-2">
                  <Download className="h-4 w-4" />
                  Download CV
                </Button>
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
