const puppeteer = require("puppeteer");
const BASE = "http://127.0.0.1:8000/";
const shots = [
  ["index.html", 1280, 900, "home-desktop"],
  ["index.html", 390, 844, "home-mobile"],
  ["menu.html", 1280, 900, "menu-desktop"],
  ["menu.html", 390, 844, "menu-mobile"],
  ["cart.html", 1280, 900, "cart-desktop"],
  ["outlets.html", 768, 1024, "outlets-tablet"],
];
(async () => {
  const browser = await puppeteer.launch({ args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"] });
  for (const [page, w, h, name] of shots) {
    const p = await browser.newPage();
    await p.setViewport({ width: w, height: h, deviceScaleFactor: 1 });
    const errs = [];
    p.on("console", (m) => { if (m.type() === "error") errs.push(m.text()); });
    p.on("pageerror", (e) => errs.push("pageerror: " + e.message));
    await p.goto(BASE + page, { waitUntil: "networkidle0", timeout: 60000 });
    await new Promise((r) => setTimeout(r, 600));
    // scroll through like a user so reveal-on-scroll sections activate
    await p.evaluate(async () => {
      const H = document.body.scrollHeight;
      for (let y = 0; y <= H; y += 600) { window.scrollTo({ top: y, behavior: "instant" }); await new Promise((r) => setTimeout(r, 120)); }
      window.scrollTo({ top: 0, behavior: "instant" });
    });
    await new Promise((r) => setTimeout(r, 700));
    // seed a cart line for cart page visual
    if (page === "cart.html") {
      await p.evaluate(() => {
        window.AP.addToCart({ key: "t1", id: "seed", name: "Farmhouse Pizza", img: "assets/img/products/farmhouse-pizza.jpeg", size: '7" Regular', mods: [{ group: "Choice Of Crusts", name: "Cheese Burst", price: 40 }], qty: 1, unit: 190, savePer: 100 });
      });
      await new Promise((r) => setTimeout(r, 300));
    }
    await p.screenshot({ path: "/home/user/.tests/shots/" + name + ".png", fullPage: true });
    console.log("shot", name, "errors:", errs.length ? errs.join(" | ") : "none");
    await p.close();
  }
  await browser.close();
})().catch((e) => { console.error("SHOT ERROR", e.message); process.exit(1); });
