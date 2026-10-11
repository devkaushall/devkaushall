/* ============================================================
   New Indian Public School, Etawah — shared front-end behaviour
   ============================================================ */
(function () {
  "use strict";

  /* ---------- Mobile navigation ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("main-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---------- Ticker: duplicate content for seamless loop ---------- */
  var track = document.querySelector(".ticker-track");
  if (track) {
    var clone = track.innerHTML;
    track.innerHTML = clone + clone;
    var groups = track.querySelectorAll(".ticker-group");
    if (groups[1]) groups[1].setAttribute("aria-hidden", "true");
  }

  /* ---------- Scroll reveal ---------- */
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var revealEls = document.querySelectorAll(".reveal");
  if (!reduce && "IntersectionObserver" in window && revealEls.length) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            en.target.classList.add("in");
            io.unobserve(en.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---------- Footer year ---------- */
  var yr = document.getElementById("year");
  if (yr) yr.textContent = String(new Date().getFullYear());

  /* ---------- Admission enquiry form ----------
     Submits to this site's own API (server.js). The enquiry is
     stored on the server (data/enquiries.jsonl) and optionally
     forwarded to a webhook (ENQUIRY_WEBHOOK_URL env var).
     We NEVER show a fake success: if the API is unreachable the
     visitor is told to call / WhatsApp the school office.       */
  document.querySelectorAll("form.enquiry-form").forEach(function (form) {
    var status = form.querySelector(".form-status");

    function setFieldError(field, msg) {
      var wrap = field.closest(".field");
      var err = wrap && wrap.querySelector(".err");
      if (wrap) wrap.classList.toggle("invalid", !!msg);
      if (err && msg) err.textContent = msg;
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (status) { status.className = "form-status"; status.textContent = ""; }

      var name = form.elements["student-name"];
      var parent = form.elements["parent-name"];
      var phone = form.elements["phone"];
      var klass = form.elements["class-seeking"];
      var ok = true;

      if (!name.value.trim()) { setFieldError(name, "Student ka naam likhein."); ok = false; } else setFieldError(name, "");
      if (!parent.value.trim()) { setFieldError(parent, "Parent / guardian ka naam likhein."); ok = false; } else setFieldError(parent, "");
      var digits = phone.value.replace(/\D/g, "");
      if (!/^[6-9]\d{9}$/.test(digits)) { setFieldError(phone, "10-digit valid mobile number likhein."); ok = false; } else setFieldError(phone, "");
      if (!klass.value) { setFieldError(klass, "Class select karein."); ok = false; } else setFieldError(klass, "");
      if (!ok) return;

      var payload = {
        studentName: name.value.trim(),
        parentName: parent.value.trim(),
        phone: digits,
        email: (form.elements["email"] ? form.elements["email"].value.trim() : ""),
        classSeeking: klass.value,
        message: (form.elements["message"] ? form.elements["message"].value.trim() : ""),
        page: location.pathname
      };

      var btn = form.querySelector("button[type=submit]");
      if (btn) { btn.disabled = true; btn.textContent = "Bheja ja raha hai…"; }

      fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })
        .then(function (r) { return r.json().then(function (j) { return { code: r.status, body: j }; }); })
        .then(function (res) {
          if (res.body && res.body.ok) {
            var waText = encodeURIComponent(
              "Namaste! Main admission enquiry ke liye contact kar raha/rahi hoon." +
              "\nStudent: " + payload.studentName +
              "\nClass: " + payload.classSeeking +
              "\nRef ID: " + (res.body.id || "")
            );
            if (status) {
              status.className = "form-status ok";
              status.innerHTML =
                "✔ Aapki enquiry is website ke system mein darj ho gayi hai" +
                (res.body.id ? " (Reference: <strong>" + res.body.id + "</strong>)" : "") +
                ". School office jald hi aapko call karegi. Turant jawab ke liye: " +
                "<a href='tel:+918006000109'>80060 00109</a> par call karein ya " +
                "<a href='https://wa.me/918006000109?text=" + waText + "' target='_blank' rel='noopener'>WhatsApp par message</a> bhejein.";
            }
            form.reset();
          } else {
            throw new Error((res.body && res.body.error) || "Server error");
          }
        })
        .catch(function () {
          if (status) {
            status.className = "form-status error";
            status.innerHTML =
              "✖ Enquiry system abhi connect nahi ho paya. Kripya seedha school office se baat karein: " +
              "<a href='tel:+918006000109'>80060 00109</a> / <a href='tel:+919720085999'>97200 85999</a> ya " +
              "<a href='https://wa.me/918006000109' target='_blank' rel='noopener'>WhatsApp</a> karein.";
          }
        })
        .finally(function () {
          if (btn) { btn.disabled = false; btn.textContent = "Enquiry Submit Karein"; }
        });
    });
  });
})();
