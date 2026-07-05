# NewFriends SolarEnergy — Quotation Web App

## Problem Statement (verbatim)
Built a Simple One Page Quotation Web app for my Business. I need a drop down menu for services with these options. Full responsive Web app for all devices. show options for Enter the name, Phone no, Address, Enter the Date, and select for range of Quotation for Solar Rooftop 3 KW to 500 KW. Next enter amount add drop down feature in amount when enter amount and press ok apply 8.9% gst the entered amount is Total amount, total amount - 8.9% = Basic price. Next section is Include Items when click it dropdown for example user select the range 3KW in include items same show 3kw inverter or user can also edit it. Provided list of 12 items (Solar PV modules … end caps). Vendor block: NewFriends SolarEnergy, Ramdittewala Kanchiyan, Mansa (Punjab-151505), V.P.O. Makha, Contact 98724-07002. On Generate → produce a quotation filled with the customer's details.

## User Choices
- Output: Both PDF (via print) + on-screen view
- Persistence: Save all quotations in MongoDB + History page
- Branding: NewFriends SolarEnergy
- Services: Only Solar Rooftop
- GST: Basic = Total / 1.089 (GST embedded in entered amount)

## Architecture
- Backend: FastAPI + Motor (MongoDB). Endpoints under `/api`:
  - `POST /api/quotations` — create + auto GST split + human-friendly quote_no `NFS/YYYY/0001`
  - `GET  /api/quotations` — list all (newest first)
  - `GET  /api/quotations/{id}` — fetch one
  - `DELETE /api/quotations/{id}` — remove
- Frontend: React 19 + Tailwind + shadcn UI. Routes:
  - `/` — QuotationForm (single-page workflow)
  - `/history` — HistoryPage
  - `/quotation/:id` — QuotationView (printable A4-style document)
- Design: Organic & Earthy palette (bone-white #F5F5F0, primary #D97706 amber, secondary stone-900). Fonts: Outfit (headings) + Work Sans (body).

## Implemented (2026-02)
- Full form: name, phone, address, calendar date picker, service dropdown (Solar Rooftop), KW range dropdown (3–500 KW), amount input with **Presets dropdown + OK button** applying 8.9% GST.
- Live GST breakdown card (Basic / GST / Total) updates as user types.
- Include Items editor: 12-item BOM, inline-editable rows, auto-syncs inverter capacity with selected KW range, Reset button.
- Vendor Card prominently displayed with address + contact.
- Generate → persists to Mongo → redirects to A4 printable quotation view.
- Print / Download PDF (native window.print with @media print CSS hiding chrome).
- History page: list, view, delete quotations.
- Responsive on mobile, tablet, desktop.
- All interactive elements have unique `data-testid`.

## Next Action Items (backlog)
- P1: Logo upload for vendor branding.
- P1: WhatsApp/SMS share of the quotation link.
- P2: Per-item price columns for detailed BOM cost sheet.
- P2: Customer autocomplete from history (reuse prior addresses).
- P2: Multi-service (Water Heater, Street Light, AMC) toggle.
- P3: Search / filter on history page.
