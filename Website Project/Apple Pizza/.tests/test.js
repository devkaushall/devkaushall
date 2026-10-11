const { JSDOM, VirtualConsole } = require("jsdom");
const BASE = "http://127.0.0.1:8000/";

const results = [];
function log(ok, page, msg) { results.push({ ok, page, msg }); console.log((ok ? "PASS" : "FAIL") + " [" + page + "] " + msg); }

async function loadPage(page) {
  const vc = new VirtualConsole();
  const errors = [];
  vc.on("jsdomError", (e) => errors.push("jsdomError: " + e.message));
  vc.on("error", (m) => errors.push("console.error: " + m));
  const dom = await JSDOM.fromURL(BASE + page, {
    resources: "usable",
    runScripts: "dangerously",
    pretendToBeVisual: true,
    virtualConsole: vc,
    beforeParse(window) {
      window.HTMLElement.prototype.scrollIntoView = function () {};
      window.scrollTo = function () {};
      if (!window.matchMedia) window.matchMedia = () => ({ matches: false, addListener() {}, removeListener() {} });
    },
  });
  await new Promise((res) => dom.window.addEventListener("load", res));
  await new Promise((r) => setTimeout(r, 350));
  return { dom, errors };
}

(async () => {
  // ---------- HOME ----------
  {
    const { dom, errors } = await loadPage("index.html");
    const d = dom.window.document;
    log(d.querySelectorAll("#catRail .cat-card").length === 10, "index", "category rail shows 10 categories");
    log(d.querySelectorAll("#sigGrid .p-card").length === 8, "index", "8 signature cards");
    log(d.querySelectorAll("#offerGrid .offer-card").length === 4, "index", "4 offer cards");
    log(d.querySelectorAll("#outletGrid .outlet-card").length === 2, "index", "2 outlet cards");
    log(d.querySelectorAll("#revGrid .rev-card").length === 3, "index", "3 review cards");
    log(d.querySelectorAll("#siteHeader .main-nav a").length === 7, "index", "7 nav links");
    log(errors.length === 0, "index", "no console/jsdom errors" + (errors.length ? " -> " + errors.join(" | ") : ""));
  }

  // ---------- MENU ----------
  {
    const { dom, errors } = await loadPage("menu.html");
    const w = dom.window, d = w.document;
    log(d.querySelectorAll("#menuGrid .p-card").length === 63, "menu", "63 items rendered (got " + d.querySelectorAll("#menuGrid .p-card").length + ")");
    // search
    d.getElementById("q").value = "paneer";
    d.getElementById("q").dispatchEvent(new w.Event("input", { bubbles: true }));
    const after = d.querySelectorAll("#menuGrid .p-card").length;
    log(after > 0 && after < 63, "menu", "search 'paneer' filters to " + after + " items");
    // clear search, then category click
    d.getElementById("q").value = "";
    d.getElementById("q").dispatchEvent(new w.Event("input", { bubbles: true }));
    const btn = Array.from(d.querySelectorAll("#sideCats button")).find((b) => b.textContent.indexOf("Veg Feast") !== -1);
    btn.click();
    log(d.querySelectorAll("#menuGrid .p-card").length === 7, "menu", "Veg Feast category shows 7 items");
    // sort
    d.getElementById("sort").value = "low";
    d.getElementById("sort").dispatchEvent(new w.Event("change", { bubbles: true }));
    const prices = Array.from(d.querySelectorAll("#menuGrid .p-price .now")).map((e) => parseInt(e.textContent.replace(/\D/g, ""), 10));
    log(prices.every((p, i) => i === 0 || prices[i - 1] <= p), "menu", "price sort ascending works");
    // product modal + add to cart
    w.AP.openProduct(w.AP.D.items.find((i) => i.name === "Margherita Pizza").id);
    let modal = d.getElementById("apModal");
    log(!!modal, "menu", "product modal opens");
    log(modal.querySelectorAll('input[name="msize"]').length === 3, "menu", "Margherita has 3 sizes");
    // pick medium
    const sizes = modal.querySelectorAll('input[name="msize"]');
    sizes[1].checked = true; sizes[1].dispatchEvent(new w.Event("change", { bubbles: true }));
    // add cheese burst crust
    const crustCb = modal.querySelector('label[data-mod="0"] input');
    crustCb.checked = true; crustCb.dispatchEvent(new w.Event("change", { bubbles: true }));
    const totalTxt = d.getElementById("mTotal").textContent;
    // medium 384*0.6=230.4->230 +50 = 280
    log(totalTxt.indexOf("280") !== -1, "menu", "medium+cheese burst totals ₹280 (got " + totalTxt + ")");
    d.getElementById("mAdd").click();
    log(w.AP.cartCount() === 1, "menu", "cart count = 1 after add");
    const line = w.AP.cart[0];
    log(line.unit === 280 && line.size === '10" Medium' && line.mods.length === 1, "menu", "line stores size+mod+price");
    log(errors.length === 0, "menu", "no console/jsdom errors" + (errors.length ? " -> " + errors.join(" | ") : ""));

    // ---------- CART (same storage? separate origin storage per JSDOM; use same dom) ----------
    // simulate checkout validation
    const cartHtml = require("fs").readFileSync("/home/user/site/cart.html", "utf8");
    void cartHtml;
  }

  // ---------- CART ----------
  {
    const { dom, errors } = await loadPage("cart.html");
    const w = dom.window, d = w.document;
    log(d.getElementById("emptyCart").hidden === false, "cart", "empty cart state shown when no items");
    // seed cart
    w.AP.addToCart({ key: "k1", id: "x", name: "Farmhouse Pizza", img: null, size: '7" Regular', mods: [], qty: 2, unit: 150, savePer: 100 });
    log(d.querySelectorAll("#lines .line-card").length === 1, "cart", "line renders after add");
    log(d.getElementById("sumSub").textContent === "₹300", "cart", "summary totals ₹300 (got " + d.getElementById("sumSub").textContent + ")");
    // qty +
    d.querySelector('[data-q="1"]').click();
    log(w.AP.cart[0].qty === 3, "cart", "qty increment works");
    // validation: submit with bad data
    d.getElementById("checkout").dispatchEvent(new w.Event("submit", { bubbles: true, cancelable: true }));
    log(d.getElementById("fName").closest(".field").classList.contains("invalid"), "cart", "name validation flags empty");
    // fill correctly
    d.getElementById("fName").value = "Test User";
    d.getElementById("fPhone").value = "9876543210";
    d.getElementById("fAddr").value = "12, Gandhi Nagar, near old bridge, Etawah";
    d.getElementById("checkout").dispatchEvent(new w.Event("submit", { bubbles: true, cancelable: true }));
    log(d.getElementById("donePanel").hidden === false, "cart", "order summary panel appears on valid submit");
    log(d.getElementById("waBtn").href.indexOf("wa.me/918938009090") !== -1, "cart", "WhatsApp link targets brand number");
    log(d.getElementById("orderText").textContent.indexOf("3 × Farmhouse Pizza") !== -1, "cart", "order text includes qty × item");
    log(errors.length === 0, "cart", "no console/jsdom errors" + (errors.length ? " -> " + errors.join(" | ") : ""));
  }

  // ---------- OTHER PAGES ----------
  for (const [page, sel, expect, label] of [
    ["offers.html", "#allOffers .offer-card", 5, "5 offer cards"],
    ["offers.html", "#comboGrid .p-card", 4, "4 combo cards"],
    ["outlets.html", "#outletFull .outlet-card", 2, "2 outlet detail cards"],
    ["gallery.html", "#gal .gal-item", 22, "22 gallery items (10 + 12 menu shots)"],
    ["faq.html", ".faq-item", 12, "12 FAQs"],
    ["contact.html", "#cForm", 1, "contact form present"],
    ["about.html", ".timeline li", 5, "5 timeline entries"],
    ["privacy.html", ".prose h2", 6, "privacy sections"],
    ["terms.html", ".prose h2", 8, "terms sections"],
    ["404.html", "h1", 1, "404 heading"],
  ]) {
    const { dom, errors } = await loadPage(page);
    const n = dom.window.document.querySelectorAll(sel).length;
    log(n === expect, page, label + " (got " + n + ")");
    log(errors.length === 0, page, "no console/jsdom errors" + (errors.length ? " -> " + errors.join(" | ") : ""));
  }

  const fails = results.filter((r) => !r.ok);
  console.log("\n==== " + (results.length - fails.length) + "/" + results.length + " passed ====");
  process.exit(fails.length ? 1 : 0);
})().catch((e) => { console.error("HARNESS ERROR", e); process.exit(2); });
