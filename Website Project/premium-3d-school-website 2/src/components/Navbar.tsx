import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, GraduationCap } from "lucide-react";
import { cn } from "../utils/cn";

const links = [
  { label: "About", href: "#about" },
  { label: "Academics", href: "#academics" },
  { label: "Campus", href: "#campus" },
  { label: "Faculty", href: "#faculty" },
  { label: "Admissions", href: "#admissions" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled ? "py-3" : "py-6"
      )}
    >
      <div className="mx-auto max-w-7xl px-6">
        <div
          className={cn(
            "flex items-center justify-between rounded-2xl px-5 py-3 transition-all duration-500",
            scrolled ? "glass gold-border shadow-2xl shadow-black/40" : "bg-transparent"
          )}
        >
          <a href="#" className="group flex items-center gap-3">
            <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-gold-300 via-gold-500 to-gold-600 shadow-lg shadow-gold-500/30 transition-transform duration-500 group-hover:rotate-[15deg] group-hover:scale-110">
              <GraduationCap className="h-6 w-6 text-navy-950" strokeWidth={2.2} />
            </div>
            <div className="leading-tight">
              <div className="font-display text-xl font-semibold tracking-wide">Aurelian</div>
              <div className="text-[10px] uppercase tracking-[0.3em] text-gold-400">Academy · Est. 1892</div>
            </div>
          </a>

          <nav className="hidden items-center gap-1 lg:flex">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="relative rounded-lg px-4 py-2 text-sm font-medium text-slate-300 transition-colors hover:text-white"
              >
                <span className="relative z-10">{l.label}</span>
                <span className="absolute inset-x-4 -bottom-0.5 h-px origin-left scale-x-0 bg-gradient-to-r from-gold-400 to-transparent transition-transform duration-300 hover:scale-x-100" />
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <a href="#admissions" className="text-sm font-medium text-slate-300 transition-colors hover:text-white">
              Portal
            </a>
            <a
              href="#admissions"
              className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-gold-400 to-gold-600 px-5 py-2.5 text-sm font-semibold text-navy-950 shadow-lg shadow-gold-500/25 transition-all hover:shadow-gold-400/40 hover:brightness-110"
            >
              <span className="relative z-10">Apply Now</span>
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            </a>
          </div>

          <button
            onClick={() => setOpen(!open)}
            className="rounded-lg p-2 text-slate-200 lg:hidden"
            aria-label="Toggle menu"
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -10, rotateX: -15 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="glass gold-border mt-3 rounded-2xl p-4 lg:hidden"
            >
              {links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-4 py-3 text-slate-200 hover:bg-white/5"
                >
                  {l.label}
                </a>
              ))}
              <a
                href="#admissions"
                onClick={() => setOpen(false)}
                className="mt-2 block rounded-xl bg-gradient-to-r from-gold-400 to-gold-600 px-4 py-3 text-center font-semibold text-navy-950"
              >
                Apply Now
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}
