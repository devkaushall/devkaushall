import { motion } from "framer-motion";
import { ArrowDown, ArrowRight, Play } from "lucide-react";
import ArmillaryScene from "./ArmillaryScene";
import { scrollToId } from "../lib/lenis";

function RevealLine({
  children,
  delay,
  ready,
}: {
  children: React.ReactNode;
  delay: number;
  ready: boolean;
}) {
  return (
    <span className="block overflow-hidden pb-1">
      <motion.span
        className="block"
        initial={{ y: "112%" }}
        animate={ready ? { y: 0 } : {}}
        transition={{ duration: 1.1, delay, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.span>
    </span>
  );
}

export default function Hero({ ready }: { ready: boolean }) {
  return (
    <section className="relative flex min-h-svh flex-col overflow-hidden">
      {/* atmospheric background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_55%_at_68%_40%,rgba(201,162,75,0.14),transparent_60%),radial-gradient(ellipse_45%_45%_at_15%_85%,rgba(58,80,120,0.16),transparent_65%)]" />

      {/* 3D armillary sphere */}
      <motion.div
        initial={{ opacity: 0, scale: 1.12 }}
        animate={ready ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 2, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0 md:left-[12%]"
      >
        <ArmillaryScene />
      </motion.div>

      {/* content */}
      <div className="relative z-10 mx-auto flex w-full max-w-[1500px] flex-1 flex-col justify-center px-6 pt-28 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={ready ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.55 }}
          className="mb-8 flex items-center gap-4"
        >
          <span className="h-px w-12 bg-gold/70" />
          <span className="text-[10px] font-semibold uppercase tracking-[0.45em] text-gold md:text-[11px]">
            Est. 1898 · Berkshire Hills, Massachusetts
          </span>
        </motion.div>

        <h1 className="font-serif font-light leading-[1.02] text-ivory">
          <RevealLine delay={0.65} ready={ready}>
            <span className="block text-[13vw] md:text-[7.2vw] lg:text-[6.4vw]">
              Where Ambition
            </span>
          </RevealLine>
          <RevealLine delay={0.8} ready={ready}>
            <span className="block text-[13vw] md:text-[7.2vw] lg:text-[6.4vw]">
              Becomes <em className="gold-text font-normal italic">Legacy</em>
            </span>
          </RevealLine>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={ready ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 1.15 }}
          className="mt-8 max-w-md text-sm leading-relaxed text-ivory-2 md:text-base"
        >
          An independent day &amp; boarding school where 412 scholars from 38
          nations study a curriculum of uncommon depth — and graduate to lead it.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={ready ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 1.3 }}
          className="mt-10 flex flex-wrap items-center gap-4"
        >
          <button
            onClick={() => scrollToId("admissions")}
            data-hover
            className="group relative overflow-hidden rounded-full bg-gold px-8 py-4 text-[11px] font-bold uppercase tracking-[0.22em] text-ink transition-transform duration-500 hover:scale-[1.03]"
          >
            <span className="relative z-10 flex items-center gap-2">
              Begin Your Journey
              <ArrowRight size={14} className="transition-transform duration-500 group-hover:translate-x-1" />
            </span>
            <span className="absolute inset-0 -translate-x-full bg-gold-2 transition-transform duration-500 group-hover:translate-x-0" />
          </button>
          <button
            onClick={() => scrollToId("programs")}
            data-hover
            className="group flex items-center gap-3 rounded-full border border-ivory/20 px-8 py-4 text-[11px] font-bold uppercase tracking-[0.22em] text-ivory transition-all duration-500 hover:border-gold/60 hover:text-gold-2"
          >
            <Play size={12} className="fill-current" />
            Explore Programs
          </button>
        </motion.div>
      </div>

      {/* bottom rail */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={ready ? { opacity: 1 } : {}}
        transition={{ duration: 1.2, delay: 1.7 }}
        className="relative z-10 mx-auto flex w-full max-w-[1500px] items-end justify-between px-6 pb-10 md:px-10"
      >
        <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.35em] text-ivory-2">
          <span className="relative h-8 w-px overflow-hidden bg-ivory/15">
            <span className="scroll-dot absolute left-0 top-0 h-2.5 w-px bg-gold" />
          </span>
          Scroll to discover
        </div>
        <div className="hidden items-center gap-3 text-right md:flex">
          <span className="text-[10px] uppercase tracking-[0.35em] text-ivory-2">
            The Armillary — symbol of the
            <br />
            Academy since its founding
          </span>
          <ArrowDown size={14} className="text-gold" />
        </div>
      </motion.div>

      {/* vertical side label */}
      <motion.span
        initial={{ opacity: 0 }}
        animate={ready ? { opacity: 1 } : {}}
        transition={{ duration: 1.2, delay: 1.9 }}
        className="absolute right-6 top-1/2 z-10 hidden -translate-y-1/2 rotate-90 text-[9px] uppercase tracking-[0.6em] text-ivory-2/60 lg:block"
      >
        Aurum Academy — MMXXVI
      </motion.span>
    </section>
  );
}
