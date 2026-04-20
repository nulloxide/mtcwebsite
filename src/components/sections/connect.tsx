"use client";

import { useState, useEffect, useRef } from "react";
import { ScrollReveal } from "@/components/effects/scroll-reveal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Upload,
} from "lucide-react";

const CONTACT_ENDPOINT = "https://formsubmit.co/ajax/dataanalytics@monachilpartners.com";
// Careers form must use the non-AJAX endpoint — formsubmit.co's /ajax/ route
// silently strips file attachments ("Uploaded files won't retain ... through
// the API"). Classic POST redirects the browser to _next once mail is sent.
const APPLY_ENDPOINT = "https://formsubmit.co/dataanalytics@monachilpartners.com";
const MAX_RESUME_BYTES = 10 * 1024 * 1024;

type Status = "idle" | "submitting" | "success" | "error";
type Tab = "contact" | "careers";

type Position = {
  id: string;
  title: string;
  tag: string;
  location: string;
  employmentType: string;
  summary: string;
  about: string[];
  responsibilities: string[];
  qualifications: string[];
  niceToHave: string[];
};

const positions: Position[] = [
  {
    id: "python-data-engineer",
    title: "Python Data Engineer",
    tag: "Engineering",
    location: "Montreal, QC",
    employmentType: "Full-time",
    summary:
      "Design and build the Python data pipelines, validation systems, and FastAPI services that underpin Monachil's investment platform.",
    about: [
      "Monachil's investment process runs on data — loan-level performance, collateral positions, and reconciled portfolio views delivered daily to our investment team. We're looking for a hands-on Python Data Engineer to help design, build, and harden the pipelines and services that keep this platform correct, timely, and observable.",
      "You'll work in an Azure environment and play a meaningful part in our evolution from a monolithic application toward a service-oriented architecture. The role is deeply technical and calls for strong computer-science fundamentals, careful attention to detail, and a commitment to clean, well-documented code.",
    ],
    responsibilities: [
      "Build and maintain Python-based ETL and data pipelines that ingest, transform, and validate daily batch datasets from originator source systems.",
      "Work with blob and object storage systems, and understand the trade-offs between columnar and row-based formats (e.g. Parquet, Avro).",
      "Apply data-validation frameworks (Pydantic, Pandera, or similar) to enforce schema correctness and data integrity end to end.",
      "Design schemas and interact with relational databases (SQLAlchemy or equivalent ORM) as well as NoSQL / document stores via ODM patterns.",
      "Implement FastAPI-based services that expose data and analytics to internal consumers, laying the groundwork for a microservices architecture.",
      "Refactor existing code to improve readability, reliability, and test coverage; reduce technical debt through structured design, strong logging, and good test hygiene.",
      "Apply MapReduce and distributed-processing concepts to prepare pipelines for scale.",
      "Document pipelines, schemas, APIs, and processes clearly and keep that documentation current as part of the definition of done.",
      "Collaborate across teams to translate investment and operations requirements into robust technical solutions.",
    ],
    qualifications: [
      "Approximately 2–3 years of relevant experience, or equivalent demonstrated capability.",
      "Strong Python skills, including Pandas, for data manipulation and pipeline development.",
      "Working knowledge of blob / object storage and columnar / row-based data formats.",
      "Familiarity with data-validation frameworks and schema enforcement.",
      "Proficiency with SQL and relational databases using ORM patterns, plus exposure to NoSQL / document models via ODM.",
      "Experience with FastAPI, RESTful API design, and structured code practices.",
      "Solid grounding in algorithms, data structures, and software-engineering fundamentals.",
      "Strong habits around logging, testing, and documentation.",
      "Awareness of CI/CD concepts; cloud-environment familiarity (Azure is a plus).",
    ],
    niceToHave: [
      "Familiarity with orchestration tools (Airflow, Prefect) or distributed frameworks (Spark, Databricks).",
      "Hands-on exposure to Azure Data Factory, Synapse, or similar services.",
      "Prior work at a fintech, asset manager, or other data-intensive financial firm.",
    ],
  },
  {
    id: "devops-platform-engineer",
    title: "DevOps Platform Engineer",
    tag: "Engineering",
    location: "Montreal, QC",
    employmentType: "Full-time",
    summary:
      "Own the infrastructure, CI/CD, and observability that let a small Monachil engineering team ship safely to a regulated production environment.",
    about: [
      "Monachil runs a proprietary data and analytics platform that the investment team depends on every day. We're looking for a DevOps Platform Engineer to design, build, and operate the infrastructure and automation that make continuous delivery routine for a small engineering team working in a regulated environment.",
      "You'll partner closely with the data-engineering team to keep the platform performant, reliable, and secure — and you'll set the direction for how we run production as we grow.",
    ],
    responsibilities: [
      "Design, implement, and maintain scalable infrastructure — compute, networking, and storage — using infrastructure-as-code (Terraform, Ansible, or equivalent).",
      "Build and maintain automated build, test, and deployment pipelines using Azure DevOps (or equivalent CI/CD such as GitLab CI/CD or Jenkins).",
      "Partner with engineering on architectures that are scalable, reliable, and highly available by design.",
      "Monitor system performance, observability, and reliability; identify and resolve issues proactively to maintain uptime of applications and services.",
      "Continuously improve DevOps processes and practices — CI/CD, automated testing, release management — and share them across the team.",
      "Support the development and maintenance of security policies and procedures for the DevOps environment, appropriate for a regulated investment adviser.",
      "Create and maintain clear, up-to-date documentation of platform processes and procedures.",
      "Participate in on-call coverage for critical production systems outside of business hours.",
    ],
    qualifications: [
      "Strong experience with infrastructure-as-code tools such as Terraform, Ansible, or Puppet.",
      "Experience with CI/CD tooling (Azure DevOps, GitLab CI/CD, Jenkins, or equivalent).",
      "Solid understanding of the software development lifecycle, including agile methodologies.",
      "Working knowledge of cloud platforms (Azure preferred; AWS or GCP also welcome).",
      "Experience with containerization (Docker, Kubernetes).",
      "Strong scripting skills in Python, Bash, or PowerShell.",
      "Bachelor's degree in computer science, engineering, or a related field — or equivalent work experience.",
    ],
    niceToHave: [
      "Experience at a financial-services firm, particularly one with regulatory reporting or data-retention requirements.",
      "Familiarity with security or compliance frameworks (SOC 2, PII handling).",
      "Experience building developer-platform capabilities for small, high-trust engineering teams.",
    ],
  },
];

export function Connect() {
  const [tab, setTab] = useState<Tab>("contact");
  const [activeId, setActiveId] = useState(positions[0].id);

  useEffect(() => {
    // If we just came back from a successful careers submission, switch to the
    // careers tab and scroll the section into view; the CareersPane useEffect
    // reads the same query param to flip its local success state.
    const params = new URLSearchParams(window.location.search);
    if (params.get("submitted") === "careers") {
      setTab("careers");
      requestAnimationFrame(() => {
        document.getElementById("careers")?.scrollIntoView({ behavior: "smooth" });
      });
    }

    const sync = () => {
      if (window.location.hash === "#careers") setTab("careers");
      else if (window.location.hash === "#contact") setTab("contact");
    };
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  return (
    <section id="contact" className="relative overflow-hidden py-32 md:py-48">
      <span id="careers" className="pointer-events-none absolute -top-24" aria-hidden="true" />
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center">
          <ScrollReveal>
            <p className="text-xs font-light uppercase tracking-[0.3em] text-brand-blue">
              Connect
            </p>
          </ScrollReveal>
          <ScrollReveal delay={0.05}>
            <h2 className="mt-4 text-3xl font-light tracking-tight text-text-primary md:text-5xl lg:text-6xl">
              Let&apos;s Build Together
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={0.15}>
            <p className="mx-auto mt-6 max-w-2xl text-lg font-light leading-relaxed text-text-secondary">
              Reach out about our platform, or explore engineering roles on the
              team building it.
            </p>
          </ScrollReveal>
        </div>

        {/* Tabs */}
        <div className="mt-12 flex justify-center">
          <div
            role="tablist"
            aria-label="Connect options"
            className="inline-flex rounded-full border border-border bg-surface p-1 shadow-sm"
          >
            <TabButton
              id="tab-contact"
              panelId="panel-contact"
              active={tab === "contact"}
              onClick={() => setTab("contact")}
            >
              Contact Us
            </TabButton>
            <TabButton
              id="tab-careers"
              panelId="panel-careers"
              active={tab === "careers"}
              onClick={() => setTab("careers")}
            >
              Careers
              <span className="ml-2 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-brand-blue/15 px-1.5 text-[10px] font-medium text-brand-blue">
                {positions.length}
              </span>
            </TabButton>
          </div>
        </div>

        <div className="mt-12">
          <ContactPane hidden={tab !== "contact"} />
          <CareersPane
            hidden={tab !== "careers"}
            activeId={activeId}
            setActiveId={setActiveId}
          />
        </div>
      </div>
    </section>
  );
}

function TabButton({
  id,
  panelId,
  active,
  onClick,
  children,
}: {
  id: string;
  panelId: string;
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      role="tab"
      id={id}
      aria-controls={panelId}
      aria-selected={active}
      onClick={onClick}
      className={`rounded-full px-5 py-2 text-sm font-medium tracking-wide transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
        active
          ? "bg-brand-blue text-white shadow-sm shadow-brand-blue/20"
          : "text-text-primary hover:bg-surface-elevated"
      }`}
    >
      {children}
    </button>
  );
}

function ContactPane({ hidden }: { hidden: boolean }) {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

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
      const response = await fetch(CONTACT_ENDPOINT, {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" },
      });
      const data = (await response.json().catch(() => ({}))) as {
        success?: string | boolean;
        message?: string;
      };
      // formsubmit.co /ajax returns {"success":"true"} on deliver,
      // {"success":"false","message":"..."} on any failure (unactivated
      // endpoint, missing origin, blocked, etc.). Treat anything other
      // than an explicit true as a failure instead of swallowing it.
      const ok = response.ok && (data.success === true || data.success === "true");
      if (!ok) throw new Error(data.message || "Submission failed");
      form.reset();
      setStatus("success");
    } catch {
      setStatus("error");
      setErrorMessage(
        "Something went wrong. Please try again or email dataanalytics@monachilpartners.com directly."
      );
    }
  }

  const submitting = status === "submitting";

  return (
    <div
      role="tabpanel"
      id="panel-contact"
      aria-labelledby="tab-contact"
      hidden={hidden}
    >
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_1.2fr]">
        <div>
          <ScrollReveal>
            <p className="text-lg font-light leading-relaxed text-text-secondary">
              Interested in learning more about our platform or exploring
              opportunities? We&apos;d love to hear from you.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <p className="mt-4 text-lg font-light leading-relaxed text-text-secondary">
              Whether you&apos;re a potential partner, investor, or engineer —
              reach out.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <div className="mt-10 space-y-5">
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
                <p className="mt-1 text-sm font-light text-text-primary">
                  Canada
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>

        <ScrollReveal delay={0.15} direction="left">
          <form
            onSubmit={handleSubmit}
            action={CONTACT_ENDPOINT}
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
  );
}

function CareersPane({
  hidden,
  activeId,
  setActiveId,
}: {
  hidden: boolean;
  activeId: string;
  setActiveId: (id: string) => void;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  // Use the live origin so _next works in dev and in prod, not only on monachiltech.com.
  // Hash at the end makes the browser's own anchor-scroll land us on the careers section.
  const [nextUrl, setNextUrl] = useState("https://monachiltech.com/?submitted=careers#careers");
  const active = positions.find((p) => p.id === activeId) ?? positions[0];

  // After a successful native POST, formsubmit.co redirects back to _next
  // which appends ?submitted=careers. Detect it, switch status, clean URL.
  useEffect(() => {
    setNextUrl(window.location.origin + "/?submitted=careers#careers");
    const params = new URLSearchParams(window.location.search);
    if (params.get("submitted") === "careers") {
      setStatus("success");
      params.delete("submitted");
      const qs = params.toString();
      const next = window.location.pathname + (qs ? "?" + qs : "") + "#careers";
      history.replaceState(null, "", next);
    }
  }, []);

  // Native submit — let the browser POST multipart/form-data so the resume
  // is actually attached. Only intercept to run client-side file validation.
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    const form = event.currentTarget;
    const formData = new FormData(form);
    if (formData.get("_honey")) {
      event.preventDefault();
      return;
    }
    const file = formData.get("resume");
    if (file instanceof File && file.size > 0) {
      const name = file.name.toLowerCase();
      if (!/\.(pdf|doc|docx)$/.test(name)) {
        event.preventDefault();
        setStatus("error");
        setErrorMessage("Please upload a PDF, DOC, or DOCX file.");
        return;
      }
      if (file.size > MAX_RESUME_BYTES) {
        event.preventDefault();
        setStatus("error");
        setErrorMessage("Resume is too large. Maximum size is 10MB.");
        return;
      }
    }
    setStatus("submitting");
    setErrorMessage("");
    // Validation passed — let the browser proceed with the native POST.
  }

  const submitting = status === "submitting";

  return (
    <div
      role="tabpanel"
      id="panel-careers"
      aria-labelledby="tab-careers"
      hidden={hidden}
    >
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[260px_1fr]">
        <aside aria-label="Open positions">
          <p className="text-xs font-light uppercase tracking-[0.25em] text-text-secondary">
            Open Positions{" "}
            <span className="text-text-secondary/60">({positions.length})</span>
          </p>
          <ul
            className="mt-4 space-y-2"
            role="tablist"
            aria-orientation="vertical"
          >
            {positions.map((pos) => {
              const isActive = pos.id === activeId;
              return (
                <li key={pos.id}>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    aria-controls={`jd-${pos.id}`}
                    id={`jdtab-${pos.id}`}
                    tabIndex={isActive ? 0 : -1}
                    onClick={() => setActiveId(pos.id)}
                    className={`w-full rounded-xl border p-4 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                      isActive
                        ? "border-brand-blue/40 bg-surface"
                        : "border-border bg-surface/40 hover:border-brand-blue/20 hover:bg-surface"
                    }`}
                  >
                    <span className="block text-[10px] uppercase tracking-[0.25em] text-brand-blue">
                      {pos.tag}
                    </span>
                    <span className="mt-2 block text-sm font-medium text-text-primary">
                      {pos.title}
                    </span>
                    <span className="mt-1 flex items-center gap-1.5 text-xs font-light text-text-secondary">
                      <MapPin className="h-3 w-3" aria-hidden="true" />
                      {pos.location} &middot; {pos.employmentType}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </aside>

        <article
          role="tabpanel"
          id={`jd-${active.id}`}
          aria-labelledby={`jdtab-${active.id}`}
          className="rounded-2xl border border-border bg-surface p-8 md:p-10"
          style={{ boxShadow: "var(--card-shadow)" }}
        >
          <header>
            <span className="text-[10px] uppercase tracking-[0.25em] text-brand-blue">
              {active.tag}
            </span>
            <h3 className="mt-2 text-2xl font-medium text-text-primary md:text-3xl">
              {active.title}
            </h3>
            <p className="mt-2 flex items-center gap-1.5 text-sm font-light text-text-secondary">
              <MapPin className="h-4 w-4" aria-hidden="true" />
              {active.location} &middot; {active.employmentType}
            </p>
          </header>

          <section className="mt-8">
            <h4 className="text-xs font-medium uppercase tracking-[0.2em] text-text-secondary">
              About the role
            </h4>
            {active.about.map((p, i) => (
              <p
                key={i}
                className="mt-4 text-sm font-light leading-relaxed text-text-primary/90"
              >
                {p}
              </p>
            ))}
          </section>

          <section className="mt-8">
            <h4 className="text-xs font-medium uppercase tracking-[0.2em] text-text-secondary">
              Key responsibilities
            </h4>
            <ul className="mt-4 space-y-2 text-sm font-light leading-relaxed text-text-primary/90">
              {active.responsibilities.map((r, i) => (
                <li key={i} className="flex gap-3">
                  <span
                    className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-brand-blue"
                    aria-hidden="true"
                  />
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-8">
            <h4 className="text-xs font-medium uppercase tracking-[0.2em] text-text-secondary">
              Qualifications
            </h4>
            <ul className="mt-4 space-y-2 text-sm font-light leading-relaxed text-text-primary/90">
              {active.qualifications.map((q, i) => (
                <li key={i} className="flex gap-3">
                  <span
                    className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-brand-blue"
                    aria-hidden="true"
                  />
                  <span>{q}</span>
                </li>
              ))}
            </ul>
          </section>

          {active.niceToHave.length > 0 && (
            <section className="mt-8">
              <h4 className="text-xs font-medium uppercase tracking-[0.2em] text-text-secondary">
                Nice to have
              </h4>
              <ul className="mt-4 space-y-2 text-sm font-light leading-relaxed text-text-primary/90">
                {active.niceToHave.map((n, i) => (
                  <li key={i} className="flex gap-3">
                    <span
                      className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-brand-blue/60"
                      aria-hidden="true"
                    />
                    <span>{n}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <div className="mt-12 border-t border-border pt-10">
            <p className="text-xs font-light uppercase tracking-[0.3em] text-brand-blue">
              Apply now
            </p>
            <p className="mt-3 text-sm font-light text-text-secondary">
              Applying for{" "}
              <strong className="font-medium text-text-primary">
                {active.title}
              </strong>
              . We read every application.
            </p>

            <form
              onSubmit={handleSubmit}
              action={APPLY_ENDPOINT}
              method="POST"
              encType="multipart/form-data"
              noValidate
              className="mt-6 space-y-5"
            >
              <input
                type="hidden"
                name="_subject"
                value={`Career Application — ${active.title}`}
              />
              <input type="hidden" name="_template" value="table" />
              <input type="hidden" name="_captcha" value="false" />
              <input type="hidden" name="_next" value={nextUrl} />
              <input type="hidden" name="position" value={active.title} />
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
                  <Label
                    htmlFor="app-name"
                    className="text-xs font-light tracking-wide"
                  >
                    Full Name
                  </Label>
                  <Input
                    id="app-name"
                    name="name"
                    placeholder="Your name"
                    required
                    aria-required="true"
                    autoComplete="name"
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="app-email"
                    className="text-xs font-light tracking-wide"
                  >
                    Email
                  </Label>
                  <Input
                    id="app-email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    required
                    aria-required="true"
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="app-linkedin"
                  className="text-xs font-light tracking-wide"
                >
                  LinkedIn Profile URL
                </Label>
                <Input
                  id="app-linkedin"
                  name="linkedin"
                  type="url"
                  placeholder="https://linkedin.com/in/yourprofile"
                  autoComplete="url"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="app-resume"
                  className="text-xs font-light tracking-wide"
                >
                  Resume
                </Label>
                <div className="flex items-center gap-3">
                  <Upload
                    className="h-4 w-4 text-text-secondary"
                    aria-hidden="true"
                  />
                  <Input
                    id="app-resume"
                    name="resume"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    required
                    aria-required="true"
                    aria-describedby="app-resume-help"
                    className="file:mr-3 file:rounded-md file:border-0 file:bg-brand-blue/10 file:px-3 file:py-1 file:text-xs file:text-brand-blue"
                  />
                </div>
                <p
                  id="app-resume-help"
                  className="text-xs font-light text-text-secondary"
                >
                  PDF, DOC, or DOCX. Maximum 10MB.
                </p>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="app-message"
                  className="text-xs font-light tracking-wide"
                >
                  Cover Letter / Message
                </Label>
                <Textarea
                  id="app-message"
                  name="message"
                  rows={4}
                  placeholder="Tell us about yourself and why you're interested in this role..."
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="app-referral"
                  className="text-xs font-light tracking-wide"
                >
                  Referral Code{" "}
                  <span className="text-text-secondary">(optional)</span>
                </Label>
                <Input
                  id="app-referral"
                  name="referral_code"
                  placeholder="If someone referred you, enter their code"
                  autoComplete="off"
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
                    Thank you — your application has been received. We will be
                    in touch shortly.
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
                className="w-full bg-brand-blue text-white shadow-lg shadow-brand-blue/20 hover:bg-accent disabled:opacity-60"
              >
                {submitting ? "Submitting..." : "Submit Application"}
              </Button>
            </form>
          </div>
        </article>
      </div>
    </div>
  );
}
