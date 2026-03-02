"use client";

import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Services", href: "/services" },
  { label: "Case Studies", href: "/case-studies" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  const isTransparentHero = pathname === "/" && !scrolled;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on navigation
  const handleNavClick = () => setIsOpen(false);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-background/95 backdrop-blur-sm border-b border-border shadow-sm"
          : "bg-transparent"
      )}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-1"
            onClick={handleNavClick}
          >
            {isTransparentHero ? (
              <Image
                src="/images/logo/datasalt-logo-dark.png"
                alt="DataSalt Logo (Transparent Hero Override)"
                width={336}
                height={84}
                className="h-14 w-auto object-contain block"
                priority
              />
            ) : (
              <>
                <Image
                  src="/images/logo/datasalt-logo.png"
                  alt="DataSalt Logo"
                  width={336}
                  height={84}
                  className="h-14 w-auto object-contain dark:hidden"
                  priority
                />
                <Image
                  src="/images/logo/datasalt-logo-dark.png"
                  alt="DataSalt Logo (Dark)"
                  width={336}
                  height={84}
                  className="h-14 w-auto object-contain hidden dark:block"
                  priority
                />
              </>
            )}
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-3 py-2 text-sm transition-colors rounded-md hover:bg-accent/10",
                  isTransparentHero ? "text-white/80 hover:text-white" : "text-foreground/70 hover:text-foreground"
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className="ml-2">
              <ThemeToggle isTransparentHero={isTransparentHero} />
            </div>
            <Button asChild size="sm" className="ml-2">
              <Link href="/contact">Get a Quote</Link>
            </Button>
          </nav>

          {/* Mobile controls */}
          <div className="flex md:hidden items-center gap-1">
            <ThemeToggle isTransparentHero={isTransparentHero} />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
              className={isTransparentHero ? "text-white/80 hover:text-white" : "text-foreground/70 hover:text-foreground"}
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-background/98 backdrop-blur-sm border-b border-border">
          <nav className="max-w-6xl mx-auto px-4 py-4 flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={handleNavClick}
                className="px-3 py-3 text-sm text-foreground/70 hover:text-foreground transition-colors rounded-md hover:bg-accent/10"
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-2 pt-2 border-t border-border">
              <Button asChild size="sm" className="w-full">
                <Link href="/contact" onClick={handleNavClick}>
                  Get a Quote
                </Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
