# Placement Preceptor v5 — Streamlined multi-page clinical placement prototype

## Open the website

Extract the ZIP, keep the folders together, then open **index.html**. Every page is a standalone HTML file. For local development, run `python -m http.server 8000` in this folder.

## Five independent pages

- **Home:** photography, specialty discovery, audience entry points, rotation search.
- **Explore rotations:** map-free search directory with 19 fictional examples, advanced filters, saved options, non-checkbox compare buttons, side-by-side detail comparison and grid/list views.
- **How it works:** interactive five-step journeys for students, preceptors and schools, with clear educational preparation information (no checklist UI).
- **For preceptors:** mentor information and practice planning demonstration.
- **Resources:** searchable guides, full articles and FAQs, without action checkboxes or print/PDF controls.

## Header action

**Find a Match** is visible in the header on desktop, tablet and mobile. It opens the existing multi-step placement brief demonstration. This form does not send a request, connect to a coordinator or reserve a placement.

## Removed by request

- No Leaflet / CARTO / OpenStreetMap map, map pins, map buttons or map-related API keys.
- No checkbox controls, action checklist tracking or checklists stored in browser localStorage.
- No print-guide page, Print Guide button, printing JavaScript or PDF-generation controls.

## Files

`index.html`, `explore.html`, `how-it-works.html`, `for-preceptors.html`, `resources.html`, `app.js`, `chat.js`, `data.js`, `style.css`, `assets/`, `tests/`.

## Limits

All 19 listings are **fictional examples**, not verified clinician profiles or real availability. The website's help bubble is a rule-based local demo, not connected to an AI service or human team. Saved sample listing IDs are stored locally. No contact details are submitted. Production deployment would require verified provider onboarding, secure services, school workflows and privacy controls.

Version v5 · 29 October 2026.
