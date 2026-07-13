"use client";

import { useState, useCallback } from "react";

/* ─────────────────────────────────────────────
   Config
───────────────────────────────────────────── */
// Swap this placeholder for the real domain-buying tutorial URL.
const YOUTUBE_DOMAIN_TUTORIAL_LINK = "PASTE_YOUTUBE_DOMAIN_TUTORIAL_LINK_HERE";

/* ─────────────────────────────────────────────
   Types
───────────────────────────────────────────── */
type Package = "" | "LPR Launch" | "LPR Pro";

interface FormData {
  // Section 1 – Package
  packageChoice: Package;
  shopifyOrder: string;
  checkoutEmail: string;

  // Section 2 – Contact
  businessName: string;
  contactName: string;
  email: string;
  phone: string;
  currentWebsite: string;
  businessLocation: string;

  // Section 3 – Business & Offer
  serviceProduct: string;
  mainOffer: string;
  idealCustomer: string;
  desiredAction: string;
  desiredActionOther: string;
  problemSolved: string;
  differentiator: string;
  offerDetails: string;

  // Section 4 – Style
  stylePreference: string[];
  preferredColors: string;
  exampleSites: string;
  dislikedSites: string;

  // Section 5 – Assets
  logoLink: string;
  photoVideoLink: string;
  additionalLinks: string;
  assetNotes: string;

  // Section 6 – Page Content
  existingCopy: string;
  mainServices: string;
  testimonials: string;
  faqs: string;
  guarantees: string;
  disclaimers: string;

  // Section 7 – Domain
  ownsDomain: string; // Yes | No | Not sure
  // If Yes
  domainToConnect: string;
  domainProvider: string;
  hasDnsAccess: string;
  canFollowDns: string;
  // If No
  domainToBuy: string;
  needsBuyingInstructions: string;
  preferredProvider: string;
  // If Not sure
  domainSituation: string;
  needsHelpIdentifying: string;

  // Section 8 – LPR Pro Conversion Integration
  integrationChoice: string; // Calendly | Deposit | Quote
  // Calendly
  hasCalendly: string;
  calendlyLink: string;
  bookingFor: string;
  bookingNotes: string;
  // Deposit / payment
  paymentPlatform: string;
  paymentLink: string;
  paymentAmount: string;
  paymentButtonText: string;
  paymentNotes: string;
  // Quote request
  quoteQuestions: string;
  quoteEmail: string;
  quoteAskPhone: string;
  quoteNotes: string;

  // Section 9 – Final Notes
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

const INTEGRATION_OPTIONS = [
  "Calendly booking embed",
  "Deposit/payment link embed",
  "Quote request form",
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

function SectionHeader({ number, title }: { number: string | number; title: string }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <span className="section-number">
        {typeof number === "number" ? String(number).padStart(2, "0") : number}
      </span>
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

/* Amber/gold accented informational card (warning + instructions) */
function AccentCard({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-3.5 p-4 rounded-lg bg-[rgba(197,164,82,0.05)] border border-[rgba(197,164,82,0.22)] mb-5">
      <div className="flex-shrink-0 text-[#c5a452] mt-0.5">{icon}</div>
      <div className="text-xs text-[#b8b0a4] leading-relaxed space-y-2">{children}</div>
    </div>
  );
}

function WarningIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
      <path
        d="M12 11v5m0-8h.01"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* Single-select pill group (Yes / No / Not sure, etc.) */
function PillGroup({
  options,
  value,
  onChange,
}: {
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-3 mt-1">
      {options.map((opt) => {
        const active = value === opt;
        return (
          <label
            key={opt}
            className={`lpr-checkbox flex-1 min-w-[110px] justify-center${active ? " checked" : ""}`}
            onClick={() => onChange(opt)}
          >
            <span
              className={`w-4 h-4 rounded-full border flex-shrink-0 flex items-center justify-center transition-colors ${
                active ? "border-[#c5a452]" : "border-[rgba(255,255,255,0.2)]"
              }`}
            >
              {active && <span className="w-2 h-2 rounded-full bg-[#c5a452]" />}
            </span>
            <span className="text-sm">{opt}</span>
          </label>
        );
      })}
    </div>
  );
}

/* ─────────────────────────────────────────────
   Main Page
───────────────────────────────────────────── */
export default function IntakePage() {
  const [form, setForm] = useState<FormData>({
    packageChoice: "",
    shopifyOrder: "",
    checkoutEmail: "",
    businessName: "",
    contactName: "",
    email: "",
    phone: "",
    currentWebsite: "",
    businessLocation: "",
    serviceProduct: "",
    mainOffer: "",
    idealCustomer: "",
    desiredAction: "",
    desiredActionOther: "",
    problemSolved: "",
    differentiator: "",
    offerDetails: "",
    stylePreference: [],
    preferredColors: "",
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
    domainToConnect: "",
    domainProvider: "",
    hasDnsAccess: "",
    canFollowDns: "",
    domainToBuy: "",
    needsBuyingInstructions: "",
    preferredProvider: "",
    domainSituation: "",
    needsHelpIdentifying: "",
    integrationChoice: "",
    hasCalendly: "",
    calendlyLink: "",
    bookingFor: "",
    bookingNotes: "",
    paymentPlatform: "",
    paymentLink: "",
    paymentAmount: "",
    paymentButtonText: "",
    paymentNotes: "",
    quoteQuestions: "",
    quoteEmail: "",
    quoteAskPhone: "",
    quoteNotes: "",
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
      if (!e[field]) return e;
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
    setErrors((e) => {
      if (!e.stylePreference) return e;
      const copy = { ...e };
      delete copy.stylePreference;
      return copy;
    });
  }, []);

  const isPro = form.packageChoice === "LPR Pro";
  const hasPackage = form.packageChoice !== "";

  /* ── Client-side validation ── */
  const validate = (): boolean => {
    const e: FormErrors = {};

    // Section 1 — package required
    if (!form.packageChoice) e.packageChoice = "Please select the package you purchased.";

    // Section 2 — contact
    if (!form.businessName.trim()) e.businessName = "Business name is required.";
    if (!form.contactName.trim()) e.contactName = "Contact name is required.";
    if (!form.email.trim()) {
      e.email = "Email address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      e.email = "Please enter a valid email address.";
    }
    if (!form.phone.trim()) e.phone = "Phone number is required.";

    // Section 3 — business & offer
    if (!form.serviceProduct.trim())
      e.serviceProduct = "Please tell us what you're promoting.";
    if (!form.mainOffer.trim()) e.mainOffer = "Main offer is required.";
    if (!form.idealCustomer.trim())
      e.idealCustomer = "Please describe your ideal customer.";
    if (!form.desiredAction) e.desiredAction = "Please select a desired visitor action.";

    // Section 4 — style
    if (form.stylePreference.length === 0)
      e.stylePreference = "Please choose at least one style.";

    // Section 7 — domain (conditional)
    if (!form.ownsDomain) {
      e.ownsDomain = "Please let us know about your domain.";
    } else if (form.ownsDomain === "Yes") {
      if (!form.domainToConnect.trim())
        e.domainToConnect = "Please enter the domain you want connected.";
      if (!form.domainProvider.trim())
        e.domainProvider = "Please tell us where the domain is managed.";
    } else if (form.ownsDomain === "No") {
      if (!form.domainToBuy.trim() && form.needsBuyingInstructions !== "Yes")
        e.domainToBuy =
          "Enter the domain you'd like, or select that you need buying help.";
    }

    // Section 8 — Pro integration (only if Pro)
    if (isPro && !form.integrationChoice)
      e.integrationChoice = "Please choose your conversion integration.";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /* ── Submit ── */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.website_url) return; // honeypot triggered — silent fail

    if (!validate()) {
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
            We received your LPR intake. We&apos;ll review your package, business details,
            assets, domain information, and offer before preparing your landing page build.
            If anything is missing or the wrong package was selected, we&apos;ll contact you
            before starting.
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
            Confirm your package and complete this intake so we can collect your business
            details, offer, assets, style direction, and domain information before we begin
            your LPR landing page.
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

            {/* ═══ SECTION 1: Confirm Your Package ═══ */}
            <div className="lpr-card" data-error={!!errors.packageChoice}>
              <SectionHeader number={1} title="Confirm Your Package" />

              <div className="space-y-5">
                <div>
                  <Label required>Which package did you purchase?</Label>
                  <div className="grid sm:grid-cols-2 gap-3 mt-1">
                    {(["LPR Launch", "LPR Pro"] as const).map((pkg) => {
                      const active = form.packageChoice === pkg;
                      return (
                        <button
                          type="button"
                          key={pkg}
                          onClick={() => set("packageChoice", pkg)}
                          className={`text-left p-4 rounded-lg border transition-colors ${
                            active
                              ? "border-[#c5a452] bg-[rgba(197,164,82,0.1)]"
                              : "border-[rgba(255,255,255,0.09)] bg-[#0f1114] hover:border-[rgba(197,164,82,0.35)]"
                          }`}
                        >
                          <span className="flex items-center gap-2.5">
                            <span
                              className={`w-4 h-4 rounded-full border flex-shrink-0 flex items-center justify-center transition-colors ${
                                active ? "border-[#c5a452]" : "border-[rgba(255,255,255,0.25)]"
                              }`}
                            >
                              {active && (
                                <span className="w-2 h-2 rounded-full bg-[#c5a452]" />
                              )}
                            </span>
                            <span
                              className="text-sm font-bold text-[#e8e4dc] tracking-wide"
                              style={{ fontFamily: "var(--font-montserrat)" }}
                            >
                              {pkg}
                            </span>
                          </span>
                          <span className="block text-xs text-[#5a5652] mt-2 pl-6.5 leading-relaxed">
                            {pkg === "LPR Launch"
                              ? "High-converting landing page build."
                              : "Landing page + one conversion integration."}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                  <FieldError message={errors.packageChoice} />
                </div>

                {/* Warning card */}
                <AccentCard icon={<WarningIcon />}>
                  <p>
                    Please select the exact package you purchased. If the wrong package is
                    selected, your landing page creation may be delayed, and the information
                    in this intake will not be used until the intake is resubmitted with the
                    correct package.
                  </p>
                </AccentCard>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <Label>Shopify Order Number</Label>
                    <input
                      className="lpr-input"
                      placeholder="If available — e.g. #1024"
                      value={form.shopifyOrder}
                      onChange={(e) => set("shopifyOrder", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Email Used at Checkout</Label>
                    <input
                      type="email"
                      className="lpr-input"
                      placeholder="If different from below"
                      value={form.checkoutEmail}
                      onChange={(e) => set("checkoutEmail", e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Everything below is gated behind a package selection */}
            {!hasPackage && (
              <div className="text-center py-10 px-6 rounded-2xl border border-dashed border-[rgba(197,164,82,0.2)] bg-[rgba(197,164,82,0.02)]">
                <p
                  className="text-xs tracking-[0.15em] uppercase text-[#c5a452] mb-2"
                  style={{ fontFamily: "var(--font-montserrat)" }}
                >
                  Select your package to continue
                </p>
                <p className="text-sm text-[#5a5652]">
                  The rest of your intake questions will appear once you confirm your package.
                </p>
              </div>
            )}

            {hasPackage && (
              <>
                {/* ═══ SECTION 2: Contact Info ═══ */}
                <div className="lpr-card">
                  <SectionHeader number={2} title="Contact Info" />
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
                      <Label>Business Location / Service Area</Label>
                      <input
                        className="lpr-input"
                        placeholder="City, State or Country"
                        value={form.businessLocation}
                        onChange={(e) => set("businessLocation", e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* ═══ SECTION 3: Business & Offer ═══ */}
                <div className="lpr-card">
                  <SectionHeader number={3} title="Business & Offer" />
                  <div className="space-y-5">
                    <div data-error={!!errors.serviceProduct}>
                      <Label required>What service or product are you promoting?</Label>
                      <input
                        className={`lpr-input${errors.serviceProduct ? " error" : ""}`}
                        placeholder="e.g. Residential roofing, HVAC installation, coaching program..."
                        value={form.serviceProduct}
                        onChange={(e) => set("serviceProduct", e.target.value)}
                      />
                      <FieldError message={errors.serviceProduct} />
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

                    <div data-error={!!errors.idealCustomer}>
                      <Label required>Who is your ideal customer?</Label>
                      <input
                        className={`lpr-input${errors.idealCustomer ? " error" : ""}`}
                        placeholder="e.g. Homeowners in Texas, 35–55, running Google Ads"
                        value={form.idealCustomer}
                        onChange={(e) => set("idealCustomer", e.target.value)}
                      />
                      <FieldError message={errors.idealCustomer} />
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

                    <div>
                      <Label>What makes your business different?</Label>
                      <textarea
                        className="lpr-input"
                        placeholder="Your edge — experience, guarantees, speed, results, awards..."
                        rows={3}
                        value={form.differentiator}
                        onChange={(e) => set("differentiator", e.target.value)}
                      />
                    </div>

                    <div>
                      <Label>Any important details we should know about your offer?</Label>
                      <textarea
                        className="lpr-input"
                        placeholder="Pricing, availability, restrictions, seasonal notes, etc."
                        rows={3}
                        value={form.offerDetails}
                        onChange={(e) => set("offerDetails", e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* ═══ SECTION 4: Landing Page Style ═══ */}
                <div className="lpr-card">
                  <SectionHeader number={4} title="Landing Page Style" />
                  <div className="space-y-5">
                    <div data-error={!!errors.stylePreference}>
                      <Label required>Preferred Style</Label>
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
                      <FieldError message={errors.stylePreference} />
                    </div>

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

                {/* ═══ SECTION 5: Assets ═══ */}
                <div className="lpr-card">
                  <SectionHeader number={5} title="Assets" />
                  <AccentCard icon={<InfoIcon />}>
                    <p>
                      Please share Google Drive, Dropbox, WeTransfer, or other asset links.
                      Make sure the link is public or shared so LPR can view and download the
                      files.
                    </p>
                  </AccentCard>
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
                      <Label>Business Photo or Video Asset Link</Label>
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

                {/* ═══ SECTION 6: Page Content ═══ */}
                <div className="lpr-card">
                  <SectionHeader number={6} title="Page Content" />
                  <div className="space-y-5">
                    <div>
                      <Label>Do you already have wording or copy you want used?</Label>
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
                      <Label>Testimonials or reviews you want used</Label>
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
                      <Label>Any guarantees, promotions, or special offers?</Label>
                      <textarea
                        className="lpr-input"
                        placeholder="e.g. Free estimates, satisfaction guarantee, limited-time discount..."
                        rows={3}
                        value={form.guarantees}
                        onChange={(e) => set("guarantees", e.target.value)}
                      />
                    </div>

                    <div>
                      <Label>Any required wording, disclaimers, or compliance notes?</Label>
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

                {/* ═══ SECTION 7: Domain Info ═══ */}
                <div className="lpr-card">
                  <SectionHeader number={7} title="Domain Info" />

                  <AccentCard icon={<InfoIcon />}>
                    <p
                      className="text-[#c5a452] font-semibold text-xs tracking-[0.08em] uppercase"
                      style={{ fontFamily: "var(--font-montserrat)" }}
                    >
                      Domain Setup Instructions
                    </p>
                    <p>
                      To connect your landing page, we need your domain information. If you
                      already own a domain, tell us where it was purchased and what domain you
                      want connected. If you do not own a domain yet, you can buy one from a
                      domain provider like Namecheap, GoDaddy, Cloudflare, or Shopify. After
                      buying the domain, do not send your password. We will either give you DNS
                      instructions or ask you to invite/delegate access if your provider
                      supports it.
                    </p>
                    <p>
                      Need help buying a domain? Watch this quick tutorial:{" "}
                      <a
                        href={YOUTUBE_DOMAIN_TUTORIAL_LINK}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#c5a452] underline underline-offset-2 hover:text-[#e0bb6a] break-all"
                      >
                        {YOUTUBE_DOMAIN_TUTORIAL_LINK}
                      </a>
                    </p>
                  </AccentCard>

                  <div className="space-y-5">
                    <div data-error={!!errors.ownsDomain}>
                      <Label required>Do you already own a domain?</Label>
                      <PillGroup
                        options={["Yes", "No", "Not sure"]}
                        value={form.ownsDomain}
                        onChange={(v) => set("ownsDomain", v)}
                      />
                      <FieldError message={errors.ownsDomain} />
                    </div>

                    {/* Domain — YES */}
                    {form.ownsDomain === "Yes" && (
                      <div className="space-y-5 pl-4 border-l border-[rgba(197,164,82,0.2)]">
                        <div data-error={!!errors.domainToConnect}>
                          <Label required>What domain do you want connected?</Label>
                          <input
                            className={`lpr-input${errors.domainToConnect ? " error" : ""}`}
                            placeholder="e.g. mylandingpage.com or subdomain.mybusiness.com"
                            value={form.domainToConnect}
                            onChange={(e) => set("domainToConnect", e.target.value)}
                          />
                          <FieldError message={errors.domainToConnect} />
                        </div>

                        <div data-error={!!errors.domainProvider}>
                          <Label required>Where did you buy / manage the domain?</Label>
                          <input
                            className={`lpr-input${errors.domainProvider ? " error" : ""}`}
                            placeholder="Namecheap, GoDaddy, Cloudflare, Shopify, Squarespace, Wix, Google Domains, other"
                            value={form.domainProvider}
                            onChange={(e) => set("domainProvider", e.target.value)}
                          />
                          <FieldError message={errors.domainProvider} />
                        </div>

                        <div>
                          <Label>Do you have access to the DNS settings?</Label>
                          <PillGroup
                            options={["Yes", "No", "Not sure"]}
                            value={form.hasDnsAccess}
                            onChange={(v) => set("hasDnsAccess", v)}
                          />
                        </div>

                        <div>
                          <Label>Are you able to invite LPR or follow DNS instructions?</Label>
                          <PillGroup
                            options={["Yes", "No", "I need help"]}
                            value={form.canFollowDns}
                            onChange={(v) => set("canFollowDns", v)}
                          />
                        </div>
                      </div>
                    )}

                    {/* Domain — NO */}
                    {form.ownsDomain === "No" && (
                      <div className="space-y-5 pl-4 border-l border-[rgba(197,164,82,0.2)]">
                        <div data-error={!!errors.domainToBuy}>
                          <Label required>What domain name would you like to buy?</Label>
                          <input
                            className={`lpr-input${errors.domainToBuy ? " error" : ""}`}
                            placeholder="e.g. mybusinessoffer.com"
                            value={form.domainToBuy}
                            onChange={(e) => set("domainToBuy", e.target.value)}
                          />
                          <FieldError message={errors.domainToBuy} />
                        </div>

                        <div>
                          <Label>Do you need instructions for buying the domain?</Label>
                          <PillGroup
                            options={["Yes", "No"]}
                            value={form.needsBuyingInstructions}
                            onChange={(v) => set("needsBuyingInstructions", v)}
                          />
                        </div>

                        <div>
                          <Label>Preferred domain provider, if any</Label>
                          <PillGroup
                            options={["Namecheap", "GoDaddy", "Cloudflare", "Shopify", "Not sure"]}
                            value={form.preferredProvider}
                            onChange={(v) => set("preferredProvider", v)}
                          />
                        </div>
                      </div>
                    )}

                    {/* Domain — NOT SURE */}
                    {form.ownsDomain === "Not sure" && (
                      <div className="space-y-5 pl-4 border-l border-[rgba(197,164,82,0.2)]">
                        <div>
                          <Label>Explain what you know about your domain situation</Label>
                          <textarea
                            className="lpr-input"
                            placeholder="Tell us anything you know — old website, who set it up, emails you use, etc."
                            rows={3}
                            value={form.domainSituation}
                            onChange={(e) => set("domainSituation", e.target.value)}
                          />
                        </div>

                        <div>
                          <Label>
                            Do you need LPR to help identify where your domain is managed?
                          </Label>
                          <PillGroup
                            options={["Yes", "No"]}
                            value={form.needsHelpIdentifying}
                            onChange={(v) => set("needsHelpIdentifying", v)}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* ═══ SECTION 8: LPR Pro Conversion Integration (Pro only) ═══ */}
                {isPro && (
                  <div className="lpr-card">
                    <SectionHeader number={8} title="LPR Pro Conversion Integration" />
                    <p className="text-sm text-[#9a9590] leading-relaxed mb-6">
                      LPR Pro includes one simple conversion integration. Choose the one you
                      want connected and styled inside your landing page. Client provides the
                      account. LPR connects, embeds, and styles it.
                    </p>

                    <div className="space-y-5">
                      <div data-error={!!errors.integrationChoice}>
                        <Label required>Choose your integration</Label>
                        <div className="grid gap-2.5 mt-1">
                          {INTEGRATION_OPTIONS.map((opt) => {
                            const active = form.integrationChoice === opt;
                            return (
                              <label
                                key={opt}
                                className={`lpr-checkbox justify-start${active ? " checked" : ""}`}
                                onClick={() => set("integrationChoice", opt)}
                              >
                                <span
                                  className={`w-4 h-4 rounded-full border flex-shrink-0 flex items-center justify-center transition-colors ${
                                    active
                                      ? "border-[#c5a452]"
                                      : "border-[rgba(255,255,255,0.2)]"
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
                        <FieldError message={errors.integrationChoice} />
                      </div>

                      {/* Calendly */}
                      {form.integrationChoice === "Calendly booking embed" && (
                        <div className="space-y-5 pl-4 border-l border-[rgba(197,164,82,0.2)]">
                          <div>
                            <Label>Do you already have a Calendly account?</Label>
                            <PillGroup
                              options={["Yes", "No", "I need instructions"]}
                              value={form.hasCalendly}
                              onChange={(v) => set("hasCalendly", v)}
                            />
                          </div>
                          <div>
                            <Label>Calendly scheduling link, if available</Label>
                            <input
                              type="url"
                              className="lpr-input"
                              placeholder="https://calendly.com/..."
                              value={form.calendlyLink}
                              onChange={(e) => set("calendlyLink", e.target.value)}
                            />
                          </div>
                          <div>
                            <Label>What should the booking be for?</Label>
                            <input
                              className="lpr-input"
                              placeholder="e.g. consultation, estimate, appointment, quote call"
                              value={form.bookingFor}
                              onChange={(e) => set("bookingFor", e.target.value)}
                            />
                          </div>
                          <div>
                            <Label>Any booking notes or instructions?</Label>
                            <textarea
                              className="lpr-input"
                              placeholder="Availability, buffer times, what to tell bookers, etc."
                              rows={3}
                              value={form.bookingNotes}
                              onChange={(e) => set("bookingNotes", e.target.value)}
                            />
                          </div>
                        </div>
                      )}

                      {/* Deposit / payment */}
                      {form.integrationChoice === "Deposit/payment link embed" && (
                        <div className="space-y-5 pl-4 border-l border-[rgba(197,164,82,0.2)]">
                          <div>
                            <Label>What payment platform are you using?</Label>
                            <PillGroup
                              options={[
                                "Stripe",
                                "Shopify",
                                "Square",
                                "PayPal",
                                "Other",
                                "I need instructions",
                              ]}
                              value={form.paymentPlatform}
                              onChange={(v) => set("paymentPlatform", v)}
                            />
                          </div>
                          <div>
                            <Label>Payment / deposit link, if available</Label>
                            <input
                              type="url"
                              className="lpr-input"
                              placeholder="https://..."
                              value={form.paymentLink}
                              onChange={(e) => set("paymentLink", e.target.value)}
                            />
                          </div>
                          <div>
                            <Label>Deposit amount or payment amount</Label>
                            <input
                              className="lpr-input"
                              placeholder="e.g. $99 deposit, $250 flat, etc."
                              value={form.paymentAmount}
                              onChange={(e) => set("paymentAmount", e.target.value)}
                            />
                          </div>
                          <div>
                            <Label>What should the payment button say?</Label>
                            <input
                              className="lpr-input"
                              placeholder="e.g. Pay Deposit, Reserve My Spot, Book Now"
                              value={form.paymentButtonText}
                              onChange={(e) => set("paymentButtonText", e.target.value)}
                            />
                          </div>
                          <div>
                            <Label>Any payment notes or instructions?</Label>
                            <textarea
                              className="lpr-input"
                              placeholder="Refund policy, what the payment covers, etc."
                              rows={3}
                              value={form.paymentNotes}
                              onChange={(e) => set("paymentNotes", e.target.value)}
                            />
                          </div>
                        </div>
                      )}

                      {/* Quote request */}
                      {form.integrationChoice === "Quote request form" && (
                        <div className="space-y-5 pl-4 border-l border-[rgba(197,164,82,0.2)]">
                          <div>
                            <Label>What questions should the quote form ask?</Label>
                            <textarea
                              className="lpr-input"
                              placeholder="List each field you want — e.g. name, service needed, budget, timeline..."
                              rows={4}
                              value={form.quoteQuestions}
                              onChange={(e) => set("quoteQuestions", e.target.value)}
                            />
                          </div>
                          <div>
                            <Label>What email should quote requests go to?</Label>
                            <input
                              type="email"
                              className="lpr-input"
                              placeholder="you@yourbusiness.com"
                              value={form.quoteEmail}
                              onChange={(e) => set("quoteEmail", e.target.value)}
                            />
                          </div>
                          <div>
                            <Label>Should the form ask for phone number?</Label>
                            <PillGroup
                              options={["Yes", "No"]}
                              value={form.quoteAskPhone}
                              onChange={(v) => set("quoteAskPhone", v)}
                            />
                          </div>
                          <div>
                            <Label>Any quote form notes or instructions?</Label>
                            <textarea
                              className="lpr-input"
                              placeholder="Anything else about how the quote request should work."
                              rows={3}
                              value={form.quoteNotes}
                              onChange={(e) => set("quoteNotes", e.target.value)}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* ═══ SECTION 9: Final Notes ═══ */}
                <div className="lpr-card">
                  <SectionHeader number={isPro ? 9 : 8} title="Final Notes" />
                  <div>
                    <Label>
                      Anything else we should know before building your LPR landing page?
                    </Label>
                    <textarea
                      className="lpr-input"
                      placeholder="Any final context, specific requests, timing notes, or questions for the LPR team..."
                      rows={5}
                      value={form.finalNotes}
                      onChange={(e) => set("finalNotes", e.target.value)}
                    />
                  </div>
                </div>
              </>
            )}

          </div>

          {/* ── Validation / error banners ── */}
          {Object.keys(errors).length > 0 && (
            <div className="mt-6 p-4 rounded-lg border border-red-500/20 bg-red-500/8 text-sm text-red-300">
              Please review the highlighted fields before submitting.
            </div>
          )}

          {status === "error" && (
            <div className="mt-4 p-4 rounded-lg border border-red-500/30 bg-red-500/10 text-sm text-red-300">
              {errorMessage || "Something went wrong. Please try again."}
            </div>
          )}

          {/* ── Submit ── */}
          {hasPackage && (
            <div className="mt-10 flex flex-col items-center gap-5">
              <button
                type="submit"
                disabled={status === "submitting"}
                className="lpr-btn w-full sm:w-auto min-w-[220px]"
              >
                {status === "submitting" ? (
                  <>
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
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
          )}

        </form>
      </main>
    </div>
  );
}
