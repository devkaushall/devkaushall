import { GraduationCap, MapPin, Phone, Mail, Camera, Briefcase, Video, AtSign } from "lucide-react";

const cols = [
  { title: "Academy", links: ["About Us", "Leadership", "History & Heritage", "Careers", "Press"] },
  { title: "Learning", links: ["Lower School", "Upper School", "Sixth Form", "Boarding", "Scholarships"] },
  { title: "Community", links: ["Parents' Portal", "Alumni Network", "Giving", "Events", "Summer School"] },
];

export default function Footer() {
  return (
    <footer className="relative border-t border-white/5 bg-navy-950 pt-20">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-400/60 to-transparent" />
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-12 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-gold-300 via-gold-500 to-gold-600 shadow-lg shadow-gold-500/30">
                <GraduationCap className="h-6 w-6 text-navy-950" />
              </div>
              <div>
                <div className="font-display text-2xl font-semibold">Aurelian Academy</div>
                <div className="text-[10px] uppercase tracking-[0.3em] text-gold-400">Lux · Veritas · Virtus</div>
              </div>
            </div>
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-slate-400">
              An independent co-educational day and boarding school for students aged 11–18,
              committed to academic brilliance and character of the highest order.
            </p>
            <ul className="mt-6 space-y-3 text-sm text-slate-400">
              <li className="flex items-center gap-3"><MapPin className="h-4 w-4 text-gold-400" /> 1 Aurelian Park, Hawthorne Hill, Westshire</li>
              <li className="flex items-center gap-3"><Phone className="h-4 w-4 text-gold-400" /> +44 (0) 1234 567 890</li>
              <li className="flex items-center gap-3"><Mail className="h-4 w-4 text-gold-400" /> admissions@aurelian.edu</li>
            </ul>
            <div className="mt-6 flex gap-3">
              {[Camera, Briefcase, Video, AtSign].map((Icon, i) => (
                <a key={i} href="#" className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-slate-400 transition hover:border-gold-400 hover:text-gold-300">
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {cols.map((c) => (
            <div key={c.title}>
              <h4 className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-400">{c.title}</h4>
              <ul className="mt-5 space-y-3">
                {c.links.map((l) => (
                  <li key={l}>
                    <a href="#" className="text-sm text-slate-400 transition hover:text-white">{l}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/5 py-8 text-xs text-slate-500 md:flex-row">
          <div>© {new Date().getFullYear()} Aurelian Academy. All rights reserved.</div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-slate-300">Privacy</a>
            <a href="#" className="hover:text-slate-300">Safeguarding</a>
            <a href="#" className="hover:text-slate-300">Accessibility</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
