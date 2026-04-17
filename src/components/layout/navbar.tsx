"use client";

import { useState, useEffect } from "react";
import { Menu } from "lucide-react";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";

const SCROLL_THRESHOLD = 50;

const navLinks = [
  { label: "About", href: "#about" },
  { label: "Capabilities", href: "#capabilities" },
  { label: "Platform", href: "#platform" },
  { label: "Careers", href: "#careers" },
  { label: "Contact", href: "#contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > SCROLL_THRESHOLD);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setOpen(false);
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
    // Update the URL hash so sections listening for hashchange (e.g. Connect tabs) react
    if (href.startsWith("#") && window.location.hash !== href) {
      if (history.replaceState) {
        history.replaceState(null, "", href);
      } else {
        window.location.hash = href;
      }
      window.dispatchEvent(new HashChangeEvent("hashchange"));
    }
  };

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "border-b border-white/[0.04] bg-background/60 backdrop-blur-2xl"
          : "bg-transparent"
      }`}
    >
      <nav className="relative mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
        <a href="#" aria-label="Scroll to top" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}>
          <Logo compact />
        </a>

        {/* Desktop nav — absolutely centered */}
        <div className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleClick(e, link.href)}
              className="text-[13px] font-light tracking-wide text-text-secondary transition-colors hover:text-text-primary"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Desktop toggle */}
        <div className="hidden md:block">
          <ThemeToggle />
        </div>

        {/* Mobile nav */}
        <div className="flex items-center gap-3 md:hidden">
          <ThemeToggle />
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button
                type="button"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" aria-hidden="true" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 bg-background">
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              <div className="mt-8 flex flex-col gap-6">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={(e) => handleClick(e, link.href)}
                    className="text-lg font-light text-text-secondary transition-colors hover:text-text-primary"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
