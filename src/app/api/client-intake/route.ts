import { NextRequest, NextResponse } from "next/server";

/* ─────────────────────────────────────────────
   Types
───────────────────────────────────────────── */
interface IntakePayload {
  // Section 1 — Package
  packageChoice: string; // "LPR Launch" | "LPR Pro"
  shopifyOrder?: string;
  checkoutEmail?: string;

  // Section 2 — Contact
  businessName: string;
  contactName: string;
  email: string;
  phone: string;
  currentWebsite?: string;
  businessLocation?: string;

  // Section 3 — Business & Offer
  serviceProduct?: string;
  mainOffer: string;
  idealCustomer?: string;
  desiredAction: string;
  desiredActionOther?: string;
  problemSolved?: string;
  differentiator?: string;
  offerDetails?: string;

  // Section 4 — Style
  stylePreference?: string;
  preferredColors?: string;
  exampleSites?: string;
  dislikedSites?: string;

  // Section 5 — Assets
  logoLink?: string;
  photoVideoLink?: string;
  additionalLinks?: string;
  assetNotes?: string;

  // Section 6 — Page Content
  existingCopy?: string;
  mainServices?: string;
  testimonials?: string;
  faqs?: string;
  guarantees?: string;
  disclaimers?: string;

  // Section 7 — Domain
  ownsDomain?: string;
  domainToConnect?: string;
  domainProvider?: string;
  hasDnsAccess?: string;
  canFollowDns?: string;
  domainToBuy?: string;
  needsBuyingInstructions?: string;
  preferredProvider?: string;
  domainSituation?: string;
  needsHelpIdentifying?: string;

  // Section 8 — LPR Pro Conversion Integration
  integrationChoice?: string;
  hasCalendly?: string;
  calendlyLink?: string;
  bookingFor?: string;
  bookingNotes?: string;
  paymentPlatform?: string;
  paymentLink?: string;
  paymentAmount?: string;
  paymentButtonText?: string;
  paymentNotes?: string;
  quoteQuestions?: string;
  quoteEmail?: string;
  quoteAskPhone?: string;
  quoteNotes?: string;

  // Section 9 — Final Notes
  finalNotes?: string;

  // Honeypot
  website_url?: string;
}

/* ─────────────────────────────────────────────
   Helpers
───────────────────────────────────────────── */
function required(value: unknown, name: string): string | null {
  if (!value || (typeof value === "string" && !value.trim())) {
    return `${name} is required.`;
  }
  return null;
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function row(label: string, value: string | undefined): string {
  if (!value || !value.trim()) return "";
  return `<tr><td style="padding:8px 12px;color:#9a9590;font-size:13px;white-space:nowrap;vertical-align:top;font-family:sans-serif">${label}</td><td style="padding:8px 12px;color:#e8e4dc;font-size:13px;vertical-align:top;font-family:sans-serif">${value.replace(/\n/g, "<br/>")}</td></tr>`;
}

function section(title: string, rows: string[]): string {
  const content = rows.filter(Boolean).join("");
  if (!content) return "";
  return `
    <tr><td colspan="2" style="padding:20px 12px 8px;background:#0f1114">
      <div style="font-family:sans-serif;font-size:10px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:#c5a452">${title}</div>
    </td></tr>
    ${content}
  `;
}

function actionLabel(p: IntakePayload): string {
  return p.desiredAction === "Other" && p.desiredActionOther
    ? `Other — ${p.desiredActionOther}`
    : p.desiredAction;
}

/* Build the Pro-integration rows depending on which integration was chosen. */
function proIntegrationRows(p: IntakePayload): string[] {
  const rows = [row("Integration", p.integrationChoice)];

  if (p.integrationChoice === "Calendly booking embed") {
    rows.push(
      row("Has Calendly?", p.hasCalendly),
      row("Scheduling Link", p.calendlyLink),
      row("Booking For", p.bookingFor),
      row("Booking Notes", p.bookingNotes)
    );
  } else if (p.integrationChoice === "Deposit/payment link embed") {
    rows.push(
      row("Payment Platform", p.paymentPlatform),
      row("Payment Link", p.paymentLink),
      row("Amount", p.paymentAmount),
      row("Button Text", p.paymentButtonText),
      row("Payment Notes", p.paymentNotes)
    );
  } else if (p.integrationChoice === "Quote request form") {
    rows.push(
      row("Form Questions", p.quoteQuestions),
      row("Quotes Go To", p.quoteEmail),
      row("Ask Phone?", p.quoteAskPhone),
      row("Quote Notes", p.quoteNotes)
    );
  }

  return rows;
}

function buildEmailHtml(p: IntakePayload): string {
  const isPro = p.packageChoice === "LPR Pro";

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"/></head>
<body style="background:#080a0c;margin:0;padding:32px 16px;font-family:sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:640px;margin:0 auto">
    <tr><td style="padding:0 0 24px">
      <div style="font-size:11px;font-weight:700;letter-spacing:0.25em;text-transform:uppercase;color:#c5a452;margin-bottom:8px">Landing Page Rocket</div>
      <div style="font-size:24px;font-weight:900;color:#e8e4dc">New Client Intake</div>
      <div style="display:inline-block;margin-top:10px;padding:4px 12px;border-radius:999px;background:rgba(197,164,82,0.12);border:1px solid rgba(197,164,82,0.35);font-size:12px;font-weight:700;letter-spacing:0.08em;color:#e0bb6a">${p.packageChoice || "NO PACKAGE SELECTED"}</div>
      <div style="font-size:13px;color:#5a5652;margin-top:8px">${new Date().toLocaleString()}</div>
    </td></tr>
    <tr><td>
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#13161a;border-radius:12px;border:1px solid rgba(255,255,255,0.07);overflow:hidden">
        ${section("Package", [
          row("Package", p.packageChoice),
          row("Shopify Order", p.shopifyOrder),
          row("Checkout Email", p.checkoutEmail),
        ])}
        ${section("Contact", [
          row("Business", p.businessName),
          row("Contact", p.contactName),
          row("Email", p.email),
          row("Phone", p.phone),
          row("Website", p.currentWebsite),
          row("Location", p.businessLocation),
        ])}
        ${section("Business & Offer", [
          row("Service/Product", p.serviceProduct),
          row("Main Offer", p.mainOffer),
          row("Ideal Customer", p.idealCustomer),
          row("Desired Action", actionLabel(p)),
          row("Problem Solved", p.problemSolved),
          row("Differentiator", p.differentiator),
          row("Offer Details", p.offerDetails),
        ])}
        ${section("Style", [
          row("Preferred Style", p.stylePreference),
          row("Colors", p.preferredColors),
          row("Examples", p.exampleSites),
          row("Dislikes", p.dislikedSites),
        ])}
        ${section("Assets", [
          row("Logo Link", p.logoLink),
          row("Photo/Video", p.photoVideoLink),
          row("Other Links", p.additionalLinks),
          row("Asset Notes", p.assetNotes),
        ])}
        ${section("Page Content", [
          row("Existing Copy", p.existingCopy),
          row("Services", p.mainServices),
          row("Testimonials", p.testimonials),
          row("FAQs", p.faqs),
          row("Guarantees", p.guarantees),
          row("Disclaimers", p.disclaimers),
        ])}
        ${section("Domain", [
          row("Owns Domain?", p.ownsDomain),
          row("Domain to Connect", p.domainToConnect),
          row("Provider", p.domainProvider),
          row("DNS Access?", p.hasDnsAccess),
          row("Can Follow DNS?", p.canFollowDns),
          row("Domain to Buy", p.domainToBuy),
          row("Needs Buying Help?", p.needsBuyingInstructions),
          row("Preferred Provider", p.preferredProvider),
          row("Domain Situation", p.domainSituation),
          row("Needs Help Identifying?", p.needsHelpIdentifying),
        ])}
        ${isPro ? section("Pro Integration", proIntegrationRows(p)) : ""}
        ${section("Final Notes", [row("Notes", p.finalNotes)])}
      </table>
    </td></tr>
    <tr><td style="padding:24px 0 0">
      <div style="font-size:11px;color:#5a5652;font-family:sans-serif">Landing Page Rocket · lpr-client-intake · automated notification</div>
    </td></tr>
  </table>
</body>
</html>`;
}

function buildEmailText(p: IntakePayload): string {
  const isPro = p.packageChoice === "LPR Pro";

  const lines = [
    "=== LPR NEW CLIENT INTAKE ===",
    `Package: ${p.packageChoice || "NO PACKAGE SELECTED"}`,
    `Submitted: ${new Date().toLocaleString()}`,
    "",
    "--- PACKAGE ---",
    `Package: ${p.packageChoice || "—"}`,
    `Shopify Order: ${p.shopifyOrder || "—"}`,
    `Checkout Email: ${p.checkoutEmail || "—"}`,
    "",
    "--- CONTACT ---",
    `Business: ${p.businessName}`,
    `Contact: ${p.contactName}`,
    `Email: ${p.email}`,
    `Phone: ${p.phone}`,
    `Website: ${p.currentWebsite || "—"}`,
    `Location: ${p.businessLocation || "—"}`,
    "",
    "--- BUSINESS & OFFER ---",
    `Service/Product: ${p.serviceProduct || "—"}`,
    `Main Offer: ${p.mainOffer}`,
    `Ideal Customer: ${p.idealCustomer || "—"}`,
    `Desired Action: ${actionLabel(p)}`,
    `Problem Solved: ${p.problemSolved || "—"}`,
    `Differentiator: ${p.differentiator || "—"}`,
    `Offer Details: ${p.offerDetails || "—"}`,
    "",
    "--- STYLE ---",
    `Preferred Style: ${p.stylePreference || "—"}`,
    `Colors: ${p.preferredColors || "—"}`,
    `Examples: ${p.exampleSites || "—"}`,
    `Dislikes: ${p.dislikedSites || "—"}`,
    "",
    "--- ASSETS ---",
    `Logo: ${p.logoLink || "—"}`,
    `Photo/Video: ${p.photoVideoLink || "—"}`,
    `Other Links: ${p.additionalLinks || "—"}`,
    `Asset Notes: ${p.assetNotes || "—"}`,
    "",
    "--- PAGE CONTENT ---",
    `Existing Copy: ${p.existingCopy || "—"}`,
    `Services: ${p.mainServices || "—"}`,
    `Testimonials: ${p.testimonials || "—"}`,
    `FAQs: ${p.faqs || "—"}`,
    `Guarantees: ${p.guarantees || "—"}`,
    `Disclaimers: ${p.disclaimers || "—"}`,
    "",
    "--- DOMAIN ---",
    `Owns Domain? ${p.ownsDomain || "—"}`,
    `Domain to Connect: ${p.domainToConnect || "—"}`,
    `Provider: ${p.domainProvider || "—"}`,
    `DNS Access? ${p.hasDnsAccess || "—"}`,
    `Can Follow DNS? ${p.canFollowDns || "—"}`,
    `Domain to Buy: ${p.domainToBuy || "—"}`,
    `Needs Buying Help? ${p.needsBuyingInstructions || "—"}`,
    `Preferred Provider: ${p.preferredProvider || "—"}`,
    `Domain Situation: ${p.domainSituation || "—"}`,
    `Needs Help Identifying? ${p.needsHelpIdentifying || "—"}`,
  ];

  if (isPro) {
    lines.push(
      "",
      "--- PRO INTEGRATION ---",
      `Integration: ${p.integrationChoice || "—"}`
    );
    if (p.integrationChoice === "Calendly booking embed") {
      lines.push(
        `Has Calendly? ${p.hasCalendly || "—"}`,
        `Scheduling Link: ${p.calendlyLink || "—"}`,
        `Booking For: ${p.bookingFor || "—"}`,
        `Booking Notes: ${p.bookingNotes || "—"}`
      );
    } else if (p.integrationChoice === "Deposit/payment link embed") {
      lines.push(
        `Payment Platform: ${p.paymentPlatform || "—"}`,
        `Payment Link: ${p.paymentLink || "—"}`,
        `Amount: ${p.paymentAmount || "—"}`,
        `Button Text: ${p.paymentButtonText || "—"}`,
        `Payment Notes: ${p.paymentNotes || "—"}`
      );
    } else if (p.integrationChoice === "Quote request form") {
      lines.push(
        `Form Questions: ${p.quoteQuestions || "—"}`,
        `Quotes Go To: ${p.quoteEmail || "—"}`,
        `Ask Phone? ${p.quoteAskPhone || "—"}`,
        `Quote Notes: ${p.quoteNotes || "—"}`
      );
    }
  }

  lines.push("", "--- FINAL NOTES ---", p.finalNotes || "—");

  return lines.join("\n");
}

function buildTelegramMessage(p: IntakePayload): string {
  const parts = [
    "🚀 *New LPR client intake submitted*",
    "",
    `*Package:* ${p.packageChoice || "—"}`,
    `*Business:* ${p.businessName}`,
    `*Contact:* ${p.contactName}`,
    `*Email:* ${p.email}`,
    `*Phone:* ${p.phone}`,
    `*Desired Action:* ${actionLabel(p)}`,
  ];

  if (p.packageChoice === "LPR Pro" && p.integrationChoice) {
    parts.push(`*Pro Integration:* ${p.integrationChoice}`);
  }

  return parts.join("\n");
}

/* ─────────────────────────────────────────────
   POST handler
───────────────────────────────────────────── */
export async function POST(req: NextRequest) {
  let body: IntakePayload;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  // Honeypot check
  if (body.website_url) {
    return NextResponse.json({ ok: true }); // silent pass for bots
  }

  // Server-side validation
  const validationErrors: string[] = [];
  [
    required(body.packageChoice, "Package selection"),
    required(body.businessName, "Business Name"),
    required(body.contactName, "Contact Name"),
    required(body.email, "Email"),
    required(body.phone, "Phone"),
    required(body.mainOffer, "Main Offer"),
    required(body.desiredAction, "Desired Action"),
  ]
    .filter(Boolean)
    .forEach((e) => e && validationErrors.push(e));

  if (body.packageChoice && !["LPR Launch", "LPR Pro"].includes(body.packageChoice)) {
    validationErrors.push("Invalid package selection.");
  }

  if (body.email && !isValidEmail(body.email)) {
    validationErrors.push("Invalid email format.");
  }

  // If LPR Pro, an integration choice is required.
  if (body.packageChoice === "LPR Pro") {
    const err = required(body.integrationChoice, "Conversion integration");
    if (err) validationErrors.push(err);
  }

  if (validationErrors.length > 0) {
    return NextResponse.json(
      { error: validationErrors.join(" ") },
      { status: 422 }
    );
  }

  const resendKey = process.env.RESEND_API_KEY;
  const notifyEmail = process.env.INTAKE_NOTIFY_EMAIL;
  const fromEmail = process.env.INTAKE_FROM_EMAIL;

  if (!fromEmail) {
    console.error("[LPR intake] INTAKE_FROM_EMAIL is not set.");
    return NextResponse.json(
      { error: "Server misconfiguration: sender address not configured." },
      { status: 500 }
    );
  }

  console.log(`[LPR intake] Sending from: ${fromEmail}`);

  /* ── Send email via Resend ── */
  if (resendKey && notifyEmail) {
    try {
      const { Resend } = await import("resend");
      const resend = new Resend(resendKey);

      await resend.emails.send({
        from: fromEmail,
        to: notifyEmail,
        subject: `New LPR Intake — ${body.packageChoice} — ${body.businessName} (${body.contactName})`,
        html: buildEmailHtml(body),
        text: buildEmailText(body),
      });
    } catch (err) {
      console.error("[LPR intake] Resend error:", err);
      // Non-fatal — still return success if email fails
    }
  }

  /* ── Send Telegram alert ── */
  const tgToken = process.env.TELEGRAM_BOT_TOKEN;
  const tgChat = process.env.TELEGRAM_CHAT_ID_GENERAL;

  if (tgToken && tgChat) {
    try {
      const text = buildTelegramMessage(body);
      await fetch(`https://api.telegram.org/bot${tgToken}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: tgChat,
          text,
          parse_mode: "Markdown",
        }),
      });
    } catch (err) {
      console.error("[LPR intake] Telegram error:", err);
      // Non-fatal
    }
  }

  return NextResponse.json({ ok: true, message: "Intake received." });
}
