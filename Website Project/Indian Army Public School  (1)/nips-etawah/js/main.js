(function () {
  "use strict";

  var menuBtn = document.querySelector(".menu-btn");
  var panel = document.querySelector(".nav-panel");
  if (menuBtn && panel) {
    menuBtn.addEventListener("click", function () {
      var open = panel.classList.toggle("open");
      menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
    });
    panel.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        panel.classList.remove("open");
        menuBtn.setAttribute("aria-expanded", "false");
      });
    });
  }

  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });

  var lb = document.querySelector(".lightbox");
  if (lb) {
    var lbImg = lb.querySelector("img");
    document.querySelectorAll("[data-full]").forEach(function (a) {
      a.addEventListener("click", function (e) {
        e.preventDefault();
        lbImg.src = a.getAttribute("data-full");
        lbImg.alt = a.getAttribute("data-alt") || "";
        lb.classList.add("show");
      });
    });
    lb.addEventListener("click", function (e) {
      if (e.target === lb || e.target.closest("[data-close]")) {
        lb.classList.remove("show");
        lbImg.src = "";
      }
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") lb.classList.remove("show");
    });
  }

  function serialize(form) {
    var data = {};
    new FormData(form).forEach(function (value, key) {
      data[key] = String(value).trim();
    });
    return data;
  }

  function enquiryText(d) {
    return [
      "Admission enquiry — New Indian Public School, Etawah",
      "",
      "Parent / Guardian: " + d.parentName,
      "Student: " + d.studentName,
      "Class: " + d.klass,
      "Mobile: " + d.phone,
      "Email: " + (d.email || "—"),
      "Address: " + (d.address || "—"),
      "",
      "Message:",
      d.message || "Please share admission details for the 2026–27 session."
    ].join("\n");
  }

  function showStatus(box, type, html) {
    box.className = "form-status show " + type;
    box.innerHTML = html;
  }

  document.querySelectorAll("form.enquiry").forEach(function (form) {
    var status = form.querySelector(".form-status");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var d = serialize(form);
      if (d.website) return;
      if (!d.parentName || !d.studentName || !d.klass || !d.phone) {
        showStatus(status, "err", "Please fill parent name, student name, class and mobile number.");
        return;
      }
      if (!/^[0-9+\-\s]{8,15}$/.test(d.phone)) {
        showStatus(status, "err", "Please enter a valid mobile number.");
        return;
      }

      var body = enquiryText(d);
      var mailto =
        "mailto:nipsetawah@gmail.com?subject=" +
        encodeURIComponent("Admission enquiry: " + d.studentName + " — " + d.klass) +
        "&body=" + encodeURIComponent(body);
      var wa =
        "https://wa.me/918006000109?text=" + encodeURIComponent(body);

      fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(d)
      })
        .then(function (res) {
          if (!res.ok) throw new Error("not saved");
          return res.json();
        })
        .then(function (json) {
          form.reset();
          showStatus(
            status,
            "ok",
            "<strong>Enquiry saved on this website server</strong> (file: data/enquiries.json). " +
              "This environment cannot send email by itself. Please also message the school so they receive it immediately.<div class='alt-send'>" +
              "<a class='btn btn-gold' href='" + wa + "' target='_blank' rel='noopener'>Send on WhatsApp</a>" +
              "<a class='btn btn-navy' href='" + mailto + "'>Open in Email</a></div>"
          );
        })
        .catch(function () {
          showStatus(
            status,
            "warn",
            "<strong>The enquiry was not stored on a server.</strong> No fake confirmation has been shown. " +
              "Use WhatsApp or your email app to send this enquiry to the school (nipsetawah@gmail.com / 8006000109).<div class='alt-send'>" +
              "<a class='btn btn-gold' href='" + wa + "' target='_blank' rel='noopener'>Send on WhatsApp</a>" +
              "<a class='btn btn-navy' href='" + mailto + "'>Open in Email</a></div>"
          );
        });
    });
  });
})();
