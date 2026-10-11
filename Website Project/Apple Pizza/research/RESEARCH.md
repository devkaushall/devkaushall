# Apple's Pizza, Etawah — Evidence Sheet

Research compiled 2026-10-10 from primary and third-party sources. Items marked **VERIFIED** come from first-party or mutually corroborating sources; **CONFLICT** = sources disagree; **UNRESOLVED** = not confirmed.

## 1. Brand identity
- **Name:** Apple's Pizza (stylised "APPLE'SPIZZA" on Facebook; listing names "Apples Pizza" / "Apple's Pizza"). VERIFIED (own site, FB, JD, Zomato).
- **Logo:** roundel on vivid royal blue (#1212F0-ish), white ring, white bold outlined wordmark. VERIFIED (own site `/logo.jpeg`, 1414×1414).
- **Positioning:** 100% pure-veg pizza brand. VERIFIED — Facebook page states "APPLE'SPIZZA makes 100% pure veg pizza"; official API marks every one of the 64 menu items `isVeg:true`; JD lists "Veg Options Available"; Zomato "Italian, Vegetarian".
- **Owner name:** Anuj Kumar (official banner "Anuj Kumar / Apple's Pizza" via api.applespizza.com/api/banners, created 2026-09-29). VERIFIED (first-party).
- **Tagline on official platform:** "Enjoy hot, cheesy, and delicious pizzas crafted with quality ingredients." VERIFIED (first-party banner).

## 2. Domains & digital presence
- **www.applespizza.com** — live ordering platform (Next.js SPA, "Apples Pizza Platform", public read API at api.applespizza.com). VERIFIED operational 2026-10-10.
- **applespizza.in** — domain referenced by the brand's own Facebook page; returned HTTP 500 on 2026-10-10 (down). Likely the older marketing site. CONFLICT/STALE.
- **Google Play:** "Apple's Pizza" app, package `com.app.ApplesPizza`, developer "Weblink .in Pvt. Ltd.", 100+ downloads, category Food & Drink. VERIFIED (search snippet; page itself not fully crawled).
- **Facebook:** facebook.com/Applespizzaetw — contact +91 89380 09090, email appizza7252@gmail.com, "Open now · Delivery · Takeout · Dine-in", price $$, lists applespizza.in. VERIFIED.
- **Instagram/YouTube:** no verified profiles found. UNRESOLVED (do not publish).
- **api.applespizza.com** exposes public read endpoints: `/api/categories`, `/api/menu-items?limit=500`, `/api/banners`. Used as the primary menu source (64 items, fetched 2026-10-10, stored in `menu-items-all.json`).

## 3. Outlets (two distinct, do NOT merge)
### Outlet 1 — Friends Colony (original)
- Address (JD, claimed listing): "166/c, 1 Floor, 2, MKD Super Mart, Friends Colony Etawah, Indian Oil Petrol Pump, MKD Supermart Mall, Friends Colony, Etawah-206001, Uttar Pradesh". Shorter form: MKD Super Mart, Friends Colony, Etawah 206001.
- Plus code (restaurant-guru): Q2QF+JVW Etawah.
- Ratings: JD 3.8 (~320 ratings, "11 Years in Business" in 2026); restaurant-guru 4.1 (78 votes), #54 of 526 in Etawah.
- Hours: JD Mon–Sun 10:00–21:00; Zomato/restaurant-guru 10:00–22:00. **CONFLICT** (closing 9 vs 10 pm).
- Services: home delivery (JD category), parking available; FB says Delivery/Takeout/Dine-in.
### Outlet 2 — Ashok Nagar / Pakka Talab
- Address (JD, claimed listing): Near KKDC 1st Gate, Pakka Talab, Main Road, Ashok Nagar, Etawah-206001, Uttar Pradesh. Listed since ~Mar 2020.
- Ratings: JD 4.7–4.9 (~555–560 ratings).
- Hours: opens 10:00; closes 22:00 (JD "Open until 10:00 pm").
- Services: Takeaway, Home Delivery (JD Quick Info).
- Note: a different business "The Pizza House" also sits "Infront of KKDC, Pakka Talab" — do not confuse listings.

## 4. Contacts
- Phone +91 89380 09090 — Facebook, restaurant-guru, indiapl (primary). VERIFIED.
- Phone +91 72520 09090 — Zomato listing (older/secondary). CONFLICT/secondary.
- Email appizza7252@gmail.com — Facebook. VERIFIED.

## 5. Menu (VERIFIED from first-party API on 2026-10-10; snapshot in menu-items-all.json)
All items veg. Pizzas carry `discountPercentage:40` (live "40% OFF" on own site; strike MRP → net). Category order per API sortOrder:
1. **Smply Veg (8):** Cheese N Tomato 168, Margherita 168, Cheese N Capsicum 168, Cheese N Paneer 170, Cheese N Jalapeno 170, Cheese N Mushroom 170, Cheese N Golden Corn 175, Cheese N Onion 175 (7" Regular MRP; 10" Medium 384; 13" Large 484). All "(Loaded With Mozzarella Cheese)".
2. **Veg Treat (7):** Double Cheese Margherita, Spicy Triple Tango, Country Special, Veggie Hawaian, Double Spicy, Farmhouse, Golden Farm — 250 / 500 / 590.
3. **Veg Special (8):** Apple's Pizza, 5 Pepper, 4 Papper, Deluxe Veggie, Mexican Green Wave, Vaggi Farm, Peppy Paneer — 280 / 550 / 680; Veggie Paradise 284 / 550 / 680.
4. **Veg Feast Pizzas (7):** Apple's Special, Veg Extravaganza, Chefs Veg Wonder, Cloud 9, King Cloud 7, Veg Supreme, Farm To Forest — 320 / 640 / 800.
5. **Combo (Pizza Mania) (4):** Veg Singles Combo 300; Veg Doubles Combo 320; Veg Doubles Extra Cheese Combo 400; Veg Doubles Pan Pizza Extra Cheese Combo 440.
6. **Veg Single (Pizza Mania) (5):** Onion / Golden Corn / Tomato / Paneer / Jalapeno Pizza — 140 (7" Regular, "Cheese Blend").
7. **Veg Double (Pizza Mania) (9):** Onion Paneer, Onion Capsicum, Tomato Golden Corn, Onion Jalapeno, Tomato Onion, Onion Golden Corn, Jalapeno Capsicum, Golden Corn Paneer — 140; Capsicum Paneer 180.
8. **Veg Double Extra Cheese (Pizza Mania) (12→11 unique):** all 200 except Capsicum Paneer Extra Cheese 180; API lists "Onion Paneer Extra Cheese Pizza" twice (deduped in our data).
9. **Beverage & Sides (3) + drink (1):** Cheese Garlic Bread 80; Stuffed Garlic Bread 100; Pockets Veg 100; Thums Up 740 ML 50 / 180 ML 20.
- **Customisation (VERIFIED, Smply Veg item sample):** Choice Of Crusts (Cheese Burst +40/50/60 by size; Pan +20/30, 13" unavailable), Choice Of Cheese (Extra +40/50/60; Double Extra +60/80/90), Choice Of Toppings (Black Olives/Red Paprika/Jalapeno/Paneer/Mushroom/Golden Corn/Onion/Capsicum/Tomato +20/30/40). Optional groups, max 10.
- Older third-party prices (Zomato/magicpin/JD 2024-era): ₹100/₹160/₹180 single-size — STALE; superseded by official API.
- Data quirks to normalise: stray "`" variation name (Tomato Capsicum Extra Cheese), padded whitespace in names, duplicate item.

## 6. Offers (VERIFIED first-party banners, live 2026-10-10)
- Live site-wide mechanic: 40% OFF on pizzas (shown per item).
- "Weekend Pizza Blast — Flat 40% off on selected Regular medium and large pizzas."
- "Combo Night — Get combo meals with drinks and sides at best prices."
- "Cheese Burst Festival — Try premium crust upgrades and extra cheese offers."
- "Sweet Ending — Add desserts and beverages to complete your meal."
No expiry dates/minimum-order values published anywhere → present without invented terms.

## 7. Customer expectations (third-party reviews, paraphrased)
- JD 3.8/320 (Friends Colony) vs 4.7-4.9/560 (Ashok Nagar); restaurant-guru 4.1; indiapl 4/6 ("deliver within 1 hour in most cases").
- Themes: value-for-money veg pizza, quick delivery, good for friends hangout.
- Price-for-two ≈ ₹300 (JD).

## 8. Design direction
- Brand blue from logo is the anchor; pair with warm cream background, cheese-yellow and tomato-red accents; bold rounded sans display type; veg-green indicator on every item.
- Use only brand-owned imagery: 33 official product photos, category/banners from api.applespizza.com + cloudfront, plus public listing photos from the brand's claimed Justdial pages (gallery). No stock-photo fakery; items without photos get typographic SVG tiles.

## 9. Source log
- https://www.applespizza.com/home (rendered + raw HTML) — fetched 2026-10-10
- https://api.applespizza.com/api/{categories,menu-items?limit=500,banners} — fetched 2026-10-10 (snapshots in this folder)
- https://applespizza.in — HTTP 500 (inaccessible)
- Justdial Friends Colony listing + menu; Justdial Ashok Nagar (KKDC/Pakka Talab) listing
- Zomato order page (menu + phone + hours snippet); magicpin store page snippet
- restaurant-guru.in listing; indiapl listing; Google Play snippet; Facebook page (via search index)

## 10. Unresolved / must-confirm with management
- Exact closing hours per outlet (9 pm vs 10 pm).
- Which phone number is current for which outlet (89380 09090 vs 72520 09090).
- Delivery radius / minimum order / delivery fee (free-delivery claims unverified → not advertised).
- Payment methods accepted (UPI/cash/card) → not claimed.
- Instagram/YouTube handles.
- Whether applespizza.in should redirect to applespizza.com.
- App availability beyond the Play snippet; iOS app unknown.
