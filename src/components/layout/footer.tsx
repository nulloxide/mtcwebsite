import { MountainIcon } from "@/components/logo";

const footerLinks = [
  { label: "About", href: "#about" },
  { label: "Platform", href: "#platform" },
  { label: "Capabilities", href: "#capabilities" },
  { label: "Careers", href: "#careers" },
  { label: "Contact", href: "#contact" },
];

export function Footer() {
  return (
    <footer className="border-t border-border/50">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 py-8 md:flex-row">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <MountainIcon className="h-5 w-5 text-brand-blue" />
          <span className="text-xs font-light tracking-[0.2em] text-text-secondary">
            MONACHIL TECHNOLOGIES
          </span>
        </div>

        {/* Links */}
        <div className="flex flex-wrap items-center justify-center gap-6">
          {footerLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-xs text-text-secondary transition-colors hover:text-text-primary hover:underline"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Copyright */}
        <p className="text-xs text-text-secondary">
          &copy; {new Date().getFullYear()} Monachil Technologies.{" "}
          <a
            href="https://monachilpartners.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent underline decoration-accent/30 underline-offset-2 hover:decoration-accent"
          >
            Monachil Capital Partners LP
          </a>
        </p>
      </div>
    </footer>
  );
}
