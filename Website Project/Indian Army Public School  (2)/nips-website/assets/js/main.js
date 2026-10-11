/* NIPS Etawah — site behaviour (progressive enhancement; pages work without JS) */
(function () {
  'use strict';
  document.documentElement.classList.remove('no-js');
  document.documentElement.classList.add('js');

  // ---- Mobile navigation -------------------------------------------------
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');
  if (toggle && nav) {
    var setOpen = function (open) {
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      nav.classList.toggle('open', open);
    };
    toggle.addEventListener('click', function () {
      setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });
    nav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { setOpen(false); });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { setOpen(false); toggle.focus(); }
    });
  }

  // Header shadow on scroll
  var header = document.querySelector('.site-header');
  if (header) {
    var onScroll = function () { header.classList.toggle('scrolled', window.scrollY > 8); };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // ---- Reveal on scroll --------------------------------------------------
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && reveals.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  // ---- Video modal (YouTube, loaded only on click) -----------------------
  var modal = document.getElementById('video-modal');
  if (modal) {
    var frameHost = modal.querySelector('.ratio');
    var closeBtn = modal.querySelector('.modal-close');
    var lastFocus = null;
    var openVideo = function (id, title) {
      lastFocus = document.activeElement;
      frameHost.innerHTML = '';
      var iframe = document.createElement('iframe');
      iframe.src = 'https://www.youtube-nocookie.com/embed/' + encodeURIComponent(id) + '?autoplay=1&rel=0';
      iframe.title = title || 'School video';
      iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
      iframe.setAttribute('allowfullscreen', '');
      frameHost.appendChild(iframe);
      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
      closeBtn.focus();
    };
    var closeVideo = function () {
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
      frameHost.innerHTML = '';
      if (lastFocus) lastFocus.focus();
    };
    document.querySelectorAll('[data-video-id]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        openVideo(btn.getAttribute('data-video-id'), btn.getAttribute('data-video-title'));
      });
    });
    closeBtn.addEventListener('click', closeVideo);
    modal.addEventListener('click', function (e) { if (e.target === modal) closeVideo(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal.classList.contains('open')) closeVideo();
    });
  }

  // ---- Gallery filter ----------------------------------------------------
  var filterBtns = document.querySelectorAll('.filter-btn');
  if (filterBtns.length) {
    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var f = btn.getAttribute('data-filter');
        filterBtns.forEach(function (b) { b.setAttribute('aria-pressed', String(b === btn)); });
        document.querySelectorAll('[data-cat]').forEach(function (item) {
          var cats = item.getAttribute('data-cat').split(' ');
          item.hidden = !(f === 'all' || cats.indexOf(f) !== -1);
        });
      });
    });
  }

  // ---- Admission enquiry form -------------------------------------------
  var forms = document.querySelectorAll('form[data-enquiry]');
  forms.forEach(function (form) {
    var status = form.querySelector('.form-status');
    var submit = form.querySelector('button[type="submit"]');
    var labelDefault = submit.textContent;

    var showStatus = function (kind, html) {
      status.className = 'form-status show ' + kind;
      status.innerHTML = html;
      status.setAttribute('tabindex', '-1');
      status.focus();
    };
    var setFieldError = function (name, msg) {
      var field = form.querySelector('[name="' + name + '"]');
      if (!field) return;
      var wrap = field.closest('.field');
      var err = wrap && wrap.querySelector('.err');
      if (err) err.textContent = msg || '';
      if (wrap) wrap.classList.toggle('invalid', !!msg);
      field.setAttribute('aria-invalid', msg ? 'true' : 'false');
    };
    var clientValidate = function () {
      var ok = true;
      var fd = new FormData(form);
      var rules = {
        parentName: function (v) { return v.trim().length >= 3 ? '' : 'Please enter the parent/guardian name.'; },
        studentName: function (v) { return v.trim().length >= 2 ? '' : 'Please enter the student name.'; },
        classApplying: function (v) { return v ? '' : 'Please select a class.'; },
        mobile: function (v) { return /^(\+?91[\s-]?)?[6-9]\d{9}$/.test(v.replace(/\s/g, '')) ? '' : 'Enter a valid 10-digit mobile number.'; },
        email: function (v) { return !v || /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) ? '' : 'Enter a valid email address.'; },
      };
      Object.keys(rules).forEach(function (k) {
        var msg = rules[k](String(fd.get(k) || ''));
        setFieldError(k, msg);
        if (msg) ok = false;
      });
      var consent = form.querySelector('[name="consent"]');
      var cMsg = consent.checked ? '' : 'Please allow the school to contact you.';
      setFieldError('consent', cMsg);
      if (cMsg) ok = false;
      return ok;
    };

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      status.className = 'form-status';
      if (!clientValidate()) {
        showStatus('bad', 'Please correct the highlighted fields and try again.');
        var firstBad = form.querySelector('.field.invalid input, .field.invalid select');
        if (firstBad) firstBad.focus();
        return;
      }
      var fd = new FormData(form);
      var payload = {
        parentName: fd.get('parentName'),
        studentName: fd.get('studentName'),
        classApplying: fd.get('classApplying'),
        mobile: fd.get('mobile'),
        email: fd.get('email'),
        address: fd.get('address'),
        message: fd.get('message'),
        consent: form.querySelector('[name="consent"]').checked,
        website: fd.get('website'),
        source: location.pathname.replace(/^\//, '') || 'index.html',
      };
      submit.disabled = true;
      submit.textContent = 'Submitting…';
      showStatus('info', 'Sending your enquiry…');

      fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload),
      }).then(function (res) {
        return res.json().catch(function () { return { ok: false }; }).then(function (body) {
          return { status: res.status, body: body };
        });
      }).then(function (r) {
        if (r.status === 201 && r.body.ok && r.body.saved) {
          form.reset();
          var extra = r.body.notified
            ? 'The school office has also been notified.'
            : 'Our office will review it and call you on the number you provided.';
          showStatus('ok', '<strong>Thank you! Your enquiry has been received.</strong><br>Reference ID: <b>' +
            r.body.id + '</b>. ' + extra + ' For urgent help call <a href="tel:+918006000109">8006000109</a>.');
        } else if (r.status === 422 && r.body.errors) {
          Object.keys(r.body.errors).forEach(function (k) { setFieldError(k, r.body.errors[k]); });
          showStatus('bad', 'Please correct the highlighted fields and try again.');
        } else {
          showStatus('bad', (r.body && r.body.error) ||
            'Your enquiry could not be sent. Please try again, or call <a href="tel:+918006000109">8006000109</a> / <a href="tel:+919720085999">9720085999</a>.');
        }
      }).catch(function () {
        showStatus('bad', 'Network problem — your enquiry was not sent. Please try again, or call <a href="tel:+918006000109">8006000109</a>.');
      }).finally(function () {
        submit.disabled = false;
        submit.textContent = labelDefault;
      });
    });
  });
})();
