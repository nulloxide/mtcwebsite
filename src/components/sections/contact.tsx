"use client";

import { ScrollReveal } from "@/components/effects/scroll-reveal";
import { TextReveal } from "@/components/effects/text-reveal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowRight } from "lucide-react";

export function Contact() {
  return (
    <section id="contact" className="relative py-32 md:py-48">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 gap-20 lg:grid-cols-2">
          {/* Info */}
          <div>
            <ScrollReveal>
              <p className="text-xs font-light uppercase tracking-[0.3em] text-brand-blue">
                Contact
              </p>
            </ScrollReveal>
            <TextReveal
              as="h2"
              className="mt-4 text-3xl font-light tracking-tight text-text-primary md:text-5xl lg:text-6xl"
            >
              Let&apos;s Connect
            </TextReveal>
            <ScrollReveal delay={0.15}>
              <p className="mt-6 text-lg font-light leading-relaxed text-text-secondary">
                Interested in learning more about our platform or exploring
                opportunities? We&apos;d love to hear from you.
              </p>
            </ScrollReveal>
            <ScrollReveal delay={0.25}>
              <p className="mt-4 text-lg font-light leading-relaxed text-text-secondary">
                Whether you&apos;re a potential partner, investor, or engineer
                looking to join our team — reach out.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.3}>
              <div className="mt-10 space-y-4">
                <div>
                  <p className="text-xs font-light uppercase tracking-[0.2em] text-text-secondary">
                    Email
                  </p>
                  <a
                    href="mailto:info@monachiltech.com"
                    className="mt-1 text-sm font-light text-text-primary underline decoration-transparent underline-offset-2 transition-all hover:text-accent hover:decoration-accent/30"
                  >
                    info@monachiltech.com
                  </a>
                </div>
                <div>
                  <p className="text-xs font-light uppercase tracking-[0.2em] text-text-secondary">
                    Location
                  </p>
                  <p className="mt-1 text-sm font-light text-text-primary">Canada</p>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Form */}
          <ScrollReveal delay={0.15} direction="left">
            <form
              onSubmit={(e) => e.preventDefault()}
              className="card-surface space-y-5 rounded-2xl border border-border bg-surface p-8"
              style={{ boxShadow: "var(--card-shadow)" }}
            >
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-xs font-light tracking-wide">
                    Name
                  </Label>
                  <Input id="name" placeholder="Your name" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-xs font-light tracking-wide">
                    Email
                  </Label>
                  <Input id="email" type="email" placeholder="you@company.com" required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="company" className="text-xs font-light tracking-wide">
                  Company
                </Label>
                <Input id="company" placeholder="Your company" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message" className="text-xs font-light tracking-wide">
                  Message
                </Label>
                <Textarea
                  id="message"
                  placeholder="How can we help?"
                  rows={5}
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full gap-2 bg-brand-blue text-white shadow-lg shadow-brand-blue/20 hover:bg-accent"
              >
                Send Message
                <ArrowRight className="h-4 w-4" />
              </Button>
            </form>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
