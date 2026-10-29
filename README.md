# Placement Preceptor — v6 (three page upgrades)

A five-page, responsive, static website that can deploy directly to **Render Static Site**. The existing Home and Explore Rotations pages remain intact. The rotation records are **fictional demonstration examples**.

## Upgrades requested

1. **How It Works:** a visible five-stage process (student submits requirements → coordination team identifies a possible preceptor → clinician agrees → university approves → clinical rotation starts), plus separate interactive views for students, clinicians and schools. No promise of guaranteed placement or automatic school approval.
2. **For Preceptors:** replaces the old mentorship snapshot with a multi-step **Become a Preceptor** form. Professional name, professional designation, specialty, licensing state, optional NPI, experience, practice/location, clinical setting, patient population, start month, teaching schedule, student capacity, contact details and consent. Browser validation, review screen, and secure endpoint wiring included.
3. **Resources:** 11 detailed educational guides, searchable by keyword/audience, including new articles on qualifications, preparing a preceptor request, and clinical-hours scheduling. No checkbox tracking, Print Guide or PDF-printing feature.

## Critical: activating preceptor application submissions

**Static hosting does not provide an application database or inbox.** The form is safe in **preview-only mode** until a secure, functioning intake endpoint is configured. In that mode, it validates entries and lets you **copy the summary**, but does not submit, store or email personal information. Do not advertise it as accepting applications until the endpoint has been connected and tested.

A no-backend option is a hosted form service such as Formspree:

1. Create and verify an account/form with your preferred form-handling service, review its data handling, privacy commitments, security and spam protections.
2. Confirm the endpoint supports an HTTPS `POST` accepting `FormData`, responds to cross-origin browser requests from the Render site, and returns a success status. For Formspree an action endpoint resembles `https://formspree.io/f/XXXXYYYY`.
3. Open **`config.js`** and set `window.PP_PRECEPTOR_ENDPOINT = 'https://...';` with the actual form endpoint. **Never place API keys, passwords, tokens or private credentials in frontend JS.**
4. Publish appropriate privacy/contact information on the site, complete required notices, and test consent/record handling with dummy data.
5. `git add .`, `git commit -m "Placement Preceptor v6 registration and guides"`, `git push` to the repository's main branch. If Render Auto Deploy is enabled, the updated site will deploy automatically.
6. Test with a fictional email/sample applicant and verify the test record is received in the form provider's inbox or service. The UI reports success only when the HTTP response indicates acceptance; that does not mean the clinician has been verified, accepted or matched.

For a full production platform, build server-side validation, rate limiting, consent records, secure clinician verification workflows, and a proper access-controlled CRM/database. Do not collect patient medical information through this form. Professional NPI is optional and **does not establish current licensure or eligibility**.

## Local preview

Extract and open `index.html`, or from the extracted directory run `python -m http.server 8000`, then visit `http://localhost:8000/`.

The website includes five HTML pages, shared CSS/JS, `config.js`, `preceptor-application.js`, example image assets and Node.js tests.

## Render Static Site settings

- Branch: `main`
- Root directory: blank
- Build command: `echo "No build required"`
- Publish directory: `.`

## Preserved / not added

- No maps, Leaflet, CARTO or map API keys.
- No Resources checkboxes, checklist progress or printing.
- Original header **Find a Match**, saved demonstration rotations, comparison cards, rule-based help chat and existing student placement-brief demonstration preserved.
- Student placement brief remains **demo-only** until its own secure backend is set up.

Version: v6 · 30 October 2026
