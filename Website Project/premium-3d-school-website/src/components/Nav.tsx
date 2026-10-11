import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { GraduationCap, Menu, X, ArrowUpRight } from "lucide-react";
import { scrollToId } from "../lib/lenis";

const LINKS = [
  { label: "Legacy", id: "legacy" },
  { label: "Programs", id: "programs" },
  { label: "Campus", id: "campus" },
  { label: "Voices", id: "voices" },
];

export default function Nav({ ready }: { ready: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (id: string) => {
    setOpen(false);
    scrollToId(id);
  };

  return (
    <>
      <motion.header
        initial={{ y: -60, opacity: 0 }}
        animate={ready ? { y: 0, opacity: 1 } : {}}
        transition={{ duration: 1, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed inset-x-0 top-0 z-[80] transition-all duration-500 ${
          scrolled ? "bg-ink/70 backdrop-blur-xl ring-hairline" : "bg-transparent"
        }`}
      >
        <nav className="mx-auto flex max-w-[1500px] items-center justify-between px-6 py-4 md:px-10 md:py-5">
          <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} data-hover className="flex items-center gap-3">
            <span className="grid h-10 w-10 rotate-45 place-items-center border border-gold/60 bg-ink">
              <GraduationCap className="-rotate-45 text-gold-2" size={18} strokeWidth={1.5} />
            </span>
            <span className="text-left leading-none">
              <span className="block font-serif text-lg tracking-[0.22em] text-ivory">AURUM</span>
              <span className="mt-1 block text-[9px] uppercase tracking-[0.5em] text-gold">Academy</span>
            </span>
          </button>

          <div className="hidden items-center gap-9 md:flex">
            {LINKS.map((l) => (
              <button
                key={l.id}
                onClick={() => go(l.id)}
                data-hover
                className="group relative text-[11px] font-semibold uppercase tracking-[0.3em] text-ivory-2 transition-colors hover:text-ivory"
              >
                {l.label}
                <span className="absolute -bottom-1.5 left-0 h-px w-0 bg-gold transition-all duration-500 group-hover:w-full" />
              </button>
            ))}
            <button
              onClick={() => go("admissions")}
              data-hover
              className="group flex items-center gap-2 rounded-full border border-gold/50 px-6 py-2.5 text-[11px] font-semibold uppercase tracking-[0.25em] text-gold-2 transition-all duration-500 hover:bg-gold hover:text-ink"
            >
              Inquire
              <ArrowUpRight size={14} className="transition-transform duration-500 group-hover:rotate-45" />
            </button>
          </div>

          <button onClick={() => setOpen(true)} data-hover className="text-ivory md:hidden" aria-label="Open menu">
            <Menu size={24} strokeWidth={1.5} />
          </button>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, clipPath: "circle(0% at 100% 0%)" }}
            animate={{ opacity: 1, clipPath: "circle(150% at 100% 0%)" }}
            exit={{ opacity: 0, clipPath: "circle(0% at 100% 0%)" }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-[90] flex flex-col bg-ink-2"
          >
            <div className="flex items-center justify-between px-6 py-5">
              <span className="font-serif tracking-[0.22em] text-ivory">AURUM</span>
              <button onClick={() => setOpen(false)} aria-label="Close menu" className="text-gold">
                <X size={26} strokeWidth={1.5} />
              </button>
            </div>
            <div className="flex flex-1 flex-col items-start justify-center gap-2 px-8">
              {[...LINKS, { label: "Admissions", id: "admissions" }].map((l, i) => (
                <motion.button
                  key={l.id}
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.25 + i * 0.08, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  onClick={() => go(l.id)}
                  className="group flex items-baseline gap-4 py-2"
                >
                  <span className="font-serif text-sm italic text-gold">0{i + 1}</span>
                  <span className="font-serif text-5xl font-light text-ivory transition-colors group-hover:text-gold-2">
                    {l.label}
                  </span>
                </motion.button>
              ))}
            </div>
            <div className="px-8 pb-10 text-[10px] uppercase tracking-[0.4em] text-ivory-2">
              Est. 1898 · Berkshire Hills, MA
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
