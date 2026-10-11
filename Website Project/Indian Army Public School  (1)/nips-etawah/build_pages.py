#!/usr/bin/env python3
"""Generate static HTML pages for New Indian Public School, Etawah."""
from pathlib import Path

ROOT = Path(__file__).resolve().parent

NAV = [
    ("index.html", "Home"),
    ("about.html", "About"),
    ("academics.html", "Academics"),
    ("facilities.html", "Facilities"),
    ("gallery.html", "Gallery"),
    ("admissions.html", "Admissions"),
    ("contact.html", "Contact"),
]


def nav_html(active: str, extra_class: str = "") -> str:
    links = []
    for href, label in NAV:
        cur = ' aria-current="page"' if href == active else ""
        cls = " nav-cta btn btn-primary" if label == "Admissions" and extra_class == "main" else ""
        links.append(f'<a href="{href}"{cur} class="{cls.strip()}">{label}</a>')
    return "\n".join(links)


TICKER = """
<div class="ticker" role="marquee" aria-label="School announcements">
  <div class="ticker-track">
    <span>🎓 Admissions open for session <b>2026–27</b> · Play Group to Class VIII · <b>No admission fee</b> for limited seats</span>
    <span>English-to-English conversation &amp; smart classes · Tulsi Nagar, Bharthana Road, Etawah</span>
    <span>Call <b>8006000109</b> / <b>9720085999</b> · Email nipsetawah@gmail.com</span>
    <span>2nd Unit Test scheduled <b>12–17 October 2026</b></span>
    <span>🎓 Admissions open for session <b>2026–27</b> · Play Group to Class VIII · <b>No admission fee</b> for limited seats</span>
    <span>English-to-English conversation &amp; smart classes · Tulsi Nagar, Bharthana Road, Etawah</span>
    <span>Call <b>8006000109</b> / <b>9720085999</b> · Email nipsetawah@gmail.com</span>
    <span>2nd Unit Test scheduled <b>12–17 October 2026</b></span>
  </div>
</div>
"""

ENQUIRY_FORM = """
<form class="enquiry" action="/api/enquiry" method="post" novalidate>
  <p class="form-note">
    Enquiries are stored on this website in <strong>data/enquiries.json</strong>.
    This preview has no school email mailbox, so a success message is shown only after the file is saved —
    and you will still be asked to send the same details on WhatsApp or email so the office actually receives them.
  </p>
  <div class="hp" aria-hidden="true">
    <label>Leave blank <input type="text" name="website" tabindex="-1" autocomplete="off"></label>
  </div>
  <div class="field">
    <label for="parentName">Parent / Guardian name *</label>
    <input id="parentName" name="parentName" required maxlength="120" autocomplete="name">
  </div>
  <div class="field">
    <label for="studentName">Student name *</label>
    <input id="studentName" name="studentName" required maxlength="120">
  </div>
  <div class="field">
    <label for="klass">Class applying for *</label>
    <select id="klass" name="klass" required>
      <option value="">Select class</option>
      <option>Play Group (P.G.)</option>
      <option>Nursery (N.C.)</option>
      <option>K.G.</option>
      <option>Class I</option>
      <option>Class II</option>
      <option>Class III</option>
      <option>Class IV</option>
      <option>Class V</option>
      <option>Class VI</option>
      <option>Class VII</option>
      <option>Class VIII</option>
    </select>
  </div>
  <div class="field">
    <label for="phone">Mobile number *</label>
    <input id="phone" name="phone" required inputmode="tel" autocomplete="tel" maxlength="15">
  </div>
  <div class="field">
    <label for="email">Email (optional)</label>
    <input id="email" name="email" type="email" autocomplete="email">
  </div>
  <div class="field">
    <label for="address">Residential address</label>
    <input id="address" name="address" maxlength="300">
  </div>
  <div class="field full">
    <label for="message">Your message</label>
    <textarea id="message" name="message" rows="4" maxlength="2000" placeholder="Tell us about the child, preferred shift, transport need, or any question."></textarea>
  </div>
  <div class="field full">
    <button class="btn btn-primary" type="submit">Submit enquiry</button>
  </div>
  <div class="form-status" role="status" aria-live="polite"></div>
</form>
"""


def page(filename, title, description, active, content, extra_head=""):
    canonical = f"https://nipsetawah.com/{'' if filename == 'index.html' else filename}"
    nav_main = nav_html(active, "main")
    nav_panel = nav_html(active)
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{title}</title>
  <meta name="description" content="{description}">
  <link rel="canonical" href="{canonical}">
  <meta name="theme-color" content="#0e2a6b">
  <meta property="og:title" content="{title}">
  <meta property="og:description" content="{description}">
  <meta property="og:type" content="website">
  <meta property="og:url" content="{canonical}">
  <meta property="og:image" content="assets/images/og-image.jpg">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="icon" href="assets/images/favicon-32.png" type="image/png">
  <link rel="apple-touch-icon" href="assets/images/apple-touch.png">
  <link rel="manifest" href="site.webmanifest">
  <link rel="stylesheet" href="css/styles.css">
  {extra_head}
</head>
<body>
  <a class="skip" href="#main">Skip to content</a>
  {TICKER}
  <header class="site-header">
    <div class="util-bar">
      <div class="wrap">
        <div class="util-links">
          <a href="tel:+918006000109">📞 8006000109</a>
          <a href="tel:+919720085999">9720085999</a>
          <a class="hide-sm" href="mailto:nipsetawah@gmail.com">nipsetawah@gmail.com</a>
        </div>
        <div class="util-links">
          <a href="https://nipsetawah.com/Parent/Login" rel="noopener">Parent login</a>
          <a href="admissions.html">No admission fee*</a>
        </div>
      </div>
    </div>
    <div class="wrap nav-bar">
      <a class="brand" href="index.html">
        <img src="assets/images/logo-nav.png" width="220" height="185" alt="New Indian Public School, Etawah emblem">
        <span class="brand-text">
          <strong>New Indian Public School</strong>
          <span>Etawah · CBSE Pattern</span>
        </span>
      </a>
      <nav class="nav" aria-label="Primary">{nav_main}</nav>
      <button class="menu-btn" type="button" aria-expanded="false" aria-controls="mobile-nav">Menu</button>
    </div>
    <nav id="mobile-nav" class="nav-panel" aria-label="Mobile">{nav_panel}</nav>
  </header>
  <main id="main">
    {content}
  </main>
  <footer class="site-footer">
    <div class="wrap foot-grid">
      <div class="foot-brand">
        <img src="assets/images/logo-nav.png" alt="NIPS Etawah logo">
        <p><strong style="color:#fff">New Indian Public School</strong><br>
        Tulsi Nagar, Bharthana Road<br>Etawah, Uttar Pradesh 206001</p>
        <p><a href="tel:+918006000109">+91 8006000109</a><br>
        <a href="tel:+919720085999">+91 9720085999</a><br>
        <a href="mailto:nipsetawah@gmail.com">nipsetawah@gmail.com</a></p>
      </div>
      <div>
        <h3>Explore</h3>
        <ul>
          <li><a href="about.html">About the school</a></li>
          <li><a href="academics.html">Academics</a></li>
          <li><a href="facilities.html">Facilities</a></li>
          <li><a href="gallery.html">Gallery &amp; videos</a></li>
          <li><a href="notices.html">Notice board</a></li>
        </ul>
      </div>
      <div>
        <h3>Admissions</h3>
        <ul>
          <li><a href="admissions.html">Apply / enquire</a></li>
          <li><a href="contact.html">Visit the campus</a></li>
          <li><a href="https://wa.me/918006000109?text=Hello%20New%20Indian%20Public%20School%20Etawah,%20I%20have%20an%20inquiry." rel="noopener">WhatsApp the office</a></li>
          <li><a href="https://www.youtube.com/@newindianpublicschooletawa1672" rel="noopener">YouTube channel</a></li>
        </ul>
      </div>
      <div>
        <h3>School hours</h3>
        <p class="placeholder" style="background:transparent;border-color:rgba(255,255,255,.2);color:#d7deee">
          <strong>Confirm with office:</strong> daily timings, office hours and holiday calendar are not published on the current official site.
        </p>
        <p>Play Group to Class VIII<br>English-to-English conversation<br>Smart classes · CCTV campus</p>
      </div>
    </div>
    <div class="wrap legal">
      <span>© <span data-year>2026</span> New Indian Public School, Etawah. All rights reserved.</span>
      <span>*No admission fee is a limited-seat offer advertised by the school for 2026–27. Other fees, if any, must be confirmed at the office.</span>
    </div>
  </footer>
  <a class="wa-float" href="https://wa.me/918006000109?text=Hello%20New%20Indian%20Public%20School%20Etawah,%20I%20have%20an%20inquiry." aria-label="Chat on WhatsApp">
    <svg viewBox="0 0 24 24" fill="#fff" aria-hidden="true"><path d="M20.5 3.5A11 11 0 0 0 2.1 17.8L1 23l5.3-1.1A11 11 0 0 0 12 23a11 11 0 0 0 8.5-19.5zM12 21a9 9 0 0 1-4.6-1.3l-.3-.2-3.2.7.7-3.1-.2-.3A9 9 0 1 1 12 21zm5-6.7c-.3-.1-1.6-.8-1.9-.9s-.4-.1-.6.1-.7.9-.8 1-.3.2-.6.1a7.4 7.4 0 0 1-2.2-1.4 8 8 0 0 1-1.5-1.9c-.2-.3 0-.4.1-.6l.4-.5.1-.3a.5.5 0 0 0 0-.5c0-.1-.6-1.5-.8-2s-.4-.5-.6-.5h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-1 2.2 5.2 5.2 0 0 0 1.1 2.8 12 12 0 0 0 4.6 4.1 4.2 4.2 0 0 0 2.7.6 3.2 3.2 0 0 0 2.1-1.5 2.6 2.6 0 0 0 .2-1.5c-.1-.1-.3-.2-.6-.3z"/></svg>
  </a>
  <script src="js/main.js"></script>
</body>
</html>
"""


INDEX = r"""
<section class="hero">
  <div class="hero-media">
    <img src="assets/images/hero-assembly.jpg" alt="Students of New Indian Public School, Etawah, in school uniform during morning assembly prayers.">
  </div>
  <div class="hero-inner">
    <p class="kicker" style="color:var(--gold)">Play Group to Class VIII · Etawah</p>
    <h1>A school that hears every child.</h1>
    <p>New Indian Public School offers CBSE-pattern learning with English-to-English conversation, smart classes and a closely watched campus in Tulsi Nagar, Etawah.</p>
    <div class="hero-actions">
      <a class="btn btn-gold" href="admissions.html">Enquire for admission</a>
      <a class="btn btn-ghost" href="tel:+918006000109">Call 8006000109</a>
    </div>
    <div class="hero-meta">
      <span>Session 2026–27 open</span>
      <span>No admission fee for limited seats</span>
      <span>Official photos from the school’s own YouTube channel</span>
    </div>
  </div>
</section>

<section class="trust">
  <div class="wrap trust-grid">
    <div class="trust-item"><strong>P.G. – VIII</strong><span>Classes offered</span></div>
    <div class="trust-item"><strong>20 : 1</strong><span>Student–teacher ratio (as published by the school)</span></div>
    <div class="trust-item"><strong>CCTV</strong><span>Campus under surveillance</span></div>
    <div class="trust-item"><strong>Smart classes</strong><span>English conversation &amp; labs</span></div>
  </div>
</section>

<section class="section">
  <div class="wrap split">
    <div>
      <p class="kicker">The school</p>
      <h2>Warm rooms, clear English, and a watchful campus in Etawah.</h2>
      <hr class="gold-rule">
      <p>Parents looking for a neighbourhood English-medium school from Play Group through Class VIII will find a small, closely supervised setting here. The school publicly emphasises spoken English, smart-class teaching, computer practice, yoga and cultural work — not a long list of unverified awards.</p>
      <p>Leadership is published on the official site: Principal <strong>Mrs. Jaybharti Kushwaha</strong>, Director <strong>Mr. Vikram Kushwaha</strong>, and Manager <strong>Mr. Radhey Shyam Shakya</strong>.</p>
      <p><a class="btn btn-line" href="about.html">Read about us</a></p>
    </div>
    <div class="panel">
      <p class="kicker">Now</p>
      <h3>Admissions 2026–27</h3>
      <p>Registration is open from Play Group (P.G.) to Class VIII. The school is advertising <strong>no admission fee for limited seats</strong>.</p>
      <ul>
        <li>English-to-English conversation</li>
        <li>Smart interactive classes</li>
        <li>Pick &amp; drop transport</li>
        <li>RO drinking water</li>
      </ul>
      <a class="btn btn-primary" href="admissions.html">Start an enquiry</a>
    </div>
  </div>
</section>

<section class="section" style="background:var(--ivory)">
  <div class="wrap">
    <div class="section-head">
      <div>
        <p class="kicker">Academics</p>
        <h2>Three stages, one CBSE-pattern path.</h2>
      </div>
      <a class="btn btn-line" href="academics.html">Full academics</a>
    </div>
    <div class="card-grid">
      <article class="card">
        <div class="icon-blob">PG</div>
        <h3>Pre-primary</h3>
        <p>Play Group, Nursery (N.C.) and K.G. — activity-based days with phonics, numbers, rhymes, motor skills and storytelling.</p>
      </article>
      <article class="card">
        <div class="icon-blob">I–V</div>
        <h3>Primary</h3>
        <p>English, Mathematics, EVS, Hindi, computer studies, smart classes and art — aligned to a CBSE-pattern classroom.</p>
      </article>
      <article class="card">
        <div class="icon-blob">VI–VIII</div>
        <h3>Upper primary</h3>
        <p>Science, Mathematics, Social Studies, stronger English conversation and computer-lab practicals through Class VIII.</p>
      </article>
    </div>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <div class="section-head">
      <div>
        <p class="kicker">Why families choose NIPS</p>
        <h2>Facilities the school itself lists.</h2>
        <p class="lede">Copied only from the official prospectus points on nipsetawah.com — nothing invented.</p>
      </div>
      <a class="btn btn-line" href="facilities.html">All facilities</a>
    </div>
    <div class="facility-grid">
      <article class="facility"><h3>CCTV campus</h3><p>Infrastructure described as fully monitored.</p></article>
      <article class="facility"><h3>Computer lab</h3><p>Practical computer education from early grades.</p></article>
      <article class="facility"><h3>English conversation</h3><p>English-to-English speaking emphasis.</p></article>
      <article class="facility"><h3>Smart classes</h3><p>Audio-visual modules for classroom teaching.</p></article>
      <article class="facility"><h3>Yoga, music &amp; dance</h3><p>Regular cultural and wellness sessions.</p></article>
      <article class="facility"><h3>Transport</h3><p>Pick and drop on a school-managed fleet.</p></article>
      <article class="facility"><h3>RO water</h3><p>Purified and chilled drinking water on campus.</p></article>
      <article class="facility"><h3>20 : 1 ratio</h3><p>Published student–teacher ratio for personal attention.</p></article>
    </div>
  </div>
</section>

<section class="section" style="background:var(--ivory)">
  <div class="wrap">
    <div class="section-head">
      <div>
        <p class="kicker">Leadership</p>
        <h2>People who run the school.</h2>
      </div>
      <a class="btn btn-line" href="about.html">Full messages</a>
    </div>
    <div class="lead-grid">
      <article class="lead-card">
        <img src="assets/images/principal.jpg" alt="Mrs. Jaybharti Kushwaha, Principal, at her desk.">
        <div class="body">
          <div class="role">Principal</div>
          <h3>Mrs. Jaybharti Kushwaha</h3>
          <p class="quote">“We strive to instil Respect, Integrity, Compassion and Excellence so children can meet a changing world.”</p>
        </div>
      </article>
      <article class="lead-card">
        <img src="assets/images/director.jpg" alt="Director of New Indian Public School, Etawah, seated at his office desk. The desk nameplate reads Director.">
        <div class="body">
          <div class="role">Director</div>
          <h3>Mr. Vikram Kushwaha</h3>
          <p class="quote">“The best gift one can give a child is an education of the highest quality.”</p>
        </div>
      </article>
      <article class="lead-card">
        <div class="monogram" aria-hidden="true">RS</div>
        <div class="body">
          <div class="role">Manager</div>
          <h3>Mr. Radhey Shyam Shakya</h3>
          <p class="quote">“Education leads to physical, mental and spiritual development of a person.”</p>
          <p style="font-size:13px;color:var(--muted);margin:0">A verified photograph of the Manager was not available on the official site (see verification notes).</p>
        </div>
      </article>
    </div>
  </div>
</section>

<section class="section">
  <div class="wrap split">
    <div>
      <p class="kicker">Notice board</p>
      <h2>What the office has posted.</h2>
      <div class="notice-list">
        <a class="notice" href="notices.html">
          <div class="notice-date"><b>01</b><span>Oct 2026</span></div>
          <div>
            <span class="tag exam">Exam</span>
            <h3>2nd Unit Test</h3>
            <p>Scheduled from 12 October 2026 to 17 October 2026.</p>
          </div>
        </a>
        <a class="notice" href="notices.html">
          <div class="notice-date"><b>30</b><span>Sep 2026</span></div>
          <div>
            <span class="tag">Urgent</span>
            <h3>Admissions open · P.G. to VIII</h3>
            <p>No admission fee for a limited time. Contact the school office for registration.</p>
          </div>
        </a>
      </div>
    </div>
    <div>
      <p class="kicker">Campus life</p>
      <h2>From the school’s own camera.</h2>
      <div class="gallery-grid" style="grid-template-rows:160px 160px">
        <a class="shot" href="gallery.html"><img src="assets/images/gallery-assembly.jpg" alt="Students in cream uniforms during assembly"><span>Morning assembly</span></a>
        <a class="shot" href="gallery.html"><img src="assets/images/gallery-annual-day.jpg" alt="Students performing a dance on Annual Day"><span>Annual Day</span></a>
        <a class="shot" href="gallery.html"><img src="assets/images/gallery-vidhyaarambh.jpg" alt="Vidhyaarambh ceremony for Play Group children"><span>Vidhyaarambh</span></a>
      </div>
      <p style="margin-top:14px"><a href="gallery.html">Open gallery &amp; videos →</a></p>
    </div>
  </div>
</section>

<section class="admit-band">
  <div class="wrap admit-inner">
    <div>
      <p class="kicker" style="color:var(--gold-soft)">Limited seats</p>
      <h2>Ready to visit or enquire?</h2>
      <p>Call the office, write on WhatsApp, or send the form. We will not pretend a message was emailed if this server cannot send mail.</p>
    </div>
    <div style="display:flex;gap:10px;flex-wrap:wrap">
      <a class="btn btn-gold" href="admissions.html">Admission form</a>
      <a class="btn btn-ghost" href="https://wa.me/918006000109?text=Hello%20New%20Indian%20Public%20School%20Etawah,%20I%20have%20an%20inquiry.">WhatsApp</a>
    </div>
  </div>
</section>

<section class="section">
  <div class="wrap contact-grid">
    <div>
      <p class="kicker">Find us</p>
      <h2>Tulsi Nagar, Bharthana Road</h2>
      <ul class="contact-list">
        <li><span>📍</span><div>Tulsi Nagar, Bharthana Road,<br>Etawah, Uttar Pradesh 206001<br><small style="color:var(--muted)">Address as published on the official website.</small></div></li>
        <li><span>📞</span><div><a href="tel:+918006000109">+91 8006000109</a><br><a href="tel:+919720085999">+91 9720085999</a></div></li>
        <li><span>✉️</span><div><a href="mailto:nipsetawah@gmail.com">nipsetawah@gmail.com</a></div></li>
      </ul>
      <p><a class="btn btn-navy" href="contact.html">Contact page</a></p>
    </div>
    <iframe class="map-frame" title="Map of Tulsi Nagar, Bharthana Road, Etawah" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="https://maps.google.com/maps?q=Tulsi%20Nagar%20Bharthana%20Road%20Etawah%20Uttar%20Pradesh%20206001&amp;z=15&amp;output=embed"></iframe>
  </div>
</section>
"""

ABOUT = f"""
<section class="page-hero">
  <div class="wrap">
    <p class="crumb"><a href="index.html">Home</a> / About</p>
    <h1>About New Indian Public School</h1>
    <p>A CBSE-pattern neighbourhood school in Etawah, from Play Group to Class VIII. Words below are drawn from the school’s own leadership notes — not from another campus.</p>
  </div>
</section>
<section class="section">
  <div class="wrap split">
    <div class="prose">
      <p class="kicker">Who we are</p>
      <h2>Education with English fluency and everyday care.</h2>
      <hr class="gold-rule">
      <p>New Indian Public School, Etawah sits in Tulsi Nagar on Bharthana Road. It teaches children from Play Group through Class VIII on a <strong>CBSE pattern</strong>. The school has not published a board affiliation number on its website, so this page does not call it a CBSE-affiliated school.</p>
      <p>What it does publish is practical: spoken English, smart classes, a computer lab, CCTV, transport, yoga and cultural activity, regular medical check-ups, and a 20:1 student–teacher ratio.</p>
      <div class="placeholder">
        <strong>Please confirm with management:</strong> year of establishment, trust/society name, UDISE or recognition number, and whether the school is formally affiliated to CBSE or only follows the pattern.
      </div>
    </div>
    <aside class="panel">
      <h3>At a glance</h3>
      <p><strong>Name.</strong> New Indian Public School, Etawah</p>
      <p><strong>Classes.</strong> Play Group, Nursery, K.G., I–VIII</p>
      <p><strong>Pattern.</strong> CBSE pattern (affiliation not verified)</p>
      <p><strong>Email.</strong> nipsetawah@gmail.com</p>
      <p><strong>Phones.</strong> 8006000109, 9720085999</p>
      <p><strong>YouTube.</strong> NEW INDIAN PUBLIC SCHOOL ETAWAH</p>
    </aside>
  </div>
</section>
<section class="section" style="background:var(--ivory)">
  <div class="wrap">
    <p class="kicker">From the desks</p>
    <h2>Leadership messages</h2>
    <div class="lead-grid">
      <article class="lead-card">
        <img src="assets/images/principal.jpg" alt="Principal Mrs. Jaybharti Kushwaha">
        <div class="body">
          <div class="role">Principal’s desk</div>
          <h3>Mrs. Jaybharti Kushwaha</h3>
          <p>Each academic year is a new height scaled. The staff work to keep academic standards high and to grow children in Respect, Integrity, Compassion and Excellence. Along with lessons, the school wants habits of collaboration, critical thinking and emotional balance.</p>
          <p class="quote">“Education is a shared commitment between dedicated teachers, motivated students and enthusiastic parents.”</p>
        </div>
      </article>
      <article class="lead-card">
        <img src="assets/images/director.jpg" alt="Director Mr. Vikram Kushwaha, with a Director nameplate on the desk">
        <div class="body">
          <div class="role">Director’s desk</div>
          <h3>Mr. Vikram Kushwaha</h3>
          <p>The Director writes that children must leave school with 21st-century skills and with traditional values held beside a modern outlook. Curiosity — “not to stop questioning” — is the habit the school says it wants to kindle.</p>
          <p class="quote">“Learning gives creativity, creativity leads to thinking, thinking provides knowledge, knowledge makes you great.” — Dr. A.P.J. Abdul Kalam, quoted by the Director</p>
        </div>
      </article>
      <article class="lead-card">
        <div class="monogram">RS</div>
        <div class="body">
          <div class="role">Manager’s desk</div>
          <h3>Mr. Radhey Shyam Shakya</h3>
          <p>The Manager describes all-round growth: sports, a programme for women’s safety, the SPC programme, health-department check-ups and science exhibitions. He thanks parents for rising enrolment and reminds them that teachers are trusted nation-builders.</p>
          <div class="placeholder">Official site labels one office photograph as the Manager, but the desk plaque in that picture reads “Director”. Until management confirms, this page does not attach that photograph to the Manager.</div>
        </div>
      </article>
    </div>
  </div>
</section>
<section class="section">
  <div class="wrap prose">
    <p class="kicker">How we speak about mission</p>
    <h2>Grounded in what this campus actually does</h2>
    <p>The current official “mission/vision” text talks about global sport access. That language does not match a Play Group–VIII school in Etawah, so it is not repeated here as if it were a motto. Until the school issues a short, local mission line, this site uses the leadership notes above.</p>
    <div class="placeholder"><strong>Editable placeholder — mission line:</strong> Please supply one sentence the school is happy to print on the gate and on paper.</div>
  </div>
</section>
"""

ACADEMICS = """
<section class="page-hero">
  <div class="wrap">
    <p class="crumb"><a href="index.html">Home</a> / Academics</p>
    <h1>Academics</h1>
    <p>CBSE-pattern classrooms from Play Group to Class VIII, with a public emphasis on spoken English and smart-class teaching.</p>
  </div>
</section>
<section class="section">
  <div class="wrap">
    <div class="stage">
      <div class="stage-mark">01</div>
      <div>
        <h2>Pre-primary · P.G., N.C., K.G.</h2>
        <p>Activity-based days: motor skills, rhymes, basic phonics, numbers and storytelling in a warm room. Vidhyaarambh for Play Group children is a published school event.</p>
      </div>
    </div>
    <div class="stage">
      <div class="stage-mark">02</div>
      <div>
        <h2>Primary · Class I to V</h2>
        <p>English, Mathematics, Environmental Science, Hindi, computer studies, smart classes and creative arts — described by the school as CBSE-aligned.</p>
      </div>
    </div>
    <div class="stage">
      <div class="stage-mark">03</div>
      <div>
        <h2>Upper primary · Class VI to VIII</h2>
        <p>Science, Mathematics, Social Studies, English conversation, computer-lab practicals and competitive readiness through Class VIII, the highest class currently advertised.</p>
      </div>
    </div>
  </div>
</section>
<section class="section" style="background:var(--ivory)">
  <div class="wrap card-grid">
    <article class="card">
      <h3>English-to-English conversation</h3>
      <p>A stated school priority: children practise English as the language of the classroom, not only as a subject period.</p>
    </article>
    <article class="card">
      <h3>Smart classes</h3>
      <p>Audio-visual modules are used so that topics that feel abstract on a blackboard can be seen and heard.</p>
    </article>
    <article class="card">
      <h3>Computer practicals</h3>
      <p>A computer lab is listed in the prospectus so that digital skills start in the lower grades.</p>
    </article>
  </div>
</section>
<section class="section">
  <div class="wrap split">
    <div class="prose hi" lang="hi">
      <p class="kicker">अभिभावकों से अपेक्षाएँ</p>
      <h2>Guidelines for parents</h2>
      <p>Published on the school’s academics page:</p>
      <ul>
        <li>अभिभावकों से अपेक्षा है कि वे अपने बच्चों के गृहकार्य (Homework) को नियमित रूप से जांचें तथा डायरी पर टिप्पणी अवश्य करें।</li>
        <li>बच्चे की पढ़ाई, साफ-सफाई एवं अनुशासन पर विशेष ध्यान दें।</li>
        <li>विद्यालय में विद्यार्थियों की 75% उपस्थिति होना अनिवार्य है।</li>
        <li>विद्यालय परिसर में मोबाइल फोन, गैजेट्स या कीमती वस्तुएं लाने की अनुमति नहीं है।</li>
        <li>अभिभावक-शिक्षक बैठक (Parent-Teacher Meeting) में नियमित भाग लें।</li>
      </ul>
    </div>
    <div class="placeholder">
      <strong>Confirm with management:</strong> textbook list, assessment calendar beyond the 2nd Unit Test (12–17 Oct 2026), shift timings, and whether CCE or another pattern is used internally.
    </div>
  </div>
</section>
"""

FACILITIES = """
<section class="page-hero">
  <div class="wrap">
    <p class="crumb"><a href="index.html">Home</a> / Facilities</p>
    <h1>Facilities</h1>
    <p>Only the amenities named on the official school site and prospectus flyer are listed here.</p>
  </div>
</section>
<section class="section">
  <div class="wrap facility-grid">
    <article class="facility"><h3>CCTV surveillance</h3><p>Campus described as 100% CCTV monitored, including a live screen visible in the Director’s office photograph.</p></article>
    <article class="facility"><h3>Computer laboratory</h3><p>Well-equipped lab for practical computer education.</p></article>
    <article class="facility"><h3>Smart interactive classes</h3><p>Digital visual learning tools in classrooms.</p></article>
    <article class="facility"><h3>English conversation</h3><p>English-to-English speaking environment.</p></article>
    <article class="facility"><h3>Indoor &amp; outdoor games</h3><p>Sports playground and fitness, as listed in the prospectus.</p></article>
    <article class="facility"><h3>Yoga, meditation &amp; dance</h3><p>Cultural and wellness sessions, visible in school videos.</p></article>
    <article class="facility"><h3>RO &amp; chilled water</h3><p>Purified drinking water on campus.</p></article>
    <article class="facility"><h3>Routine medical checkup</h3><p>Health department teams are mentioned by the Manager.</p></article>
    <article class="facility"><h3>20 : 1 staff ratio</h3><p>Published figure for personal attention. Not independently audited here.</p></article>
    <article class="facility"><h3>Pick &amp; drop</h3><p>Transport on a school-managed fleet. Routes and fees: confirm at office.</p></article>
    <article class="facility"><h3>24/7 power backup</h3><p>Listed on the official academics/facilities page.</p></article>
    <article class="facility"><h3>Qualified staff</h3><p>School describes teachers as experienced and motivated. Individual profiles are not published.</p></article>
  </div>
</section>
<section class="section" style="background:var(--ivory)">
  <div class="wrap prose">
    <h2>What we have not claimed</h2>
    <p>No swimming pool, boarding, AC in every room, Olympic track, or “best school in Etawah” line appears here, because the official site does not evidence those things. Campus building photographs were not available as downloadable stills — gallery images are from the school’s YouTube channel.</p>
    <div class="placeholder"><strong>Please send:</strong> photographs of the building exterior, classrooms, lab, buses and playground, plus any facility you want added only after it exists.</div>
  </div>
</section>
"""

GALLERY = """
<section class="page-hero">
  <div class="wrap">
    <p class="crumb"><a href="index.html">Home</a> / Gallery</p>
    <h1>Gallery &amp; videos</h1>
    <p>Stills and films from the official YouTube channel “NEW INDIAN PUBLIC SCHOOL ETAWAH”. No pictures have been taken from any other school.</p>
  </div>
</section>
<section class="section">
  <div class="wrap">
    <div class="gallery-grid">
      <a class="shot" href="assets/images/gallery-assembly.jpg" data-full="assets/images/gallery-assembly.jpg" data-alt="Students in cream-and-plaid uniforms during assembly prayers">
        <img src="assets/images/gallery-assembly.jpg" alt="Morning assembly"><span>Assembly · School at a glance</span>
      </a>
      <a class="shot" href="assets/images/gallery-annual-day.jpg" data-full="assets/images/gallery-annual-day.jpg" data-alt="Annual Day dance in yellow costumes">
        <img src="assets/images/gallery-annual-day.jpg" alt="Annual Day"><span>Annual Day · Ganesh Vandana</span>
      </a>
      <a class="shot" href="assets/images/gallery-vidhyaarambh.jpg" data-full="assets/images/gallery-vidhyaarambh-full.jpg" data-alt="Vidhyaarambh of Play Group students">
        <img src="assets/images/gallery-vidhyaarambh.jpg" alt="Vidhyaarambh"><span>Vidhyaarambh · P.G.</span>
      </a>
      <a class="shot" href="assets/images/gallery-rainy-day.jpg" data-full="assets/images/gallery-rainy-day.jpg" data-alt="Rainy day celebration on stage">
        <img src="assets/images/gallery-rainy-day.jpg" alt="Rainy day celebration"><span>Rainy day celebration</span>
      </a>
      <a class="shot" href="assets/images/gallery-pg-activity.jpg" data-full="assets/images/gallery-pg-activity.jpg" data-alt="Play Group activity">
        <img src="assets/images/gallery-pg-activity.jpg" alt="Play Group activity"><span>P.G. activity</span>
      </a>
    </div>
  </div>
</section>
<section class="section" style="background:var(--ivory)">
  <div class="wrap">
    <div class="section-head">
      <div>
        <p class="kicker">Watch</p>
        <h2>Official videos</h2>
      </div>
      <a class="btn btn-line" href="https://www.youtube.com/@newindianpublicschooletawa1672" rel="noopener">YouTube channel</a>
    </div>
    <div class="video-grid">
      <div class="video"><iframe src="https://www.youtube-nocookie.com/embed/U73X8cAJSjg" title="School at a glance" allowfullscreen loading="lazy"></iframe></div>
      <div class="video"><iframe src="https://www.youtube-nocookie.com/embed/-xhFjNdlM60" title="Ganesh Vandana — Annual Day" allowfullscreen loading="lazy"></iframe></div>
      <div class="video"><iframe src="https://www.youtube-nocookie.com/embed/UAzpqupboCY" title="Vidhyaarambh of PG students" allowfullscreen loading="lazy"></iframe></div>
      <div class="video"><iframe src="https://www.youtube-nocookie.com/embed/DxGv_TUnqm0" title="Rainy day celebration" allowfullscreen loading="lazy"></iframe></div>
    </div>
    <p style="margin-top:18px;color:var(--muted);font-size:14px">The official website gallery currently hosts a broken “poster.jpg”. Until a fresh campus set is supplied, this page uses only working YouTube stills and embeds.</p>
  </div>
</section>
<div class="lightbox" role="dialog" aria-modal="true" aria-label="Image preview">
  <button type="button" data-close aria-label="Close">×</button>
  <img alt="">
</div>
"""

ADMISSIONS = f"""
<section class="page-hero">
  <div class="wrap">
    <p class="crumb"><a href="index.html">Home</a> / Admissions</p>
    <h1>Admissions 2026–27</h1>
    <p>Play Group to Class VIII. The school is advertising no admission fee for limited seats — confirm availability at the office before you plan around it.</p>
  </div>
</section>
<section class="section">
  <div class="wrap split">
    <div>
      <p class="kicker">How to apply</p>
      <h2>Talk to the office, then send this form.</h2>
      <hr class="gold-rule">
      <ol>
        <li>Call <a href="tel:+918006000109">8006000109</a> or <a href="tel:+919720085999">9720085999</a>, or WhatsApp the same number.</li>
        <li>Share the child’s age and the class you want (P.G. to VIII).</li>
        <li>Visit Tulsi Nagar, Bharthana Road, with the child if the office asks for an interaction.</li>
        <li>Use the form so a written copy is stored on this site and, through your phone, on WhatsApp or email.</li>
      </ol>
      <div class="placeholder">
        <strong>Not published — do not guess:</strong> tuition / transport / exam fees, document checklist, age cut-off dates, and entrance test rules. Ask the office for the current list.
      </div>
      <p>Parent portal (existing official system): <a href="https://nipsetawah.com/Parent/Login" rel="noopener">nipsetawah.com/Parent/Login</a></p>
    </div>
    <div class="panel">
      <h3>Admission enquiry</h3>
      {ENQUIRY_FORM}
    </div>
  </div>
</section>
"""

CONTACT = f"""
<section class="page-hero">
  <div class="wrap">
    <p class="crumb"><a href="index.html">Home</a> / Contact</p>
    <h1>Contact the school</h1>
    <p>Office phones, email, WhatsApp and the address printed on nipsetawah.com.</p>
  </div>
</section>
<section class="section">
  <div class="wrap contact-grid">
    <div>
      <ul class="contact-list">
        <li><span>📍</span><div><strong>Address (official website)</strong><br>Tulsi Nagar, Bharthana Road,<br>Etawah, Uttar Pradesh 206001</div></li>
        <li><span>📞</span><div><a href="tel:+918006000109">+91 8006000109</a><br><a href="tel:+919720085999">+91 9720085999</a></div></li>
        <li><span>✉️</span><div><a href="mailto:nipsetawah@gmail.com">nipsetawah@gmail.com</a></div></li>
        <li><span>💬</span><div><a href="https://wa.me/918006000109?text=Hello%20New%20Indian%20Public%20School%20Etawah,%20I%20have%20an%20inquiry.">WhatsApp 8006000109</a></div></li>
      </ul>
      <div class="placeholder" style="margin-top:18px">
        <strong>Address variants — not merged:</strong> a briefing note mentioned “809, Tulsi Nagar, Yashoda Nagar”; Justdial lists “Near Army Canteen, Tulsi Nagar”. Until the school confirms one line for print, this page uses the official website wording.
      </div>
    </div>
    <div class="panel">
      <h3>Write to the office</h3>
      {ENQUIRY_FORM}
    </div>
  </div>
</section>
<section class="section" style="padding-top:0">
  <div class="wrap">
    <h2>Map</h2>
    <p class="lede">Search pin for Tulsi Nagar, Bharthana Road, Etawah. The official site’s own map embed used a placeholder place-id, so this page searches the published address instead of inventing coordinates.</p>
    <iframe class="map-frame" title="Google Map — Tulsi Nagar, Bharthana Road, Etawah" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="https://maps.google.com/maps?q=Tulsi%20Nagar%20Bharthana%20Road%20Etawah%20Uttar%20Pradesh%20206001&amp;z=15&amp;output=embed"></iframe>
    <p><a href="https://maps.google.com/?q=Tulsi+Nagar+Bharthana+Road+Etawah" rel="noopener">Open in Google Maps</a></p>
  </div>
</section>
"""

NOTICES = """
<section class="page-hero">
  <div class="wrap">
    <p class="crumb"><a href="index.html">Home</a> / Notices</p>
    <h1>Notice board</h1>
    <p>Circulars copied from the official notice board on 10 October 2026.</p>
  </div>
</section>
<section class="section">
  <div class="wrap" style="max-width:820px">
    <article class="notice" style="margin-bottom:16px">
      <div class="notice-date"><b>01</b><span>Oct 2026</span></div>
      <div>
        <span class="tag exam">Exam</span>
        <h2>2nd Unit Test exam date</h2>
        <p>Dear students, your 2nd Unit Test is scheduled from 12th Oct 2026 to 17th Oct 2026.</p>
      </div>
    </article>
    <article class="notice">
      <div class="notice-date"><b>30</b><span>Sep 2026</span></div>
      <div>
        <span class="tag">Urgent</span>
        <h2>Welcome to New Indian Public School (Play Group to Class VIII)</h2>
        <p>New Indian Public School, Etawah announces admission open for Play Group (P.G.) to Class VIII. No admission fee for a limited time. Contact the school office for registration.</p>
      </div>
    </article>
  </div>
</section>
"""

SCHEMA = """
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "School",
  "name": "New Indian Public School, Etawah",
  "url": "https://nipsetawah.com/",
  "logo": "assets/images/logo-lg.png",
  "image": "assets/images/og-image.jpg",
  "telephone": ["+91-8006000109", "+91-9720085999"],
  "email": "nipsetawah@gmail.com",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Tulsi Nagar, Bharthana Road",
    "addressLocality": "Etawah",
    "addressRegion": "Uttar Pradesh",
    "postalCode": "206001",
    "addressCountry": "IN"
  },
  "sameAs": [
    "https://www.youtube.com/@newindianpublicschooletawa1672",
    "https://www.youtube.com/channel/UCFdjiPtdn0xaixuuodBdGsg"
  ]
}
</script>
"""

PAGES = {
    "index.html": ("New Indian Public School, Etawah | CBSE Pattern, Play Group to VIII",
                   "CBSE-pattern school in Tulsi Nagar, Etawah. Play Group to Class VIII, English conversation, smart classes. Admissions 2026–27.",
                   "index.html", INDEX, SCHEMA),
    "about.html": ("About Us | New Indian Public School, Etawah",
                   "Meet the Principal, Director and Manager of New Indian Public School, Etawah.",
                   "about.html", ABOUT, ""),
    "academics.html": ("Academics | New Indian Public School, Etawah",
                       "Play Group to Class VIII on a CBSE pattern, with English conversation and smart classes.",
                       "academics.html", ACADEMICS, ""),
    "facilities.html": ("Facilities | New Indian Public School, Etawah",
                        "CCTV campus, computer lab, smart classes, transport, yoga and RO water — as listed by the school.",
                        "facilities.html", FACILITIES, ""),
    "gallery.html": ("Gallery | New Indian Public School, Etawah",
                     "Assembly, Annual Day, Vidhyaarambh and classroom films from the school’s YouTube channel.",
                     "gallery.html", GALLERY, ""),
    "admissions.html": ("Admissions 2026–27 | New Indian Public School, Etawah",
                        "Enquire for Play Group to Class VIII. Limited seats with no admission fee as advertised by the school.",
                        "admissions.html", ADMISSIONS, ""),
    "contact.html": ("Contact | New Indian Public School, Etawah",
                     "Tulsi Nagar, Bharthana Road, Etawah. Call 8006000109 / 9720085999 or email nipsetawah@gmail.com.",
                     "contact.html", CONTACT, ""),
    "notices.html": ("Notice board | New Indian Public School, Etawah",
                     "Unit test dates and admission notices from New Indian Public School, Etawah.",
                     "index.html", NOTICES, ""),
}


def main():
    for name, (title, desc, active, content, extra) in PAGES.items():
        html = page(name, title, desc, active, content, extra)
        (ROOT / name).write_text(html, encoding="utf-8")
        print("wrote", name, len(html))


if __name__ == "__main__":
    main()
