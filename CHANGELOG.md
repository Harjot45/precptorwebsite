# Placement Preceptor v6 — Change log

## How It Works
- Added a five-stage visual sequence: student requirements → possible clinician match → preceptor consent → university approval → authorized clinical start.
- Updated student, preceptor and school interactive journeys to reflect the same real-world workflow.
- Clarified that clinician acceptance and university approval are separate requirements.

## For Preceptors
- Replaced the "Build your mentorship snapshot" preview with an integrated **Become a Preceptor** form.
- Added five stages: professional profile, practice details, mentorship availability, contact/consent and review.
- Includes optional NPI, state lists, browser field validation, progress, back navigation and reviewed data summary.
- Added a configurable HTTPS intake integration in `config.js` and `preceptor-application.js`.
- Default remains **preview-only** because Render Static Site has no inbox or backend. No form data stored or transmitted until configured.

## Resources
- Kept keyword search, filter tabs, full written guides and FAQs.
- Expanded from 8 to 11 guides: clinician qualification rules, preparing requests and clinical hours/scheduling.
- No print/PDF tool or student readiness checkbox tracking.

## General
- Kept existing Home and Explore pages, help chat, Find a Match student demo, saved list and rotation comparisons.
- No maps, map API keys, or map sections were added.
- Added mobile form styling and basic tests.
