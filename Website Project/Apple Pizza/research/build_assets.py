#!/usr/bin/env python3
"""Download brand-owned assets and generate site data.js from verified API snapshots."""
import json, os, re, sys, urllib.request, concurrent.futures as cf

R = "/home/user/research"
SITE = "/home/user/site"
IMG = f"{SITE}/assets/img"
for d in ["products", "categories", "banners", "gallery"]:
    os.makedirs(f"{IMG}/{d}", exist_ok=True)

def slug(s):
    s = re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-")
    return re.sub(r"-+", "-", s)

def fetch(url, path, timeout=25):
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (research-download; building brand site with permission-implied public assets)"})
    with urllib.request.urlopen(req, timeout=timeout) as r:
        data = r.read()
    if len(data) < 500:
        return False
    with open(path, "wb") as f:
        f.write(data)
    return True

jobs = []  # (url, path, key)

items = json.load(open(f"{R}/menu-items-all.json"))["data"]
cats = json.load(open(f"{R}/categories.json"))["data"]
banners = json.load(open(f"{R}/banners.json"))["data"]

# product images
prod_img = {}
for it in items:
    url = it.get("imageUrl")
    if url:
        ext = url.rsplit(".", 1)[-1].split("?")[0][:4]
        if ext not in ("jpeg", "jpg", "png", "webp"):
            ext = "jpg"
        key = slug(it["name"])
        prod_img[it["_id"]] = f"assets/img/products/{key}.{ext}"
        jobs.append((url, f"{IMG}/products/{key}.{ext}"))

# category images
cat_img = {}
for c in cats:
    url = c.get("imageUrl")
    if url:
        ext = url.rsplit(".", 1)[-1].split("?")[0][:4]
        if ext not in ("jpeg", "jpg", "png", "webp"):
            ext = "jpg"
        key = slug(c["title"])
        cat_img[c["_id"]] = f"assets/img/categories/{key}.{ext}"
        jobs.append((url, f"{IMG}/categories/{key}.{ext}"))

# banner images — store as optimised .jpg (source PNGs are 2MB+)
ban_img = {}
for b in banners:
    url = b.get("imageUrl")
    if url:
        key = slug(b["title"]) or "owner"
        src_ext = "png" if url.lower().endswith(".png") else "jpeg"
        jobs.append((url, f"{IMG}/banners/{key}.{src_ext}"))
        ban_img[b["_id"]] = ("__BANNER__", key, src_ext)

# gallery from brand's public Justdial listing photos (claimed listings = brand-uploaded)
gallery_urls = [
 ("https://content.jdmagicbox.com/v2/comp/etawah/c6/9999p5688.5688.170603004757.j3c6/catalogue/apples-pizza-friends-colony-etawah-home-delivery-restaurants-861ikmfs1b.jpg", "outlet-friends-colony-1"),
 ("https://content.jdmagicbox.com/comp/etawah/c6/9999p5688.5688.170603004757.j3c6/catalogue/apples-pizza-etawah-restaurants-nkdynndlui.jpg", "outlet-friends-colony-2"),
 ("https://content.jdmagicbox.com/comp/etawah/c6/9999p5688.5688.170603004757.j3c6/catalogue/apples-pizza-etawah-caterers-65onba6ezv.jpg", "food-1"),
 ("https://content.jdmagicbox.com/comp/etawah/c6/9999p5688.5688.170603004757.j3c6/catalogue/apples-pizza-etawah-caterers-bg9a2rwzad.jpg", "food-2"),
 ("https://content.jdmagicbox.com/v2/comp/etawah/c6/9999p5688.5688.170603004757.j3c6/catalogue/apples-pizza-etawah-caterers-hskcqmqa2h.jpg", "food-3"),
 ("https://content.jdmagicbox.com/comp/etawah/c6/9999p5688.5688.170603004757.j3c6/catalogue/apples-pizza-friends-colony-etawah-home-delivery-restaurants-7a66aj0vr0.jpg", "outlet-friends-colony-3"),
 ("https://content.jdmagicbox.com/comp/etawah/b4/9999p5688.5688.200316194116.b3b4/catalogue/apple-s-pizza-etawah-rh1sufpegi.jpg", "outlet-ashok-nagar-1"),
 ("https://content.jdmagicbox.com/comp/etawah/v1/9999p5688.5688.180920141517.j4v1/catalogue/apple-s-pizza-etawah-city-etawah-coffee-shops-mjacgzbmq1.jpg", "outlet-ashok-nagar-2"),
 ("https://content.jdmagicbox.com/comp/etawah/v1/9999p5688.5688.180920141517.j4v1/catalogue/apple-s-pizza-etawah-city-etawah-coffee-shops-svh3tlqwl9.jpg", "ambience-1"),
 ("https://content.jdmagicbox.com/comp/etawah/v1/9999p5688.5688.180920141517.j4v1/catalogue/apple-s-pizza-etawah-city-etawah-coffee-shops-6ykj6ytc88.jpg", "ambience-2"),
]
gal_ok = []
for url, key in gallery_urls:
    p = f"{IMG}/gallery/{key}.jpg"
    jobs.append((url + "?w=1000&q=75", p))
    gal_ok.append((key, p))

def do(job):
    url, path = job
    try:
        ok = fetch(url, path)
        return (path.split("/")[-1], ok)
    except Exception as e:
        return (path.split("/")[-1], f"ERR {e}")

ok = fail = 0
with cf.ThreadPoolExecutor(8) as ex:
    for name, res in ex.map(do, jobs):
        if res is True: ok += 1
        else:
            fail += 1
            print("FAIL", name, res)
print(f"downloaded {ok}, failed {fail}")

# build data.js
def norm_var(v):
    n = re.sub(r"\s+", " ", v["name"].strip()).replace("`", "").strip()
    if n in ("", "7 \"Regular", "7\"Regular", "7 \" Regular"):
        n = '7" Regular'
    n = re.sub(r'^7\s*"?\s*Regular$', '7" Regular', n)
    n = re.sub(r'^10\s*"?\s*Medium\s*$', '10" Medium', n)
    n = re.sub(r'^13\s*"?\s*Large\s*$', '13" Large', n)
    return {"name": n, "price": v["price"]}

CAT_ORDER = {c["_id"]: c["sortOrder"] for c in cats}
CAT_TITLE = {}
for c in cats:
    t = re.sub(r"\s*-\s*$", "", c["title"]).strip()
    t = t.replace("(Pizza Mania )", "(Pizza Mania)").replace("Veg single", "Veg Single").replace("Veg Double Extra cheese", "Veg Double Extra Cheese")
    CAT_TITLE[c["_id"]] = t

# dedupe
seen = set()
clean_items = []
for it in sorted(items, key=lambda x: CAT_ORDER.get(x["categoryId"]["_id"], 99)):
    key = (it["categoryId"]["_id"], re.sub(r"\s+", " ", it["name"]).lower())
    if key in seen:
        continue
    seen.add(key)
    vars_ = [norm_var(v) for v in it.get("variations", [])]
    mods = []
    for mg in it.get("modifierGroups", []):
        opts = []
        for o in mg["options"]:
            vp = {re.sub(r"\s+", " ", p["variationName"]).replace("`", "").strip(): {"price": p["additionalPrice"], "available": p.get("available", True)} for p in o.get("variationPricing", [])}
            vp = { (re.sub(r'^7\s*"?s*\s*Regular$', '7" Regular', k) if False else k): v for k, v in vp.items() }
            opts.append({"name": o["name"], "pricing": vp})
        mods.append({"title": mg["title"], "required": bool(mg.get("required")), "options": opts})
    # two items on the official API point at the logo file instead of a food photo -> treat as no photo
    logo_standins = {"apple-s-pizza", "4-papper-pizza"}
    clean_items.append({
        "id": it["_id"],
        "name": re.sub(r"\s+", " ", it["name"]).strip(),
        "cat": it["categoryId"]["_id"],
        "desc": (it.get("description") or "").strip().strip("()").strip(),
        "veg": True,
        "disc": it.get("discountPercentage") or 0,
        "img": None if slug(it["name"]) in logo_standins else prod_img.get(it["_id"]),
        "sizes": vars_,
        "mods": mods,
        "modes": it.get("availableOrderModes"),
    })

clean_cats = []
for c in sorted(cats, key=lambda x: x["sortOrder"]):
    clean_cats.append({"id": c["_id"], "title": CAT_TITLE[c["_id"]], "img": cat_img.get(c["_id"])})

# optimise banner pngs -> jpg when PIL available
try:
    from PIL import Image
    for bid, v in list(ban_img.items()):
        if isinstance(v, tuple) and v[0] == "__BANNER__" and v[2] == "png":
            _, key, _ = v
            p = f"{IMG}/banners/{key}.png"
            im = Image.open(p).convert("RGB")
            w, h = im.size
            if w > 1600:
                im = im.resize((1600, int(h * 1600 / w)), Image.LANCZOS)
            im.save(f"{IMG}/banners/{key}.jpg", quality=82, optimize=True)
            os.remove(p)
            ban_img[bid] = f"assets/img/banners/{key}.jpg"
        elif isinstance(v, tuple):
            ban_img[bid] = f"assets/img/banners/{v[1]}.{v[2]}"
except ImportError:
    for bid, v in list(ban_img.items()):
        if isinstance(v, tuple):
            ban_img[bid] = f"assets/img/banners/{v[1]}.{v[2]}"

clean_banners = []
for b in sorted(banners, key=lambda x: x.get("sortOrder", 0)):
    clean_banners.append({"title": b["title"].strip(), "desc": (b.get("description") or "").replace("\n", " ").strip(), "img": ban_img.get(b["_id"])})

# modifier keys normalization helper inside data? normalize keys properly:
import re as _re
def normsize(k):
    k = _re.sub(r"\s+", " ", k).replace("`", "").strip()
    k = _re.sub(r'^7\s*"\s*Regular$', '7" Regular', k)
    k = _re.sub(r'^10\s*"\s*Medium$', '10" Medium', k)
    k = _re.sub(r'^13\s*"\s*Large$', '13" Large', k)
    return k
for it in clean_items:
    for m in it["mods"]:
        for o in m["options"]:
            o["pricing"] = {normsize(k): v for k, v in o["pricing"].items()}

data = {
    "brand": {
        "name": "Apple's Pizza",
        "tagline": "100% Pure Veg. Hot, Cheesy & Fresh in Etawah.",
        "phone": "+91 89380 09090",
        "phoneAlt": "+91 72520 09090",
        "email": "appizza7252@gmail.com",
        "facebook": "https://www.facebook.com/Applespizzaetw/",
        "orderUrl": "https://www.applespizza.com/home",
        "zomatoUrl": "https://www.zomato.com/etawah/apples-pizza-etawah-locality/order",
        "hours": "Open daily · 10:00 AM – 10:00 PM",
    },
    "outlets": [
        {
            "id": "friends-colony",
            "name": "Friends Colony (MKD Supermart)",
            "short": "Friends Colony",
            "address": "1st Floor, MKD Supermart Mall, Near Indian Oil Petrol Pump, Friends Colony, Etawah – 206001, Uttar Pradesh",
            "maps": "https://www.google.com/maps/search/?api=1&query=MKD+Supermart+Friends+Colony+Etawah",
            "mapsPlus": "Q2QF+JVW Etawah, Uttar Pradesh",
            "phone": "+91 89380 09090",
            "hours": "10:00 AM – 9:00/10:00 PM (verify)",
            "rating": "3.8★ on Justdial (320+ ratings)",
            "services": ["Home Delivery", "Takeaway", "Dine-in"],
            "since": "Original outlet · serving since ~2016",
        },
        {
            "id": "ashok-nagar",
            "name": "Ashok Nagar (Pakka Talab)",
            "short": "Pakka Talab",
            "address": "Near KKDC 1st Gate, Pakka Talab, Main Road, Ashok Nagar, Etawah – 206001, Uttar Pradesh",
            "maps": "https://www.google.com/maps/search/?api=1&query=KKDC+1st+Gate+Pakka+Talab+Etawah",
            "mapsPlus": "",
            "phone": "+91 89380 09090",
            "hours": "10:00 AM – 10:00 PM",
            "rating": "4.7★ on Justdial (550+ ratings)",
            "services": ["Home Delivery", "Takeaway"],
            "since": "Second outlet · listed since 2020",
        },
    ],
    "categories": clean_cats,
    "items": clean_items,
    "banners": [b for b in clean_banners if b["title"] != "."],
    "ownerBanner": next((b for b in clean_banners if b["title"] == "."), None),
    "offers": [
        {"title": "Flat 40% OFF on Pizzas", "desc": "Live on the official menu — pizzas are currently listed at 40% off MRP across sizes.", "tag": "Live now", "terms": "As per current official menu; select items/sizes. Confirm at outlet."},
        {"title": "Weekend Pizza Blast", "desc": "Flat 40% off on selected Regular, Medium and Large pizzas.", "tag": "Official promo", "terms": "Selected pizzas; confirm validity at outlet."},
        {"title": "Combo Night", "desc": "Combo meals with drinks and sides at best prices.", "tag": "Official promo", "terms": "See Pizza Mania combos on the menu."},
        {"title": "Cheese Burst Festival", "desc": "Premium crust upgrades and extra cheese offers — try Cheese Burst crust or double extra cheese.", "tag": "Official promo", "terms": "Crust/cheese add-ons priced per size."},
        {"title": "Sweet Ending", "desc": "Add beverages and sides to complete your meal.", "tag": "Official promo", "terms": "Beverages & sides category."},
    ],
    "faqs": [],
}

js = "// Apple's Pizza — verified menu snapshot from api.applespizza.com (fetched 2026-10-10)\n"
js += "// Prices are MRP; discountPercentage applies where set. Do not edit by hand — regenerate from research snapshots.\n"
js += "window.AP_DATA = " + json.dumps(data, ensure_ascii=False, indent=1) + ";\n"
os.makedirs(f"{SITE}/assets/js", exist_ok=True)
open(f"{SITE}/assets/js/data.js", "w").write(js)
print("data.js written:", len(js), "bytes;", len(clean_items), "items;", len(clean_cats), "categories")
