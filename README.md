# IdliPulo

A complete static Philippine travel-agency client showcase by Casa Rustia Digital Services.

## Complete agency package

The site includes 19 HTML pages and reusable destination/package data. New agency features include:

- A searchable package catalogue with travel-style and duration filters, price sorting, and comparison of up to three packages.
- Individual package itineraries, inclusions/exclusions, sample PHP rates, and itinerary downloads.
- A three-step sample quote builder: group size, room count, stay style, transfer allowance, traveller details, review, and local request creation.
- GCash, Maya, card, and bank-transfer **preferences and previews only**. No payment credentials, account numbers, charges, receipts, or actual payments are created.
- Browser-only request references, downloadable briefs, history, change requests, and demo cancellation.
- A public staff-workspace demo: synthetic sample records, inquiry pipeline, follow-up notes, status updates, JSON export, and reset controls.
- Services for flights, hotels, holidays, transfers, groups, document guidance, insurance referral, and support, presented as showcase inquiry flows rather than connected supplier services.
- About, configurable contact profile, travel guide with a persistent checklist, searchable FAQs, booking/payment/cancellation information, and expanded privacy controls.

**All package rates, inventory implications, references, statuses, and staff records are illustrative.** The staff workspace has no authentication and must not hold real client information. It intentionally shares the same local browser records with the traveller side to demonstrate the workflow. It is not a live CRM or booking system.

See `docs/SHOWCASE-GUIDE.md` for a client demonstration walkthrough and `docs/LAUNCH-SETUP.md` for the real-service connection requirements.

## Open it

Open `index.html` in a browser, or run a static server from this folder:

```powershell
python -m http.server 8766 --bind 127.0.0.1
```

Then visit `http://127.0.0.1:8766/`.

## Features

- Responsive, dual-tone and dual-weight IdliPulo wordmark.
- Six real Philippine destinations with local WebP photos and attribution.
- Destination search, category filters, and useful empty states.
- Individual day-by-day itineraries at `trip.html?destination=el-nido` and equivalent destination links.
- Saved trips persisted in the current browser.
- Travel request validation, explicit draft saving, review dialog, and downloadable request.
- Email inquiry delivery through FormSubmit after a real receiving address is configured.
- Privacy explanation, image credits, request confirmation, and custom 404 page.

## Connect email delivery before launch

`config.js` currently contains the user-supplied placeholder:

```js
inquiryEmail: 'youremail@yourdomain.com'
```

Replace it with the real receiving email address. While the placeholder remains, the site clearly explains that nothing is sent, allows request downloads, and hides the send button. It never forwards inquiries to another inbox.

With a real address, the review dialog shows **Send travel request** and submits to FormSubmit. The first real submission may require confirmation from the recipient inbox. Complete any FormSubmit verification, then confirm the inquiry arrives and the browser returns to `thank-you.html` on the deployed site. The site leaves FormSubmit's default CAPTCHA enabled. Delivery has not been tested against a real inbox.

The website does not take payments, confirm bookings, or claim live inventory. Itineraries are planning examples. Booking, pricing, operator arrangements, terms, and availability need separate confirmation. The website is labelled as a Casa Rustia travel concept.

## Publish with GitHub Actions

1. Create a separate repository for IdliPulo, with `main` as the publishing branch.
2. Upload the active contents of this folder, including `assets/`, `.nojekyll`, and `.github/workflows/deploy.yml`. Exclude `legacy/`. Keep `index.html` at repository root. Do not upload the outer IdliPulo folder as another nested directory.
3. In repository **Settings → Pages**, choose **GitHub Actions** as the source.
4. Commit to `main` or run **Publish IdliPulo** from the Actions tab.
5. After deployment succeeds, open the Pages URL and test the published site. Add a custom domain through Pages settings only after its DNS is configured.

The workflow stages only public HTML, CSS, JavaScript, images, and robots settings into `_site` before publishing. Historical files and Markdown handover guides are not published. Relative links support a GitHub project URL or a custom domain. Keep the file named `index.html`; use the directory URL to visit the homepage.

GitHub reference: https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages

## Files to update

- `index.html`: homepage.
- `data.js`: destination content, itinerary days, descriptions, and image paths.
- `trip.html`: itinerary page shell; content comes from `data.js`.
- `saved.html`: saved-trip page.
- `plan.html`: travel request form.
- `script.js`: filters, storage, navigation, itinerary rendering, and inquiry flow.
- `styles.css`: responsive visual design.
- `config.js`: email and business settings.
- `packages.js`: sample package rates, durations, inclusions, and exclusions.
- `agency.js` and `agency.css`: package comparison, sample quotes, requests, staff demo, and the expanded agency pages.
- `packages.html`, `package.html`, and `booking.html`: catalogue, package detail, and quote/request walkthrough.
- `requests.html` and `staff.html`: traveller and public staff views of local demonstration records.
- `services.html`, `about.html`, `contact.html`, `travel-guide.html`, `faqs.html`, and `policies.html`: supporting agency experience.
- `credits.html` and `assets/photo-credits.json`: photo attribution and licences; keep these with the images.

This showcase is intentionally marked `noindex` and `robots.txt` disallows crawling. Before using it as a real agency website, provide the actual agency identity, contact address, operating terms, privacy information, and genuine offers; then review the indexing settings and add a sitemap and canonical URLs for the final domain.

Future superseded files can be kept in dated `legacy/` subfolders. That directory is ignored by Git; keep it out of manual uploads too.
