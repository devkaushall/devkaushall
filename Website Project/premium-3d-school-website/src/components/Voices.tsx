import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Quote } from "lucide-react";
import Reveal, { Eyebrow } from "./Reveal";

const VOICES = [
  {
    quote:
      "Aurum did not merely prepare me for Oxford — it taught me to walk into any room with ideas worth defending.",
    name: "Amara Chen-Okafor",
    role: "Class of 2019 · Rhodes Scholar",
    initials: "AC",
  },
  {
    quote:
      "We visited fourteen schools. Only one asked our daughter what she wondered about, then handed her a telescope.",
    name: "Prof. Elena Marchetti",
    role: "Parent of two current scholars",
    initials: "EM",
  },
  {
    quote:
      "At midnight the lab fills; at dawn the river fills. Somewhere between the two, you find out who you are.",
    name: "Julian Reyes",
    role: "Class of 2026 · Captain of Crew",
    initials: "JR",
  },
];

export default function Voices() {
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState(1);

  const step = (d: number) => {
    setDir(d);
    setIndex((i) => (i + d + VOICES.length) % VOICES.length);
  };

  const v = VOICES[index];

  return (
    <section id="voices" className="relative overflow-hidden bg-ink-2 py-28 md:py-40">
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <Quote
          className="text-gold/[0.05]"
          size={560}
          strokeWidth={0.4}
          aria-hidden
        />
      </div>

      <div className="relative mx-auto max-w-4xl px-6 text-center md:px-10">
        <Reveal>
          <div className="flex justify-center">
            <Eyebrow>Voices of the Academy</Eyebrow>
          </div>
        </Reveal>

        <div className="mt-14 min-h-[300px] md:min-h-[260px]">
          <AnimatePresence mode="wait" custom={dir}>
            <motion.figure
              key={index}
              initial={{ opacity: 0, x: dir * 60, filter: "blur(6px)" }}
              animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, x: dir * -60, filter: "blur(6px)" }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <blockquote className="font-serif text-2xl font-light leading-snug text-ivory md:text-4xl">
                <em className="italic">{v.quote}</em>
              </blockquote>
              <figcaption className="mt-10 flex items-center justify-center gap-4">
                <span className="grid h-12 w-12 place-items-center rounded-full border border-gold/50 font-serif text-sm text-gold-2">
                  {v.initials}
                </span>
                <span className="text-left">
                  <span className="block text-sm font-semibold text-ivory">{v.name}</span>
                  <span className="mt-1 block text-[10px] uppercase tracking-[0.3em] text-gold">
                    {v.role}
                  </span>
                </span>
              </figcaption>
            </motion.figure>
          </AnimatePresence>
        </div>

        <div className="mt-12 flex items-center justify-center gap-6">
          <button
            onClick={() => step(-1)}
            data-hover
            aria-label="Previous voice"
            className="grid h-12 w-12 place-items-center rounded-full border border-white/10 text-ivory-2 transition-all duration-500 hover:border-gold hover:text-gold-2"
          >
            <ArrowLeft size={16} />
          </button>
          <div className="flex gap-2">
            {VOICES.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setDir(i > index ? 1 : -1);
                  setIndex(i);
                }}
                data-hover
                aria-label={`Go to voice ${i + 1}`}
                className={`h-1 rounded-full transition-all duration-500 ${
                  i === index ? "w-8 bg-gold" : "w-2 bg-white/20 hover:bg-white/40"
                }`}
              />
            ))}
          </div>
          <button
            onClick={() => step(1)}
            data-hover
            aria-label="Next voice"
            className="grid h-12 w-12 place-items-center rounded-full border border-white/10 text-ivory-2 transition-all duration-500 hover:border-gold hover:text-gold-2"
          >
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}
