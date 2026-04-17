"use client";

import { useState } from "react";
import { ScrollReveal } from "@/components/effects/scroll-reveal";
import { TextReveal } from "@/components/effects/text-reveal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";

const FORMSUBMIT_ENDPOINT = "https://formsubmit.co/ajax/info@monachiltech.com";

type Status = "idle" | "submitting" | "success" | "error";

export function Contact() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    if (formData.get("_honey")) return;

    const email = formData.get("email");
    if (typeof email === "string" && email.length > 0) {
      formData.set("_replyto", email);
    }

    setStatus("submitting");
    setErrorMessage("");

    try {
      const response = await fetch(FORMSUBMIT_ENDPOINT, {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" },
      });
      const data = (await response.json().catch(() => ({}))) as {
        success?: string | boolean;
      };
      const ok =
        response.ok && data.success !== false && String(data.success) !== "false";
      if (!ok) {
        throw new Error("Submission failed");
      }
      form.reset();
      setStatus("success");
    } catch {
      setStatus("error");
      setErrorMessage(
        "Something went wrong. Please try again or email info@monachiltech.com directly."
      );
    }
  }

  const submitting = status === "submitting";

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
              onSubmit={handleSubmit}
              action={FORMSUBMIT_ENDPOINT}
              method="POST"
              noValidate
              className="card-surface space-y-5 rounded-2xl border border-border bg-surface p-8"
              style={{ boxShadow: "var(--card-shadow)" }}
            >
              <input
                type="hidden"
                name="_subject"
                value="Contact Form — Monachil Technologies"
              />
              <input type="hidden" name="_template" value="table" />
              <input type="hidden" name="_captcha" value="false" />
              <input
                type="text"
                name="_honey"
                tabIndex={-1}
                autoComplete="off"
                hidden
                aria-hidden="true"
              />

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-xs font-light tracking-wide">
                    Name
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Your name"
                    required
                    aria-required="true"
                    autoComplete="name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-xs font-light tracking-wide">
                    Email
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@company.com"
                    required
                    aria-required="true"
                    autoComplete="email"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="company" className="text-xs font-light tracking-wide">
                  Company
                </Label>
                <Input
                  id="company"
                  name="company"
                  placeholder="Your company"
                  autoComplete="organization"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message" className="text-xs font-light tracking-wide">
                  Message
                </Label>
                <Textarea
                  id="message"
                  name="message"
                  placeholder="How can we help?"
                  rows={5}
                  required
                  aria-required="true"
                />
              </div>

              {status === "success" && (
                <div
                  role="status"
                  className="flex items-start gap-3 rounded-lg border border-brand-blue/30 bg-brand-blue/10 p-4 text-sm font-light text-text-primary"
                >
                  <CheckCircle2
                    className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand-blue"
                    aria-hidden="true"
                  />
                  <span>
                    Thank you — your message has been sent. We will be in touch
                    shortly.
                  </span>
                </div>
              )}

              {status === "error" && (
                <div
                  role="alert"
                  className="flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm font-light text-text-primary"
                >
                  <AlertCircle
                    className="mt-0.5 h-4 w-4 flex-shrink-0 text-destructive"
                    aria-hidden="true"
                  />
                  <span>{errorMessage}</span>
                </div>
              )}

              <Button
                type="submit"
                disabled={submitting}
                className="w-full gap-2 bg-brand-blue text-white shadow-lg shadow-brand-blue/20 hover:bg-accent disabled:opacity-60"
              >
                {submitting ? "Sending..." : "Send Message"}
                {!submitting && <ArrowRight className="h-4 w-4" />}
              </Button>
            </form>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
