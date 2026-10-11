import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, CalendarDays, Check } from "lucide-react";
import Reveal, { Eyebrow } from "./Reveal";
import CrestScene from "./CrestScene";

const DATES = [
  { label: "Applications Open", value: "September 1" },
  { label: "Priority Deadline", value: "January 15" },
  { label: "Decisions Released", value: "March 10" },
];

export default function Admissions() {
  const [sent, setSent] = useState(false);

  return (
    <section id="admissions" className="relative bg-ink py-28 md:py-40">
      <div className="mx-auto max-w-[1500px] px-6 md:px-10">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2rem] border border-gold/20 bg-gradient-to-br from-ink-3 via-ink-2 to-ink">
            {/* ambient glow */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_60%_at_85%_20%,rgba(201,162,75,0.12),transparent_60%)]" />

            <div className="relative grid lg:grid-cols-[1fr_400px]">
              <div className="p-8 md:p-14 lg:p-20">
                <Eyebrow>Admissions</Eyebrow>
                <h2 className="mt-6 font-serif text-4xl font-light leading-[1.06] text-ivory md:text-6xl">
                  Your Seat at the
                  <br />
                  Table <em className="gold-text italic">Awaits</em>
                </h2>
                <p className="mt-6 max-w-md text-sm leading-relaxed text-ivory-2 md:text-base">
                  We admit 84 scholars each year — by curiosity, not by postcode.
                  44% receive financial aid. Request a prospectus and begin the
                  conversation.
                </p>

                {/* key dates */}
                <div className="mt-10 grid max-w-lg grid-cols-3 gap-4">
                  {DATES.map((d, i) => (
                    <Reveal key={d.label} delay={0.15 + i * 0.1}>
                      <div className="border-l border-gold/30 pl-3">
                        <CalendarDays size={14} className="text-gold-2" />
                        <p className="mt-2 text-[9px] uppercase tracking-[0.25em] text-ivory-2">
                          {d.label}
                        </p>
                        <p className="mt-1 font-serif text-sm text-ivory md:text-base">{d.value}</p>
                      </div>
                    </Reveal>
                  ))}
                </div>

                {/* prospectus form */}
                {sent ? (
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-10 flex max-w-lg items-center gap-4 rounded-xl border border-gold/40 bg-gold/10 p-5"
                  >
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gold text-ink">
                      <Check size={18} />
                    </span>
                    <p className="text-sm text-ivory">
                      The 2026 prospectus is en route. Watch your inbox —
                      <span className="text-gold-2"> and the stars.</span>
                    </p>
                  </motion.div>
                ) : (
                  <form
                    className="mt-10 flex max-w-lg flex-col gap-4 sm:flex-row"
                    onSubmit={(e) => {
                      e.preventDefault();
                      setSent(true);
                    }}
                  >
                    <input
                      required
                      type="text"
                      placeholder="Scholar's name"
                      className="w-full border-b border-white/15 bg-transparent px-1 py-3 text-sm text-ivory placeholder:text-ivory-2/50 transition-colors focus:border-gold"
                    />
                    <input
                      required
                      type="email"
                      placeholder="Family email"
                      className="w-full border-b border-white/15 bg-transparent px-1 py-3 text-sm text-ivory placeholder:text-ivory-2/50 transition-colors focus:border-gold"
                    />
                    <button
                      type="submit"
                      data-hover
                      className="group relative shrink-0 overflow-hidden rounded-full bg-gold px-7 py-4 text-[11px] font-bold uppercase tracking-[0.2em] text-ink transition-transform duration-500 hover:scale-[1.03]"
                    >
                      <span className="relative z-10 flex items-center gap-2">
                        Prospectus
                        <ArrowRight size={14} className="transition-transform duration-500 group-hover:translate-x-1" />
                      </span>
                      <span className="absolute inset-0 -translate-x-full bg-gold-2 transition-transform duration-500 group-hover:translate-x-0" />
                    </button>
                  </form>
                )}
              </div>

              {/* 3D crest panel */}
              <div className="relative hidden min-h-[420px] lg:block">
                <div className="absolute inset-0">
                  <CrestScene />
                </div>
                <span className="absolute bottom-8 left-0 right-0 text-center text-[9px] uppercase tracking-[0.5em] text-gold/70">
                  The Founder's Crest
                </span>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
