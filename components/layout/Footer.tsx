import Link from "next/link";
import { Github, Linkedin, Mail, Facebook, Zap } from "lucide-react";

const socialLinks = [
  {
    href: "https://linkedin.com/in/buutanhtranle",
    icon: Linkedin,
    label: "LinkedIn",
  },
  { href: "https://github.com/buutanh", icon: Github, label: "GitHub" },
  {
    href: "mailto:buutanh10032005@gmail.com",
    icon: Mail,
    label: "Email",
  },
  { href: "https://facebook.com", icon: Facebook, label: "Facebook" },
];

const footerLinks = [
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/experience", label: "Experience" },
  { href: "/research", label: "Research" },
  { href: "/contact", label: "Contact" },
];

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-card/40 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center">
                <Zap size={14} className="text-primary" />
              </div>
              <span className="font-bold gradient-text-cyan">Tran Le Buu Tanh</span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs">
              Business Analyst & AI Builder — turning data and systems into real business value.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">
              Navigation
            </h3>
            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">
              Connect
            </h3>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/30 hover:bg-primary/5 transition-all"
                >
                  <social.icon size={16} />
                </a>
              ))}
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              buutanh10032005@gmail.com
            </p>
            <p className="text-sm text-muted-foreground">
              Ho Chi Minh City, Vietnam
            </p>
          </div>
        </div>

        <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Le Buu Tanh. All rights reserved.</p>
          <p className="text-muted-foreground/50">buutanh-portfolio.vercel.app</p>
        </div>
      </div>
    </footer>
  );
}
