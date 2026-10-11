/* Apple's Pizza — shared runtime (header/footer, cart, product modal, helpers) */
(function () {
  "use strict";
  const D = window.AP_DATA;
  const LS_CART = "ap_cart_v1";
  const LS_OUTLET = "ap_outlet_v1";

  /* ---------- helpers ---------- */
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const fmt = (n) => "₹" + Math.round(n).toLocaleString("en-IN");
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const catById = (id) => D.categories.find((c) => c.id === id);
  const itemById = (id) => D.items.find((i) => i.id === id);
  const netPrice = (it, sizePrice) => (it.disc > 0 ? Math.round((sizePrice * (100 - it.disc)) / 100) : sizePrice);

  /* ---------- cart store ---------- */
  function loadCart() { try { return JSON.parse(localStorage.getItem(LS_CART)) || []; } catch (e) { return []; } }
  function saveCart(c) { localStorage.setItem(LS_CART, JSON.stringify(c)); paintCart(); }
  const cart = loadCart();
  function cartCount() { return cart.reduce((n, l) => n + l.qty, 0); }
  function cartTotals() {
    let sub = 0, save = 0;
    cart.forEach((l) => { sub += l.unit * l.qty; save += (l.savePer || 0) * l.qty; });
    return { sub, save };
  }
  function addToCart(line) {
    const key = line.key;
    const ex = cart.find((l) => l.key === key);
    if (ex) ex.qty += line.qty; else cart.push(line);
    saveCart(cart);
    toast("Added to cart: " + line.name);
  }
  function setQty(key, qty) {
    const l = cart.find((x) => x.key === key);
    if (!l) return;
    if (qty <= 0) cart.splice(cart.indexOf(l), 1); else l.qty = qty;
    saveCart(cart);
  }
  function clearCart() { cart.length = 0; saveCart(cart); }

  function paintCart() {
    $$(".cart-count").forEach((el) => { el.textContent = cartCount(); el.style.display = cartCount() ? "grid" : "none"; });
    document.dispatchEvent(new CustomEvent("ap:cart"));
  }

  /* ---------- outlet ---------- */
  function getOutlet() { return localStorage.getItem(LS_OUTLET) || D.outlets[0].id; }
  function setOutlet(id) { localStorage.setItem(LS_OUTLET, id); document.dispatchEvent(new CustomEvent("ap:outlet")); }

  /* ---------- toast ---------- */
  let toastEl, toastT;
  function toast(msg) {
    if (!toastEl) { toastEl = document.createElement("div"); toastEl.className = "toast"; toastEl.setAttribute("role", "status"); document.body.appendChild(toastEl); }
    toastEl.textContent = msg;
    toastEl.classList.add("show");
    clearTimeout(toastT);
    toastT = setTimeout(() => toastEl.classList.remove("show"), 2600);
  }

  /* ---------- header / footer ---------- */
  const NAV = [
    ["index.html", "Home"], ["menu.html", "Menu"], ["offers.html", "Offers"],
    ["outlets.html", "Outlets"], ["gallery.html", "Gallery"], ["about.html", "About"],
    ["contact.html", "Contact"],
  ];
  function pageName() {
    let p = location.pathname.split("/").pop() || "index.html";
    return p;
  }
  function renderHeader() {
    const host = $("#siteHeader");
    if (!host) return;
    const cur = pageName();
    host.className = "site-head";
    host.innerHTML =
      '<div class="container head-in">' +
      '<a class="brand" href="index.html" aria-label="Apple\'s Pizza home">' +
      '<img src="assets/img/logo.jpeg" alt="Apple\'s Pizza roundel logo" width="46" height="46">' +
      '<span><span class="brand-name">Apple&#39;s Pizza</span><br><span class="brand-sub">Swad Ki Home Delivery · Etawah</span></span></a>' +
      '<nav class="main-nav" id="mainNav" aria-label="Main">' +
      NAV.map(([h, t]) => '<a href="' + h + '"' + (h === cur ? ' aria-current="page"' : "") + ">" + t + "</a>").join("") +
      "</nav>" +
      '<div class="head-actions">' +
      '<label class="outlet-chip" title="Choose your outlet">📍<select id="outletSel" aria-label="Choose outlet">' +
      D.outlets.map((o) => '<option value="' + o.id + '">' + esc(o.short) + "</option>").join("") +
      "</select></label>" +
      '<a class="cart-btn" href="cart.html" aria-label="View cart"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="9" cy="21" r="1.6"/><circle cx="19" cy="21" r="1.6"/><path d="M2 3h3l2.7 12.4a2 2 0 0 0 2 1.6h8.9a2 2 0 0 0 2-1.6L22 7H6"/></svg><span class="cart-label">Cart</span><span class="cart-count">0</span></a>' +
      '<button class="burger" id="burger" aria-label="Open menu" aria-expanded="false" aria-controls="mainNav"><span></span></button>' +
      "</div></div>";
    const sel = $("#outletSel", host);
    sel.value = getOutlet();
    sel.addEventListener("change", () => { setOutlet(sel.value); const o = D.outlets.find((x) => x.id === sel.value); toast("Outlet set to " + o.name); });
    const burger = $("#burger", host);
    burger.addEventListener("click", () => {
      const nav = $("#mainNav", host);
      const open = nav.classList.toggle("open");
      burger.setAttribute("aria-expanded", open);
    });
    $$(".main-nav a", host).forEach((a) => a.addEventListener("click", () => { $("#mainNav", host).classList.remove("open"); burger.setAttribute("aria-expanded", "false"); }));
  }
  function renderFooter() {
    const host = $("#siteFooter");
    if (!host) return;
    host.className = "site-foot";
    host.innerHTML =
      '<div class="container foot-grid">' +
      '<div class="foot-brand"><a class="brand" href="index.html" style="margin-bottom:12px"><img src="assets/img/logo.jpeg" alt="" width="46" height="46" style="border-radius:50%"><span><span class="brand-name" style="color:#fff">Apple&#39;s Pizza</span></span></a>' +
      "<p>100% pure-veg pizzas, garlic breads, combos &amp; more — made fresh in Etawah since around 2016. Swad Ki Home Delivery.</p>" +
      '<p style="margin-top:12px"><a href="' + D.brand.facebook + '" rel="noopener" target="_blank">Facebook ↗</a> <a href="' + D.brand.orderUrl + '" rel="noopener" target="_blank">Official ordering app ↗</a> <a href="' + D.brand.zomatoUrl + '" rel="noopener" target="_blank">Zomato ↗</a></p></div>' +
      '<div><h4>Explore</h4>' + NAV.slice(1).map(([h, t]) => '<a href="' + h + '">' + t + "</a>").join("") + '<a href="faq.html">FAQs</a></div>' +
      '<div><h4>Help &amp; Legal</h4><a href="contact.html">Contact us</a><a href="faq.html">FAQs</a><a href="privacy.html">Privacy policy</a><a href="terms.html">Terms &amp; conditions</a></div>' +
      '<div><h4>Outlets &amp; Contact</h4>' +
      D.outlets.map((o) => '<a href="outlets.html#' + o.id + '">' + esc(o.name) + " ↗</a>").join("") +
      '<a href="tel:+918938009090" style="color:var(--cheese);font-weight:800">📞 ' + D.brand.phone + "</a>" +
      '<a href="mailto:' + D.brand.email + '">✉ ' + D.brand.email + "</a>" +
      '<p style="font-size:.8rem;margin-top:10px;color:#aab">Open daily · 10:00 AM – 10:00 PM*</p></div>' +
      "</div>" +
      '<div class="container foot-base"><span>© ' + new Date().getFullYear() + " Apple's Pizza, Etawah. Pure veg.</span><span>Menu &amp; offers synced from the official ordering platform · 10 Oct 2026. *Hours per outlet — see Outlets.</span></div>";
  }

  /* ---------- product modal ---------- */
  let modalState = null;
  function openProduct(id) {
    const it = itemById(id);
    if (!it) return;
    closeModal();
    const sizes = it.sizes && it.sizes.length ? it.sizes : [{ name: "Regular", price: 0 }];
    modalState = { it, size: sizes[0].name, qty: 1, mods: {} };
    const wrap = document.createElement("div");
    wrap.className = "modal";
    wrap.id = "apModal";
    wrap.setAttribute("role", "dialog");
    wrap.setAttribute("aria-modal", "true");
    wrap.setAttribute("aria-label", it.name);
    wrap.innerHTML =
      '<div class="modal-card"><div class="modal-media">' +
      (it.img
        ? '<img src="' + it.img + '" alt="' + esc(it.name) + ' photo">'
        : (catById(it.cat) && catById(it.cat).img
          ? '<img src="' + catById(it.cat).img + '" alt="' + esc(it.name) + ' — shown with its ' + esc(catById(it.cat).title) + ' category photo">'
          : '<div class="mono" style="display:grid;place-items:center;height:100%">🍕</div>')) +
      '<button class="modal-close" id="mClose" aria-label="Close">✕</button></div>' +
      '<div class="modal-body"><div><span class="veg-mark" style="position:static;display:inline-grid;vertical-align:middle;margin-right:8px" title="Pure veg"></span><strong style="font-size:.75rem;color:var(--leaf);letter-spacing:.08em">100% VEG</strong>' +
      (it.disc ? '<span class="disc-tag" style="position:static;margin-left:8px">' + it.disc + "% OFF</span>" : "") +
      "<h2>" + esc(it.name) + "</h2>" +
      (it.desc ? '<p class="p-desc" style="margin-top:4px">' + esc(it.desc) + "</p>" : "") +
      (catById(it.cat) ? '<p style="font-size:.75rem;color:var(--muted);font-weight:800;margin-top:4px">' + esc(catById(it.cat).title) + "</p>" : "") +
      "</div>" +
      '<div class="opt-group" role="radiogroup" aria-label="Choose size"><h4>Choose size *</h4>' +
      sizes.map((s, i) =>
        '<label class="opt"><input type="radio" name="msize" value="' + esc(s.name) + '"' + (i === 0 ? " checked" : "") + "><span>" + esc(s.name) + '</span><span class="p">' + fmt(netPrice(it, s.price)) + (it.disc ? ' <s style="opacity:.6">' + fmt(s.price) + "</s>" : "") + "</span></label>"
      ).join("") + "</div>" +
      (it.mods || []).map((g, gi) =>
        '<div class="opt-group"><h4>' + esc(g.title) + (g.required ? " *" : " (optional)") + "</h4>" +
        g.options.map((o) => '<label class="opt" data-mod="' + gi + '" data-opt="' + esc(o.name) + '"><input type="checkbox" name="mod' + gi + '" value="' + esc(o.name) + '"><span>' + esc(o.name) + '</span><span class="p" data-p></span></label>').join("") +
        "</div>"
      ).join("") +
      '<div class="qty-row"><div class="qty"><button type="button" id="mMinus" aria-label="Decrease quantity">−</button><output id="mQty">1</output><button type="button" id="mPlus" aria-label="Increase quantity">+</button></div><span style="font-weight:700;color:var(--muted);font-size:.85rem">quantity</span></div>' +
      '<div class="modal-foot"><div class="modal-price"><small>total</small><span id="mTotal">–</span></div><button class="btn btn-primary" id="mAdd">Add to cart</button></div>' +
      "</div></div>";
    document.body.appendChild(wrap);
    document.body.style.overflow = "hidden";

    wrap.addEventListener("click", (e) => { if (e.target === wrap) closeModal(); });
    $("#mClose", wrap).addEventListener("click", closeModal);
    document.addEventListener("keydown", escClose);
    $$('input[name="msize"]', wrap).forEach((r) => r.addEventListener("change", () => { modalState.size = r.value; paintMods(); }));
    $$('input[data-mod], input[name^="mod"]', wrap).forEach((c) => c.addEventListener("change", () => {
      const gIdx = c.name.replace("mod", "");
      const grp = it.mods[gIdx];
      if (!modalState.mods[gIdx]) modalState.mods[gIdx] = [];
      if (c.checked) { if (!modalState.mods[gIdx].includes(c.value)) modalState.mods[gIdx].push(c.value); }
      else modalState.mods[gIdx] = modalState.mods[gIdx].filter((x) => x !== c.value);
      paintTotal();
    }));
    $("#mMinus", wrap).addEventListener("click", () => { modalState.qty = Math.max(1, modalState.qty - 1); $("#mQty", wrap).textContent = modalState.qty; paintTotal(); });
    $("#mPlus", wrap).addEventListener("click", () => { modalState.qty = Math.min(20, modalState.qty + 1); $("#mQty", wrap).textContent = modalState.qty; paintTotal(); });
    $("#mAdd", wrap).addEventListener("click", () => {
      const line = buildLine();
      addToCart(line);
      closeModal();
    });
    paintMods();
    $("#mClose", wrap).focus();
  }
  function escClose(e) { if (e.key === "Escape") closeModal(); }
  function closeModal() {
    const m = $("#apModal");
    if (m) { m.remove(); document.body.style.overflow = ""; document.removeEventListener("keydown", escClose); }
    modalState = null;
  }
  function sizePrice() {
    const it = modalState.it;
    const s = it.sizes.find((x) => x.name === modalState.size) || it.sizes[0];
    return s ? s.price : 0;
  }
  function modPrice(g, optName) {
    const o = g.options.find((x) => x.name === optName);
    if (!o) return 0;
    const p = o.pricing[modalState.size];
    if (p) return p.available === false ? null : p.price;
    const any = Object.values(o.pricing)[0];
    return any ? any.price : 0;
  }
  function paintMods() {
    const wrap = $("#apModal");
    if (!wrap) return;
    (modalState.it.mods || []).forEach((g, gi) => {
      $$('label[data-mod="' + gi + '"]', wrap).forEach((lb) => {
        const name = lb.getAttribute("data-opt");
        const p = modPrice(g, name);
        const input = lb.querySelector("input");
        const span = lb.querySelector("[data-p]");
        if (p === null) { lb.classList.add("dis"); input.disabled = true; input.checked = false; span.textContent = "n/a for size"; }
        else { lb.classList.remove("dis"); input.disabled = false; span.textContent = "+ " + fmt(p); }
      });
    });
    paintTotal();
  }
  function unitBreakdown() {
    const it = modalState.it;
    const base = netPrice(it, sizePrice());
    const save = it.disc ? sizePrice() - base : 0;
    let add = 0;
    const chosen = [];
    (it.mods || []).forEach((g, gi) => {
      (modalState.mods[gi] || []).forEach((name) => {
        const p = modPrice(g, name);
        if (p !== null && p !== undefined) { add += p; chosen.push({ group: g.title, name, price: p }); }
      });
    });
    return { unit: base + add, save, chosen };
  }
  function paintTotal() {
    const wrap = $("#apModal");
    if (!wrap) return;
    const { unit } = unitBreakdown();
    $("#mTotal", wrap).textContent = fmt(unit * modalState.qty);
  }
  function buildLine() {
    const it = modalState.it;
    const { unit, save, chosen } = unitBreakdown();
    const key = [it.id, modalState.size, chosen.map((c) => c.group + ":" + c.name).sort().join(",")].join("|");
    return { key, id: it.id, name: it.name, img: it.img, size: modalState.size, mods: chosen, qty: modalState.qty, unit, savePer: save };
  }
  function initials(n) {
    return n.split(/\s+/).slice(0, 2).map((w) => w[0]).join("").toUpperCase();
  }

  /* quick add used by cards */
  function quickAdd(id) {
    const it = itemById(id);
    if (!it) return;
    if ((it.sizes || []).length <= 1 && !(it.mods || []).length) {
      const s = it.sizes[0] || { name: "Regular", price: 0 };
      addToCart({ key: it.id + "|" + s.name, id: it.id, name: it.name, img: it.img, size: s.name, mods: [], qty: 1, unit: netPrice(it, s.price), savePer: it.disc ? s.price - netPrice(it, s.price) : 0 });
    } else openProduct(id);
  }

  /* ---------- reveal on scroll ---------- */
  function initReveal() {
    const els = $$(".reveal");
    if (!els.length) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
      els.forEach((e) => e.classList.add("on"));
      return;
    }
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("on"); io.unobserve(e.target); } }), { threshold: 0.12 });
    els.forEach((e) => io.observe(e));
  }

  /* ---------- shared card renderer ---------- */
  function productCard(it) {
    const s0 = it.sizes && it.sizes.length ? it.sizes[0] : { name: "", price: 0 };
    const now = netPrice(it, s0.price);
    const catImg = catById(it.cat) && catById(it.cat).img;
    const media = it.img
      ? '<img loading="lazy" src="' + it.img + '" alt="' + esc(it.name) + '">'
      : catImg
        ? '<img loading="lazy" src="' + catImg + '" alt="' + esc(it.name) + ' — illustrated with its ' + esc(catById(it.cat).title) + ' category photo">'
        : '<div class="mono">🍕<br><span style="font-size:.8rem">' + esc(it.name.split(" ")[0]) + "</span></div>";
    const multi = (it.sizes || []).length > 1 || (it.mods || []).length > 0;
    return '<article class="p-card" data-id="' + it.id + '">' +
      '<div class="p-media">' + media + '<span class="veg-mark" title="100% vegetarian"></span>' +
      (it.disc ? '<span class="disc-tag">' + it.disc + "% OFF</span>" : "") + "</div>" +
      '<div class="p-body"><h3>' + esc(it.name) + "</h3>" +
      (it.desc ? '<p class="p-desc">' + esc(it.desc) + "</p>" : "") +
      '<div class="p-price"><span class="now">' + fmt(now) + "</span>" +
      (it.disc ? '<span class="was">' + fmt(s0.price) + "</span>" : "") +
      '<span class="per">' + (s0.name ? esc(s0.name) + " · " : "") + ((it.sizes || []).length > 1 ? "sizes ↑" : "") + "</span></div>" +
      '<div class="p-actions"><button class="btn btn-blue btn-sm" data-act="add">' + (multi ? "Choose & add" : "Add to cart") + "</button>" +
      '<button class="btn btn-ghost btn-sm" data-act="view">Details</button></div></div></article>';
  }

  /* ---------- boot ---------- */
  document.addEventListener("DOMContentLoaded", () => {
    renderHeader();
    renderFooter();
    paintCart();
    initReveal();
    document.body.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-act]");
      if (!btn) return;
      const card = btn.closest("[data-id]");
      if (!card) return;
      const id = card.getAttribute("data-id");
      if (btn.getAttribute("data-act") === "add") quickAdd(id);
      else openProduct(id);
    });
  });

  window.AP = { D, $, $$, fmt, esc, toast, cart, addToCart, setQty, clearCart, cartCount, cartTotals, getOutlet, setOutlet, openProduct, quickAdd, productCard, netPrice, catById, itemById, closeModal };
})();
