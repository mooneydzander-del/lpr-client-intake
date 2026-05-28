import { NextRequest, NextResponse } from "next/server";

/* ─────────────────────────────────────────────
   Types
───────────────────────────────────────────── */
interface IntakePayload {
  // Section 1
  businessName: string;
  contactName: string;
  email: string;
  phone: string;
  currentWebsite?: string;
  businessLocation?: string;
  // Section 2
  serviceProduct?: string;
  mainOffer: string;
  idealCustomer?: string;
  problemSolved?: string;
  desiredAction: string;
  desiredActionOther?: string;
  // Section 3
  preferredColors?: string;
  stylePreference?: string;
  exampleSites?: string;
  dislikedSites?: string;
  // Section 4
  logoLink?: string;
  photoVideoLink?: string;
  additionalLinks?: string;
  assetNotes?: string;
  // Section 5
  existingCopy?: string;
  mainServices?: string;
  testimonials?: string;
  faqs?: string;
  guarantees?: string;
  disclaimers?: string;
  // Section 6
  ownsDomain?: string;
  desiredDomain?: string;
  domainRegistrar?: string;
  needsDomainHelp?: string;
  // Section 7
  wantsCinematicBg?: string;
  cinematicStyle?: string;
  // Section 8
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

function buildEmailHtml(p: IntakePayload): string {
  const action = p.desiredAction === "Other" && p.desiredActionOther
    ? `Other — ${p.desiredActionOther}`
    : p.desiredAction;

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"/></head>
<body style="background:#080a0c;margin:0;padding:32px 16px;font-family:sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:640px;margin:0 auto">
    <tr><td style="padding:0 0 24px">
      <div style="font-size:11px;font-weight:700;letter-spacing:0.25em;text-transform:uppercase;color:#c5a452;margin-bottom:8px">Landing Page Rocket</div>
      <div style="font-size:24px;font-weight:900;color:#e8e4dc">New Client Intake</div>
      <div style="font-size:13px;color:#5a5652;margin-top:4px">${new Date().toLocaleString()}</div>
    </td></tr>
    <tr><td>
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#13161a;border-radius:12px;border:1px solid rgba(255,255,255,0.07);overflow:hidden">
        ${section("01 — Contact Info", [
          row("Business", p.businessName),
          row("Contact", p.contactName),
          row("Email", p.email),
          row("Phone", p.phone),
          row("Website", p.currentWebsite),
          row("Location", p.businessLocation),
        ])}
        ${section("02 — Offer", [
          row("Service/Product", p.serviceProduct),
          row("Main Offer", p.mainOffer),
          row("Ideal Customer", p.idealCustomer),
          row("Problem Solved", p.problemSolved),
          row("Desired Action", action),
        ])}
        ${section("03 — Style", [
          row("Colors", p.preferredColors),
          row("Style", p.stylePreference),
          row("Examples", p.exampleSites),
          row("Dislikes", p.dislikedSites),
        ])}
        ${section("04 — Assets", [
          row("Logo Link", p.logoLink),
          row("Photo/Video", p.photoVideoLink),
          row("Other Links", p.additionalLinks),
          row("Asset Notes", p.assetNotes),
        ])}
        ${section("05 — Content", [
          row("Existing Copy", p.existingCopy),
          row("Services", p.mainServices),
          row("Testimonials", p.testimonials),
          row("FAQs", p.faqs),
          row("Guarantees", p.guarantees),
          row("Disclaimers", p.disclaimers),
        ])}
        ${section("06 — Domain", [
          row("Owns Domain?", p.ownsDomain),
          row("Desired Domain", p.desiredDomain),
          row("Registrar", p.domainRegistrar),
          row("Needs Help?", p.needsDomainHelp),
        ])}
        ${section("07 — Cinematic", [
          row("Wants Cinematic BG?", p.wantsCinematicBg),
          row("Style", p.cinematicStyle),
        ])}
        ${section("08 — Final Notes", [
          row("Notes", p.finalNotes),
        ])}
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
  const action = p.desiredAction === "Other" && p.desiredActionOther
    ? `Other — ${p.desiredActionOther}`
    : p.desiredAction;

  const lines = [
    "=== LPR NEW CLIENT INTAKE ===",
    `Submitted: ${new Date().toLocaleString()}`,
    "",
    "--- CONTACT ---",
    `Business: ${p.businessName}`,
    `Contact: ${p.contactName}`,
    `Email: ${p.email}`,
    `Phone: ${p.phone}`,
    `Website: ${p.currentWebsite || "—"}`,
    `Location: ${p.businessLocation || "—"}`,
    "",
    "--- OFFER ---",
    `Service/Product: ${p.serviceProduct || "—"}`,
    `Main Offer: ${p.mainOffer}`,
    `Ideal Customer: ${p.idealCustomer || "—"}`,
    `Problem Solved: ${p.problemSolved || "—"}`,
    `Desired Action: ${action}`,
    "",
    "--- STYLE ---",
    `Colors: ${p.preferredColors || "—"}`,
    `Style: ${p.stylePreference || "—"}`,
    `Examples: ${p.exampleSites || "—"}`,
    `Dislikes: ${p.dislikedSites || "—"}`,
    "",
    "--- ASSETS ---",
    `Logo: ${p.logoLink || "—"}`,
    `Photo/Video: ${p.photoVideoLink || "—"}`,
    `Other Links: ${p.additionalLinks || "—"}`,
    `Asset Notes: ${p.assetNotes || "—"}`,
    "",
    "--- CONTENT ---",
    `Existing Copy: ${p.existingCopy || "—"}`,
    `Services: ${p.mainServices || "—"}`,
    `Testimonials: ${p.testimonials || "—"}`,
    `FAQs: ${p.faqs || "—"}`,
    `Guarantees: ${p.guarantees || "—"}`,
    `Disclaimers: ${p.disclaimers || "—"}`,
    "",
    "--- DOMAIN ---",
    `Owns Domain? ${p.ownsDomain || "—"}`,
    `Desired Domain: ${p.desiredDomain || "—"}`,
    `Registrar: ${p.domainRegistrar || "—"}`,
    `Needs Help? ${p.needsDomainHelp || "—"}`,
    "",
    "--- CINEMATIC ---",
    `Wants BG Video? ${p.wantsCinematicBg || "—"}`,
    `Style: ${p.cinematicStyle || "—"}`,
    "",
    "--- FINAL NOTES ---",
    p.finalNotes || "—",
  ];
  return lines.join("\n");
}

function buildTelegramMessage(p: IntakePayload): string {
  const action = p.desiredAction === "Other" && p.desiredActionOther
    ? `Other — ${p.desiredActionOther}`
    : p.desiredAction;

  return [
    "🚀 *New LPR client intake submitted*",
    "",
    `*Business:* ${p.businessName}`,
    `*Contact:* ${p.contactName}`,
    `*Email:* ${p.email}`,
    `*Phone:* ${p.phone}`,
    `*Desired Action:* ${action}`,
    `*Domain:* ${p.desiredDomain || "—"}`,
    `*Cinematic Video:* ${p.wantsCinematicBg || "—"}`,
  ].join("\n");
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
    required(body.businessName, "Business Name"),
    required(body.contactName, "Contact Name"),
    required(body.email, "Email"),
    required(body.phone, "Phone"),
    required(body.mainOffer, "Main Offer"),
    required(body.desiredAction, "Desired Action"),
  ]
    .filter(Boolean)
    .forEach((e) => e && validationErrors.push(e));

  if (body.email && !isValidEmail(body.email)) {
    validationErrors.push("Invalid email format.");
  }

  if (validationErrors.length > 0) {
    return NextResponse.json(
      { error: validationErrors.join(" ") },
      { status: 422 }
    );
  }

  const resendKey = process.env.RESEND_API_KEY;
  const notifyEmail = process.env.INTAKE_NOTIFY_EMAIL;
  const fromEmail = process.env.INTAKE_FROM_EMAIL || "intake@lpr-intake.com";

  /* ── Send email via Resend ── */
  if (resendKey && notifyEmail) {
    try {
      const { Resend } = await import("resend");
      const resend = new Resend(resendKey);

      await resend.emails.send({
        from: fromEmail,
        to: notifyEmail,
        subject: `New LPR Intake — ${body.businessName} (${body.contactName})`,
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
