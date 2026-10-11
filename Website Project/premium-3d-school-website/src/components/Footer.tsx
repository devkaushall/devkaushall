import { ArrowUp, GraduationCap } from "lucide-react";
import { scrollToId } from "../lib/lenis";

const COLUMNS = [
  {
    title: "Visit",
    items: ["1 Observatory Hill", "Berkshire Hills, MA", "Sat. Open Houses", "Campus Tours"],
  },
  {
    title: "Contact",
    items: ["admissions@aurum.edu", "+1 (413) 555-0189", "Press & Inquiries", "Careers"],
  },
  {
    title: "Academy",
    items: ["Legacy", "Programs", "Campus", "Admissions"],
  },
];

const SOCIALS = [
  { mark: "IG", label: "Instagram" },
  { mark: "X", label: "X" },
  { mark: "YT", label: "YouTube" },
  { mark: "IN", label: "LinkedIn" },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/5 bg-ink-2">
      <div className="mx-auto max-w-[1500px] px-6 pb-10 pt-20 md:px-10">
        <div className="grid gap-14 md:grid-cols-[1.2fr_2fr]">
          <div>
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 rotate-45 place-items-center border border-gold/60">
                <GraduationCap className="-rotate-45 text-gold-2" size={18} strokeWidth={1.5} />
              </span>
              <span className="leading-none">
                <span className="block font-serif text-lg tracking-[0.22em] text-ivory">AURUM</span>
                <span className="mt-1 block text-[9px] uppercase tracking-[0.5em] text-gold">Academy</span>
              </span>
            </div>
            <p className="mt-6 max-w-xs font-serif text-lg font-light italic leading-relaxed text-ivory-2">
              "Ad astra, per disciplinam."
              <span className="mt-2 block font-sans text-[10px] not-italic uppercase tracking-[0.3em] text-gold">
                To the stars, through discipline
              </span>
            </p>
            <div className="mt-8 flex gap-3">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  aria-label={s.label}
                  data-hover
                  className="grid h-10 w-10 place-items-center rounded-full border border-white/10 font-serif text-[11px] tracking-widest text-ivory-2 transition-all duration-500 hover:-translate-y-1 hover:border-gold hover:text-gold-2"
                >
                  {s.mark}
                </a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
            {COLUMNS.map((col) => (
              <div key={col.title}>
                <h4 className="text-[10px] font-bold uppercase tracking-[0.4em] text-gold">
                  {col.title}
                </h4>
                <ul className="mt-6 space-y-3">
                  {col.items.map((item) => {
                    const isAnchor = ["Legacy", "Programs", "Campus", "Admissions"].includes(item);
                    return (
                      <li key={item}>
                        <button
                          onClick={(e) => {
                            if (!isAnchor) e.preventDefault();
                            else scrollToId(item.toLowerCase());
                          }}
                          data-hover
                          className="text-sm text-ivory-2 transition-colors duration-300 hover:text-gold-2"
                        >
                          {item}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* giant wordmark */}
        <div className="relative mt-20 select-none overflow-hidden">
          <h3 className="text-stroke-gold whitespace-nowrap text-center font-serif text-[19vw] font-light leading-[0.85] tracking-[0.08em] md:text-[15vw]">
            AURUM
          </h3>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-6 border-t border-white/5 pt-8">
          <p className="text-[10px] uppercase tracking-[0.3em] text-ivory-2/60">
            © 2026 Aurum Academy · Est. 1898 · All Rights Reserved
          </p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            data-hover
            className="group flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-ivory-2 transition-colors hover:text-gold-2"
          >
            Back to the summit
            <span className="grid h-10 w-10 place-items-center rounded-full border border-white/10 transition-all duration-500 group-hover:-translate-y-1 group-hover:border-gold">
              <ArrowUp size={14} />
            </span>
          </button>
        </div>
      </div>
    </footer>
  );
}
