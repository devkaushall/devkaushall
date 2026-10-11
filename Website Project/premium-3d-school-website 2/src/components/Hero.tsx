import { motion } from "framer-motion";
import { ArrowRight, Play, Award, Globe2, Sparkles } from "lucide-react";
import HeroScene from "./HeroScene";

const fade = (delay: number) => ({
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] as const },
});

export default function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Background layers */}
      <div className="absolute inset-0 grid-bg opacity-60" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(212,164,58,0.18),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(59,91,219,0.25),transparent_55%)]" />
      <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-navy-950 to-transparent" />

      {/* 3D scene */}
      <div className="absolute inset-y-0 right-0 w-full lg:w-[58%]">
        <HeroScene />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-navy-950 via-navy-950/40 to-transparent lg:via-transparent" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-7xl items-center px-6 pt-28 pb-20">
        <div className="max-w-2xl">
          <motion.div {...fade(0.2)} className="mb-6 inline-flex items-center gap-2 rounded-full glass gold-border px-4 py-2 text-xs font-medium tracking-wide text-gold-300">
            <Sparkles className="h-3.5 w-3.5" />
            Ranked #1 Independent School · 2025
          </motion.div>

          <motion.h1 {...fade(0.35)} className="font-display text-5xl leading-[1.05] font-semibold sm:text-6xl lg:text-7xl">
            Where brilliant minds
            <br />
            <span className="text-gradient-gold animate-shimmer italic">take shape.</span>
          </motion.h1>

          <motion.p {...fade(0.5)} className="mt-7 max-w-xl text-lg leading-relaxed text-slate-300">
            Aurelian Academy blends a 130-year tradition of academic excellence with a
            forward-looking curriculum in science, arts and leadership — nurturing
            students who go on to shape the world.
          </motion.p>

          <motion.div {...fade(0.65)} className="mt-10 flex flex-wrap items-center gap-4">
            <a
              href="#admissions"
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-r from-gold-300 via-gold-500 to-gold-600 px-7 py-4 font-semibold text-navy-950 shadow-[0_20px_60px_-15px_rgba(212,164,58,0.6)] transition-transform hover:-translate-y-0.5"
            >
              Begin Your Application
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            </a>
            <a
              href="#campus"
              className="group inline-flex items-center gap-3 rounded-2xl glass px-6 py-4 font-medium text-white transition-colors hover:bg-white/10"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition-transform group-hover:scale-110">
                <Play className="ml-0.5 h-4 w-4 fill-current" />
              </span>
              Virtual Tour
            </a>
          </motion.div>

          <motion.div {...fade(0.85)} className="mt-14 grid grid-cols-3 gap-6 border-t border-white/10 pt-8">
            {[
              { icon: Award, value: "98%", label: "Ivy & Oxbridge offers" },
              { icon: Globe2, value: "42", label: "Nationalities" },
              { icon: Sparkles, value: "8:1", label: "Student–faculty ratio" },
            ].map((s) => (
              <div key={s.label} className="group">
                <s.icon className="mb-2 h-4 w-4 text-gold-400" />
                <div className="font-display text-3xl font-semibold text-white">{s.value}</div>
                <div className="mt-1 text-xs tracking-wide text-slate-400">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6 }}
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-slate-500 md:flex"
      >
        Scroll
        <span className="h-10 w-px overflow-hidden bg-white/10">
          <motion.span
            animate={{ y: [-40, 40] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
            className="block h-full w-px bg-gold-400"
          />
        </span>
      </motion.div>
    </section>
  );
}
