# Turning the showcase into an operating agency website

The current deliverable is the user-requested complete **client showcase**. It is not represented as an operating travel agency or a live booking/CRM/payment service.

## Agency identity and channels

Configure the real legal business name, office address, telephone, approved messaging URLs, opening hours, and receiving email in `config.js`. Keep unverified fields empty. Add only credentials the agency actually holds, with the applicable number, validity, and verification route. No DOT seal or membership badge is fabricated in the template.

The contact page exposes configured valid channels and explains empty showcase fields. A real launch also needs the operator's actual support process, escalation contacts, and applicable service hours.

## Actual products and terms

Replace all sample rates in `packages.js` with approved offers and their pricing basis, date validity, party/occupancy rules, child-age rules, actual inclusions/exclusions, fees, and supplier conditions. Verify itineraries, permits, hotel/room descriptions, transport, and activity suitability. Do not treat illustrative calculator totals as supplier quotations.

Replace showcase booking information with the agency’s approved booking, payment, cancellation, refund, change, weather-disruption, complaint, and privacy documentation. The template intentionally does not invent deposit percentages, cancellation penalties, refund deadlines, or blanket waivers.

## Live services require a backend

GitHub Pages hosts this static demonstration. A live booking/staff system needs server-side services for authenticated staff access, roles, database records, request ownership, audit history, rate/availability validation, notification delivery, secure document handling if needed, backups, and retention controls.

For actual payments, use the agency’s approved payment-provider account and hosted checkout. Confirm payments using verified server-side callbacks; never mark a booking paid because a browser button was clicked. Do not store card credentials, wallet secrets, or gateway API keys in public JavaScript.

Flights, hotels, insurance, ferries, and other inventory require the relevant supplier arrangements and integrations. This website does not claim to issue tickets, sell insurance, check availability, or hold supplier accounts.

For the basic inquiry form, replace `youremail@yourdomain.com` with the receiving inbox, complete FormSubmit activation, and test delivery and the thank-you redirect on the deployed domain. The demo booking workflow remains separate from that inquiry form.

## Privacy, indexing, and deployment

The public staff demo uses browser storage and is labelled accordingly. Do not convert it into a live system by merely removing its labels. Replace that implementation with authenticated server-side access first.

Provide the operating agency’s controller identity, privacy contact, data purposes, recipients, retention periods, rights process, and any other applicable notices before collecting live customer information. Review third-party form and payment providers as part of that setup.

For a real marketing launch, review the noindex and robots settings, add canonical URLs and a sitemap for the final domain, and replace showcase notices and content only when the corresponding services are real. Deploy through the included GitHub Actions workflow and verify the custom-domain HTTPS setup, real-device layouts, contact channels, inquiries, supplier workflows, and payments as applicable.

## Official references consulted, 25 October 2026

- Department of Tourism accreditation portal: https://accreditation.tourism.gov.ph/
- DOT accreditation system guidelines published by the Supreme Court E-Library: https://elibrary.judiciary.gov.ph/thebookshelf/showdocs/10/90444
- National Privacy Commission, right to be informed and privacy-notice content: https://privacy.gov.ph/the-right-to-be-informed/
- DTI e-commerce consumer information: https://ecommerce.dti.gov.ph/faqs/
- Bureau of Immigration: https://immigration.gov.ph/
- Official eTravel: https://etravel.gov.ph/
- PAGASA: https://www.pagasa.dost.gov.ph/

These references inform the template’s content and launch questions. They are not a certification that an agency or this website meets every legal obligation. The operating agency should verify current requirements for its actual services.
