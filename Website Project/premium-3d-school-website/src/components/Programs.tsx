import { useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";
import { ArrowUpRight, FlaskConical, ScrollText, Palette, Medal } from "lucide-react";
import Reveal, { Eyebrow } from "./Reveal";

const PROGRAMS = [
  {
    icon: FlaskConical,
    title: "Sciences & Astronomy",
    tag: "Observatory · Robotics · Bio-lab",
    img: "/images/lab.jpg",
    alt: "Research laboratory",
  },
  {
    icon: ScrollText,
    title: "Humanities & Letters",
    tag: "Classics · Rhetoric · Philosophy",
    img: "/images/library.jpg",
    alt: "The great library",
  },
  {
    icon: Palette,
    title: "Visual & Performing Arts",
    tag: "Atelier · Conservatory · Stage",
    img: "/images/arts.jpg",
    alt: "The atelier hall",
  },
  {
    icon: Medal,
    title: "Athletics & Character",
    tag: "Crew · Fencing · Alpine",
    img: "/images/athletics.jpg",
    alt: "Dawn crew practice",
  },
];

export default function Programs() {
  const [active, setActive] = useState<number | null>(null);
  const wrap = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 180, damping: 24 });
  const sy = useSpring(my, { stiffness: 180, damping: 24 });

  const onMove = (e: React.MouseEvent) => {
    const rect = wrap.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set(e.clientX - rect.left);
    my.set(e.clientY - rect.top);
  };

  return (
    <section id="programs" className="relative bg-ink-2 py-28 md:py-40">
      <div className="mx-auto max-w-[1500px] px-6 md:px-10">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <div>
            <Reveal>
              <Eyebrow>The Curriculum</Eyebrow>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="mt-6 font-serif text-4xl font-light leading-[1.08] text-ivory md:text-6xl">
                Four Schools,
                <br />
                One <em className="gold-text italic">Calling</em>
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.2}>
            <p className="max-w-sm text-sm leading-relaxed text-ivory-2">
              140+ electives taught at the depth of graduate seminars. Every scholar
              declares a discipline — and defends an original thesis before graduation.
            </p>
          </Reveal>
        </div>

        {/* interactive list */}
        <div
          ref={wrap}
          onMouseMove={onMove}
          onMouseLeave={() => setActive(null)}
          className="relative mt-20"
        >
          {/* cursor-following image (desktop) */}
          <AnimatePresence>
            {active !== null && (
              <motion.div
                key={active}
                initial={{ opacity: 0, scale: 0.75, rotate: -4 }}
                animate={{ opacity: 1, scale: 1, rotate: 2 }}
                exit={{ opacity: 0, scale: 0.75, rotate: 4 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                style={{ x: sx, y: sy }}
                className="pointer-events-none absolute z-20 hidden -translate-x-1/2 -translate-y-[110%] lg:block"
              >
                <img
                  src={PROGRAMS[active].img}
                  alt={PROGRAMS[active].alt}
                  className="aspect-[4/3] w-[300px] rounded-sm object-cover shadow-2xl shadow-black/70 ring-hairline"
                />
              </motion.div>
            )}
          </AnimatePresence>

          {PROGRAMS.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.07}>
              <button
                onMouseEnter={() => setActive(i)}
                data-hover
                className="group relative flex w-full items-center gap-5 border-t border-white/8 py-8 text-left transition-colors duration-500 last:border-b hover:bg-white/[0.02] md:gap-10 md:py-10"
              >
                <span className="font-serif text-sm italic text-gold/70 md:text-base">
                  0{i + 1}
                </span>
                <span className="hidden shrink-0 md:grid h-12 w-12 rotate-45 place-items-center border border-gold/30 transition-all duration-500 group-hover:rotate-[135deg] group-hover:border-gold">
                  <p.icon className="-rotate-45 text-gold-2 transition-transform duration-500 group-hover:-rotate-[135deg]" size={18} strokeWidth={1.4} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-serif text-2xl font-light text-ivory transition-all duration-500 group-hover:translate-x-2 group-hover:text-gold-2 md:text-4xl lg:text-5xl">
                    {p.title}
                  </span>
                  <span className="mt-2 block text-[10px] uppercase tracking-[0.3em] text-ivory-2 md:text-[11px]">
                    {p.tag}
                  </span>
                </span>
                {/* mobile thumbnail */}
                <img
                  src={p.img}
                  alt={p.alt}
                  className="h-16 w-16 shrink-0 rounded-sm object-cover lg:hidden"
                />
                <ArrowUpRight
                  size={26}
                  className="hidden shrink-0 text-gold opacity-0 transition-all duration-500 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:opacity-100 lg:block"
                />
              </button>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
