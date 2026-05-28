"use client";

import { useState, useCallback } from "react";

/* ─────────────────────────────────────────────
   Types
───────────────────────────────────────────── */
interface FormData {
  // Section 1 – Contact
  businessName: string;
  contactName: string;
  email: string;
  phone: string;
  currentWebsite: string;
  businessLocation: string;

  // Section 2 – Offer
  serviceProduct: string;
  mainOffer: string;
  idealCustomer: string;
  problemSolved: string;
  desiredAction: string;
  desiredActionOther: string;

  // Section 3 – Style
  preferredColors: string;
  stylePreference: string[];
  exampleSites: string;
  dislikedSites: string;

  // Section 4 – Assets
  logoLink: string;
  photoVideoLink: string;
  additionalLinks: string;
  assetNotes: string;

  // Section 5 – Content
  existingCopy: string;
  mainServices: string;
  testimonials: string;
  faqs: string;
  guarantees: string;
  disclaimers: string;

  // Section 6 – Domain
  ownsDomain: string;
  desiredDomain: string;
  domainRegistrar: string;
  needsDomainHelp: string;

  // Section 7 – Cinematic
  wantsCinematicBg: string;
  cinematicStyle: string;

  // Section 8 – Notes
  finalNotes: string;

  // Honeypot
  website_url: string;
}

interface FormErrors {
  [key: string]: string;
}

const STYLE_OPTIONS = [
  "Bold",
  "Luxury",
  "Clean",
  "Modern",
  "Cinematic",
  "High-energy",
  "Dark premium",
  "Bright and clean",
];

const ACTION_OPTIONS = [
  "Call",
  "Text",
  "Request a quote",
  "Book appointment",
  "Submit contact form",
  "Free consultation",
  "Other",
];

/* ─────────────────────────────────────────────
   Sub-components
───────────────────────────────────────────── */
function Label({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label
      className="block text-xs font-bold text-[#c5a452] mb-2 tracking-[0.1em] uppercase"
      style={{ fontFamily: "var(--font-montserrat)" }}
    >
      {children}
      {required && <span className="text-red-400 ml-1">*</span>}
    </label>
  );
}

function Helper({ children }: { children: React.ReactNode }) {
  return <p className="text-xs text-[#5a5652] mt-2 leading-relaxed">{children}</p>;
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="text-xs text-red-400 mt-1.5 flex items-center gap-1">
      ⚠ {message}
    </p>
  );
}

function SectionHeader({ number, title }: { number: number; title: string }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <span className="section-number">{String(number).padStart(2, "0")}</span>
      <h2
        className="text-base font-bold text-[#e8e4dc] tracking-wide"
        style={{ fontFamily: "var(--font-montserrat)" }}
      >
        {title}
      </h2>
      <div className="flex-1 h-px bg-[rgba(197,164,82,0.12)]" />
    </div>
  );
}

/* ─────────────────────────────────────────────
   Main Page
───────────────────────────────────────────── */
export default function IntakePage() {
  const [form, setForm] = useState<FormData>({
    businessName: "",
    contactName: "",
    email: "",
    phone: "",
    currentWebsite: "",
    businessLocation: "",
    serviceProduct: "",
    mainOffer: "",
    idealCustomer: "",
    problemSolved: "",
    desiredAction: "",
    desiredActionOther: "",
    preferredColors: "",
    stylePreference: [],
    exampleSites: "",
    dislikedSites: "",
    logoLink: "",
    photoVideoLink: "",
    additionalLinks: "",
    assetNotes: "",
    existingCopy: "",
    mainServices: "",
    testimonials: "",
    faqs: "",
    guarantees: "",
    disclaimers: "",
    ownsDomain: "",
    desiredDomain: "",
    domainRegistrar: "",
    needsDomainHelp: "",
    wantsCinematicBg: "",
    cinematicStyle: "",
    finalNotes: "",
    website_url: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  /* ── Field setter (clears individual error) ── */
  const set = useCallback((field: keyof FormData, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => {
      const copy = { ...e };
      delete copy[field];
      return copy;
    });
  }, []);

  const toggleStyle = useCallback((style: string) => {
    setForm((f) => ({
      ...f,
      stylePreference: f.stylePreference.includes(style)
        ? f.stylePreference.filter((s) => s !== style)
        : [...f.stylePreference, style],
    }));
  }, []);

  /* ── Client-side validation ── */
  const validate = (): boolean => {
    const e: FormErrors = {};
    if (!form.businessName.trim()) e.businessName = "Business name is required.";
    if (!form.contactName.trim()) e.contactName = "Contact name is required.";
    if (!form.email.trim()) {
      e.email = "Email address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      e.email = "Please enter a valid email address.";
    }
    if (!form.phone.trim()) e.phone = "Phone number is required.";
    if (!form.mainOffer.trim()) e.mainOffer = "Main offer is required.";
    if (!form.desiredAction) e.desiredAction = "Please select a desired visitor action.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /* ── Submit ── */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.website_url) return; // honeypot triggered — silent fail

    if (!validate()) {
      // Scroll to first error
      setTimeout(() => {
        const firstError = document.querySelector("[data-error='true']");
        firstError?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 50);
      return;
    }

    setStatus("submitting");
    setErrorMessage("");

    try {
      const res = await fetch("/api/client-intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          stylePreference: form.stylePreference.join(", "),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Submission failed. Please try again.");
      }

      setStatus("success");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setStatus("error");
      setErrorMessage(
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      );
    }
  };

  /* ──────────────── SUCCESS STATE ──────────────── */
  if (status === "success") {
    return (
      <div className="min-h-screen bg-[#080a0c] flex items-center justify-center px-6 py-24">
        <div className="max-w-lg w-full text-center">
          <div className="w-16 h-16 rounded-full bg-[rgba(197,164,82,0.1)] border border-[rgba(197,164,82,0.25)] flex items-center justify-center mx-auto mb-8">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path
                d="M5 13l4 4L19 7"
                stroke="#c5a452"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <p
            className="text-[10px] font-bold tracking-[0.25em] text-[#c5a452] uppercase mb-5"
            style={{ fontFamily: "var(--font-montserrat)" }}
          >
            Intake Received
          </p>
          <h1
            className="text-3xl sm:text-4xl font-black text-[#e8e4dc] mb-6 leading-tight"
            style={{ fontFamily: "var(--font-montserrat)" }}
          >
            You&apos;re locked in.
          </h1>
          <p className="text-[#9a9590] leading-relaxed mb-10 text-base">
            Intake received. We&apos;ll review your details and begin preparing your first LPR
            landing page preview. If we need anything else, we&apos;ll contact you directly.
          </p>
          <a
            href="https://zandermooney.com/"
            className="inline-flex items-center gap-2 text-sm text-[#c5a452] hover:text-[#e0bb6a] transition-colors"
            style={{ fontFamily: "var(--font-montserrat)" }}
          >
            ← Back to LPR
          </a>
        </div>
      </div>
    );
  }

  /* ──────────────── FORM ──────────────── */
  return (
    <div className="min-h-screen bg-[#080a0c]">
      {/* Ambient glow */}
      <div
        aria-hidden
        className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] rounded-full opacity-[0.035] blur-[130px] pointer-events-none"
        style={{ background: "radial-gradient(ellipse, #c5a452 0%, transparent 70%)" }}
      />

      {/* ── Header ── */}
      <header className="border-b border-[rgba(255,255,255,0.06)] bg-[rgba(8,10,12,0.92)] backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span
              className="text-[11px] font-black tracking-[0.28em] text-[#c5a452] uppercase"
              style={{ fontFamily: "var(--font-montserrat)" }}
            >
              LPR
            </span>
            <span className="text-[rgba(255,255,255,0.12)] text-sm">|</span>
            <span
              className="text-[11px] text-[#5a5652] tracking-widest uppercase"
              style={{ fontFamily: "var(--font-montserrat)" }}
            >
              Client Intake
            </span>
          </div>
          <a
            href="https://zandermooney.com/"
            className="text-xs text-[#5a5652] hover:text-[#c5a452] transition-colors flex items-center gap-1.5"
            style={{ fontFamily: "var(--font-montserrat)" }}
          >
            ← Back to LPR
          </a>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-5 sm:px-6 py-14 pb-32">

        {/* ── Hero ── */}
        <div className="text-center mb-14">
          <p
            className="text-[10px] font-bold tracking-[0.3em] text-[#c5a452] uppercase mb-6"
            style={{ fontFamily: "var(--font-montserrat)" }}
          >
            Landing Page Rocket
          </p>
          <h1
            className="text-4xl sm:text-5xl font-black text-[#e8e4dc] mb-5 leading-[1.08] tracking-tight"
            style={{ fontFamily: "var(--font-montserrat)" }}
          >
            Let&apos;s Build Your
            <br />
            <span className="text-[#c5a452]">Landing Page.</span>
          </h1>
          <p className="text-[#9a9590] text-base sm:text-lg leading-relaxed max-w-xl mx-auto mb-10">
            Complete this intake form so we can collect your business details, offer, assets,
            style direction, and domain information before we begin your LPR landing page.
          </p>

          {/* Process pipeline */}
          <div className="inline-flex flex-wrap items-center justify-center gap-y-2 gap-x-2 sm:gap-x-3 px-5 py-3.5 rounded-xl bg-[#0f1114] border border-[rgba(255,255,255,0.07)]">
            {["Payment Complete", "Intake", "Build", "Preview", "Launch"].map((step, i) => (
              <span key={step} className="flex items-center gap-2 sm:gap-3">
                <span
                  className={`text-[10px] font-bold tracking-[0.12em] uppercase ${
                    i === 1 ? "text-[#c5a452]" : "text-[#5a5652]"
                  }`}
                  style={{ fontFamily: "var(--font-montserrat)" }}
                >
                  {step}
                </span>
                {i < 4 && (
                  <span className="text-[rgba(255,255,255,0.12)] text-xs">→</span>
                )}
              </span>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} noValidate>

          {/* Honeypot — hidden from humans */}
          <div
            aria-hidden
            className="absolute opacity-0 pointer-events-none w-0 h-0 overflow-hidden"
            tabIndex={-1}
          >
            <input
              type="text"
              name="website_url"
              autoComplete="off"
              tabIndex={-1}
              value={form.website_url}
              onChange={(e) => set("website_url", e.target.value)}
            />
          </div>

          <div className="space-y-5">

            {/* ═══ SECTION 1: Contact Info ═══ */}
            <div className="lpr-card">
              <SectionHeader number={1} title="Contact Info" />
              <div className="grid sm:grid-cols-2 gap-5">

                <div data-error={!!errors.businessName}>
                  <Label required>Business Name</Label>
                  <input
                    className={`lpr-input${errors.businessName ? " error" : ""}`}
                    placeholder="e.g. Apex Roofing"
                    value={form.businessName}
                    onChange={(e) => set("businessName", e.target.value)}
                  />
                  <FieldError message={errors.businessName} />
                </div>

                <div data-error={!!errors.contactName}>
                  <Label required>Contact Name</Label>
                  <input
                    className={`lpr-input${errors.contactName ? " error" : ""}`}
                    placeholder="Your full name"
                    value={form.contactName}
                    onChange={(e) => set("contactName", e.target.value)}
                  />
                  <FieldError message={errors.contactName} />
                </div>

                <div data-error={!!errors.email}>
                  <Label required>Email</Label>
                  <input
                    type="email"
                    className={`lpr-input${errors.email ? " error" : ""}`}
                    placeholder="you@yourbusiness.com"
                    value={form.email}
                    onChange={(e) => set("email", e.target.value)}
                  />
                  <FieldError message={errors.email} />
                </div>

                <div data-error={!!errors.phone}>
                  <Label required>Phone Number</Label>
                  <input
                    type="tel"
                    className={`lpr-input${errors.phone ? " error" : ""}`}
                    placeholder="(555) 000-0000"
                    value={form.phone}
                    onChange={(e) => set("phone", e.target.value)}
                  />
                  <FieldError message={errors.phone} />
                </div>

                <div>
                  <Label>Current Website URL</Label>
                  <input
                    type="url"
                    className="lpr-input"
                    placeholder="https://yourbusiness.com"
                    value={form.currentWebsite}
                    onChange={(e) => set("currentWebsite", e.target.value)}
                  />
                </div>

                <div>
                  <Label>Business Location</Label>
                  <input
                    className="lpr-input"
                    placeholder="City, State or Country"
                    value={form.businessLocation}
                    onChange={(e) => set("businessLocation", e.target.value)}
                  />
                </div>

              </div>
            </div>

            {/* ═══ SECTION 2: Offer Details ═══ */}
            <div className="lpr-card">
              <SectionHeader number={2} title="Offer Details" />
              <div className="space-y-5">

                <div>
                  <Label>What service or product are you promoting?</Label>
                  <input
                    className="lpr-input"
                    placeholder="e.g. Residential roofing, HVAC installation, coaching program..."
                    value={form.serviceProduct}
                    onChange={(e) => set("serviceProduct", e.target.value)}
                  />
                </div>

                <div data-error={!!errors.mainOffer}>
                  <Label required>What is your main offer?</Label>
                  <textarea
                    className={`lpr-input${errors.mainOffer ? " error" : ""}`}
                    placeholder="Describe the specific offer your landing page will be built around. Be as specific as possible."
                    rows={4}
                    value={form.mainOffer}
                    onChange={(e) => set("mainOffer", e.target.value)}
                  />
                  <FieldError message={errors.mainOffer} />
                </div>

                <div>
                  <Label>Who is your ideal customer?</Label>
                  <input
                    className="lpr-input"
                    placeholder="e.g. Homeowners in Texas, 35–55, running Google Ads"
                    value={form.idealCustomer}
                    onChange={(e) => set("idealCustomer", e.target.value)}
                  />
                </div>

                <div>
                  <Label>What problem does your offer solve?</Label>
                  <textarea
                    className="lpr-input"
                    placeholder="Describe the core pain point your customer has before finding you."
                    rows={3}
                    value={form.problemSolved}
                    onChange={(e) => set("problemSolved", e.target.value)}
                  />
                </div>

                <div data-error={!!errors.desiredAction}>
                  <Label required>What action do you want visitors to take?</Label>
                  <select
                    className={`lpr-input lpr-select${errors.desiredAction ? " error" : ""}`}
                    value={form.desiredAction}
                    onChange={(e) => set("desiredAction", e.target.value)}
                  >
                    <option value="">— Select an action —</option>
                    {ACTION_OPTIONS.map((a) => (
                      <option key={a} value={a}>
                        {a}
                      </option>
                    ))}
                  </select>
                  <FieldError message={errors.desiredAction} />
                  {form.desiredAction === "Other" && (
                    <input
                      className="lpr-input mt-3"
                      placeholder="Describe the desired action..."
                      value={form.desiredActionOther}
                      onChange={(e) => set("desiredActionOther", e.target.value)}
                    />
                  )}
                </div>

              </div>
            </div>

            {/* ═══ SECTION 3: Style ═══ */}
            <div className="lpr-card">
              <SectionHeader number={3} title="Landing Page Style" />
              <div className="space-y-5">

                <div>
                  <Label>Preferred Colors</Label>
                  <input
                    className="lpr-input"
                    placeholder="e.g. Dark navy and gold, white and blue, black and orange..."
                    value={form.preferredColors}
                    onChange={(e) => set("preferredColors", e.target.value)}
                  />
                </div>

                <div>
                  <Label>Style Preference</Label>
                  <Helper>Select all that apply.</Helper>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-3">
                    {STYLE_OPTIONS.map((style) => {
                      const active = form.stylePreference.includes(style);
                      return (
                        <label
                          key={style}
                          className={`lpr-checkbox${active ? " checked" : ""}`}
                          onClick={() => toggleStyle(style)}
                        >
                          <span
                            className={`w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center transition-colors ${
                              active
                                ? "bg-[#c5a452] border-[#c5a452]"
                                : "border-[rgba(255,255,255,0.2)]"
                            }`}
                          >
                            {active && (
                              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                                <path
                                  d="M2 5l2.5 2.5L8 2.5"
                                  stroke="#080a0c"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            )}
                          </span>
                          <span className="text-sm">{style}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <Label>Example websites or landing pages you like</Label>
                  <textarea
                    className="lpr-input"
                    placeholder="Paste links or describe what you like about them..."
                    rows={3}
                    value={form.exampleSites}
                    onChange={(e) => set("exampleSites", e.target.value)}
                  />
                </div>

                <div>
                  <Label>Any websites or styles you dislike?</Label>
                  <textarea
                    className="lpr-input"
                    placeholder="Tell us what to avoid — layouts, colors, fonts, vibes..."
                    rows={3}
                    value={form.dislikedSites}
                    onChange={(e) => set("dislikedSites", e.target.value)}
                  />
                </div>

              </div>
            </div>

            {/* ═══ SECTION 4: Assets ═══ */}
            <div className="lpr-card">
              <SectionHeader number={4} title="Assets" />
              <div className="p-4 rounded-lg bg-[rgba(197,164,82,0.04)] border border-[rgba(197,164,82,0.15)] mb-5">
                <p className="text-xs text-[#9a9590] leading-relaxed">
                  <span className="text-[#c5a452] font-semibold">Asset links only.</span>{" "}
                  Please make sure your asset link is set to public or accessible so we can view
                  and download the files. (Google Drive, Dropbox, WeTransfer, etc.)
                </p>
              </div>
              <div className="space-y-5">

                <div>
                  <Label>Logo / Brand Asset Link</Label>
                  <input
                    type="url"
                    className="lpr-input"
                    placeholder="https://drive.google.com/..."
                    value={form.logoLink}
                    onChange={(e) => set("logoLink", e.target.value)}
                  />
                </div>

                <div>
                  <Label>Business Photo / Video Asset Link</Label>
                  <input
                    type="url"
                    className="lpr-input"
                    placeholder="https://drive.google.com/..."
                    value={form.photoVideoLink}
                    onChange={(e) => set("photoVideoLink", e.target.value)}
                  />
                </div>

                <div>
                  <Label>Additional Asset Links</Label>
                  <textarea
                    className="lpr-input"
                    placeholder="Any other links to relevant files, folders, or resources..."
                    rows={3}
                    value={form.additionalLinks}
                    onChange={(e) => set("additionalLinks", e.target.value)}
                  />
                </div>

                <div>
                  <Label>Notes About Assets</Label>
                  <textarea
                    className="lpr-input"
                    placeholder="Any context about the files, naming, which to use, etc."
                    rows={3}
                    value={form.assetNotes}
                    onChange={(e) => set("assetNotes", e.target.value)}
                  />
                </div>

              </div>
            </div>

            {/* ═══ SECTION 5: Page Content ═══ */}
            <div className="lpr-card">
              <SectionHeader number={5} title="Page Content" />
              <div className="space-y-5">

                <div>
                  <Label>Do you already have wording / copy you want used?</Label>
                  <textarea
                    className="lpr-input"
                    placeholder="Paste any headlines, body copy, taglines, or messaging you want on the page..."
                    rows={4}
                    value={form.existingCopy}
                    onChange={(e) => set("existingCopy", e.target.value)}
                  />
                </div>

                <div>
                  <Label>List your main services</Label>
                  <textarea
                    className="lpr-input"
                    placeholder="One per line or comma-separated. Include any key details."
                    rows={4}
                    value={form.mainServices}
                    onChange={(e) => set("mainServices", e.target.value)}
                  />
                </div>

                <div>
                  <Label>Testimonials or reviews</Label>
                  <textarea
                    className="lpr-input"
                    placeholder="Paste any reviews, testimonials, or links to them. Name + quote is ideal."
                    rows={4}
                    value={form.testimonials}
                    onChange={(e) => set("testimonials", e.target.value)}
                  />
                </div>

                <div>
                  <Label>FAQs customers usually ask</Label>
                  <textarea
                    className="lpr-input"
                    placeholder="List the most common questions your customers ask before hiring you."
                    rows={4}
                    value={form.faqs}
                    onChange={(e) => set("faqs", e.target.value)}
                  />
                </div>

                <div>
                  <Label>Guarantees, promotions, or special offers</Label>
                  <textarea
                    className="lpr-input"
                    placeholder="e.g. Free estimates, satisfaction guarantee, limited-time discount..."
                    rows={3}
                    value={form.guarantees}
                    onChange={(e) => set("guarantees", e.target.value)}
                  />
                </div>

                <div>
                  <Label>Required wording, disclaimers, or compliance notes</Label>
                  <textarea
                    className="lpr-input"
                    placeholder="Any legally required text, licensing info, industry disclaimers, etc."
                    rows={3}
                    value={form.disclaimers}
                    onChange={(e) => set("disclaimers", e.target.value)}
                  />
                </div>

              </div>
            </div>

            {/* ═══ SECTION 6: Domain Info ═══ */}
            <div className="lpr-card">
              <SectionHeader number={6} title="Domain Info" />
              <div className="space-y-5">

                <div>
                  <Label>Do you already own a domain?</Label>
                  <div className="flex flex-wrap gap-3 mt-1">
                    {["Yes", "No", "Not sure"].map((opt) => {
                      const active = form.ownsDomain === opt;
                      return (
                        <label
                          key={opt}
                          className={`lpr-checkbox flex-1 min-w-[90px] justify-center${active ? " checked" : ""}`}
                          onClick={() => set("ownsDomain", opt)}
                        >
                          <span
                            className={`w-4 h-4 rounded-full border flex-shrink-0 flex items-center justify-center transition-colors ${
                              active ? "border-[#c5a452]" : "border-[rgba(255,255,255,0.2)]"
                            }`}
                          >
                            {active && (
                              <span className="w-2 h-2 rounded-full bg-[#c5a452]" />
                            )}
                          </span>
                          <span className="text-sm">{opt}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <Label>What domain do you want connected?</Label>
                  <input
                    className="lpr-input"
                    placeholder="e.g. mylandingpage.com or subdomain.mybusiness.com"
                    value={form.desiredDomain}
                    onChange={(e) => set("desiredDomain", e.target.value)}
                  />
                </div>

                <div>
                  <Label>Where did you buy the domain?</Label>
                  <input
                    className="lpr-input"
                    placeholder="e.g. GoDaddy, Namecheap, Shopify, Squarespace, Wix, Google Domains, Cloudflare"
                    value={form.domainRegistrar}
                    onChange={(e) => set("domainRegistrar", e.target.value)}
                  />
                </div>

                <div>
                  <Label>Do you need help connecting the domain?</Label>
                  <div className="flex flex-wrap gap-3 mt-1">
                    {["Yes", "No", "Not sure"].map((opt) => {
                      const active = form.needsDomainHelp === opt;
                      return (
                        <label
                          key={opt}
                          className={`lpr-checkbox flex-1 min-w-[90px] justify-center${active ? " checked" : ""}`}
                          onClick={() => set("needsDomainHelp", opt)}
                        >
                          <span
                            className={`w-4 h-4 rounded-full border flex-shrink-0 flex items-center justify-center transition-colors ${
                              active ? "border-[#c5a452]" : "border-[rgba(255,255,255,0.2)]"
                            }`}
                          >
                            {active && (
                              <span className="w-2 h-2 rounded-full bg-[#c5a452]" />
                            )}
                          </span>
                          <span className="text-sm">{opt}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

              </div>
            </div>

            {/* ═══ SECTION 7: Cinematic Background ═══ */}
            <div className="lpr-card">
              <SectionHeader number={7} title="Cinematic Background" />
              <div className="space-y-5">

                <div>
                  <Label>Do you want a cinematic background video?</Label>
                  <div className="flex flex-wrap gap-3 mt-1">
                    {["Yes", "No", "Not sure"].map((opt) => {
                      const active = form.wantsCinematicBg === opt;
                      return (
                        <label
                          key={opt}
                          className={`lpr-checkbox flex-1 min-w-[90px] justify-center${active ? " checked" : ""}`}
                          onClick={() => set("wantsCinematicBg", opt)}
                        >
                          <span
                            className={`w-4 h-4 rounded-full border flex-shrink-0 flex items-center justify-center transition-colors ${
                              active ? "border-[#c5a452]" : "border-[rgba(255,255,255,0.2)]"
                            }`}
                          >
                            {active && (
                              <span className="w-2 h-2 rounded-full bg-[#c5a452]" />
                            )}
                          </span>
                          <span className="text-sm">{opt}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {form.wantsCinematicBg === "Yes" && (
                  <div>
                    <Label>If yes, describe the style</Label>
                    <textarea
                      className="lpr-input"
                      placeholder="e.g. luxury rocket launch, city lights at night, construction site, medical, automotive, real estate aerial..."
                      rows={3}
                      value={form.cinematicStyle}
                      onChange={(e) => set("cinematicStyle", e.target.value)}
                    />
                    <Helper>
                      Example: luxury rocket launch, city lights, construction, medical, automotive,
                      real estate, fast motion, premium dark, bright clean, etc.
                    </Helper>
                  </div>
                )}

              </div>
            </div>

            {/* ═══ SECTION 8: Final Notes ═══ */}
            <div className="lpr-card">
              <SectionHeader number={8} title="Final Notes" />
              <div>
                <Label>Anything else we should know before building your LPR landing page?</Label>
                <textarea
                  className="lpr-input"
                  placeholder="Any final context, specific requests, timing notes, or questions for the LPR team..."
                  rows={5}
                  value={form.finalNotes}
                  onChange={(e) => set("finalNotes", e.target.value)}
                />
              </div>
            </div>

          </div>

          {/* ── Validation / error banners ── */}
          {Object.keys(errors).length > 0 && (
            <div className="mt-6 p-4 rounded-lg border border-red-500/20 bg-red-500/8 text-sm text-red-300">
              Please fill in all required fields before submitting.
            </div>
          )}

          {status === "error" && (
            <div className="mt-4 p-4 rounded-lg border border-red-500/30 bg-red-500/10 text-sm text-red-300">
              {errorMessage || "Something went wrong. Please try again."}
            </div>
          )}

          {/* ── Submit ── */}
          <div className="mt-10 flex flex-col items-center gap-5">
            <button
              type="submit"
              disabled={status === "submitting"}
              className="lpr-btn w-full sm:w-auto min-w-[220px]"
            >
              {status === "submitting" ? (
                <>
                  <svg
                    className="animate-spin w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="3"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Submitting...
                </>
              ) : (
                <>
                  Submit Intake
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M5 12h14M12 5l7 7-7 7"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </>
              )}
            </button>

            <a
              href="https://zandermooney.com/"
              className="text-xs text-[#5a5652] hover:text-[#c5a452] transition-colors"
              style={{ fontFamily: "var(--font-montserrat)" }}
            >
              ← Back to LPR
            </a>
          </div>

        </form>
      </main>
    </div>
  );
}
