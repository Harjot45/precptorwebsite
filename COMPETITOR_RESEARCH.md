# Placement Preceptor — Competitor review and UX direction

Reviewed: 29 October 2026. Competitor features and policies may change. These are observations from public pages, not endorsements or claims about Placement Preceptor.

## Public references

| Competitor | Sources reviewed | What we can learn without copying |
| --- | --- | --- |
| **NPHub** | https://www.nphub.com/find-preceptors ; https://www.nphub.com/how-it-works | Search by location/specialty/date, detailed clinical profile fields, location map, structured placement request and account/status flow. Screenshot supplied by project owner illustrates the split-list + dark-map interaction and floating help chat. |
| **Clinical Match Me** | https://www.clinicalmatchme.com/ ; https://www.clinicalmatchme.com/find-a-preceptor/ | Request-first matching and comparison of interested preceptor offers. Distinguish a submitted request from confirmed acceptance. |
| **Preceptor Tree** | https://preceptortree.com/ | Explain the path from request and school paperwork to approval, scheduling and the start of training. Keep student obligations prominent. |
| **PreceptorLink** | https://app.preceptorlink.com/ ; https://www.preceptorlink.com/find-a-preceptor.html | Structured directory with specialty/location/date/hours and ID search, favorites and profile details. |
| **MatchNP** | https://www.matchnp.com/how-it-works/ ; https://www.matchnp.com/preceptors/ | Clearly different experiences for students, preceptors and universities, with credential and schedule collection before confirming a match. |
| **Risepoint** (formerly Academic Partnerships) | https://risepoint.com/ ; https://risepoint.com/healthcare/ | Institutional services and program partnerships. **Not an equivalent public clinical-rotation marketplace**; inform future university partner pages rather than the student map search. |
| **Preceptor Connect** | https://preceptorconnect.com/ | Student intake form, specialty pathways and separate preceptor registration. Similar name also exists at preceptorconnect.net; confirm which provider is intended in any legal/brand comparison. |

## Original design decisions for v5

- Keep five independent pages: Home, Explore, How It Works, For Preceptors, Resources.
- Treat **Explore** as the main product interface, with quick filters across the top, a scrollable two-column example list and a dark interactive map on the right.
- Make pins and listing cards bidirectional: pins highlight list cards; card “Map” buttons center the map and open the example popup.
- Offer **Search this area**, **Fit results**, and **Reset area** on the online map; filtering applies to the existing dataset, never inventing results.
- Provide an interactive help widget on all five pages. This **is an offline FAQ decision tree**, NOT a live human chat or LLM.
- Preserve the v3 shortlist, compare, guided brief, resource guides, checklists and multi-audience journey.
- Do not add fabricated testimonials, rankings, school affiliations, clinician headshots, placement counts, licenses, costs or guarantees. All demo records are clearly fictional, and their approximate city pins are not site locations.
- Keep the visual language original: sea-green/navy, coral emphasis, editorial typography and accessible focus styling rather than copying another service's brand.

## Production delivery phases

1. **Verified supply:** preceptor portal, review/approval workflow, school criteria, credential and practice verification, consent to publish map location and availability, clinician and site privacy settings.
2. **Real search:** authenticated API, geographic search using real authorized locations and data consent, normalized specialties/credentials, availability calendar, school eligibility rules, search indexing and pagination.
3. **Requests and coordination:** student accounts, requests, uploads, placement review, school approvals, agreements, status tracking, notifications and coordinator console. No live booking until accepted and approved.
4. **Real chat:** integrate an approved provider's chat or AI service on the **server**, protect API keys, configure escalation to human staff, retention policies, abuse controls and contact consent.
5. **Business/compliance:** confirm pricing/fees/refunds/guarantees, legal terms, accessibility, privacy/data protection, third-party map-tile license and production infrastructure. Decide what if any protected medical/student information may be collected, and apply the appropriate legal and security controls.

**Avoid connecting real clinician contact details or student files to a static public site.** The current ZIP is a safe presentation prototype, not a production marketplace.


**Current design note:** v5 deliberately excludes maps, checkbox tools, and printing. These references remain background research, not implemented feature claims.
