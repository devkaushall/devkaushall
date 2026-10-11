import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import Reveal, { Eyebrow } from "./Reveal";

interface Shot {
  src: string;
  caption: string;
  meta: string;
  ratio: string;
}

const COLS: Shot[][] = [
  [
    { src: "/images/library.jpg", caption: "The Alden Library", meta: "300,000 volumes", ratio: "aspect-[3/4]" },
    { src: "/images/students.jpg", caption: "The Old Courtyard", meta: "Gathered daily at dawn", ratio: "aspect-[4/5]" },
  ],
  [
    { src: "/images/campus.jpg", caption: "Voss Hall at Dusk", meta: "Built 1893, restored 2021", ratio: "aspect-[4/5]" },
    { src: "/images/lab.jpg", caption: "The Meridian Lab", meta: "Open until midnight", ratio: "aspect-[3/4]" },
  ],
  [
    { src: "/images/athletics.jpg", caption: "Dawn on the Housatonic", meta: "Varsity crew since 1904", ratio: "aspect-[4/5]" },
    { src: "/images/arts.jpg", caption: "The North Atelier", meta: "Skylit studios", ratio: "aspect-[3/4]" },
  ],
];

function Column({ shots, y }: { shots: Shot[]; y: MotionValue<number> }) {
  return (
    <motion.div style={{ y }} className="flex flex-col gap-6 md:gap-8">
      {shots.map((s) => (
        <div key={s.caption} className="group relative overflow-hidden rounded-sm" data-hover>
          <img
            src={s.src}
            alt={s.caption}
            loading="lazy"
            className={`${s.ratio} w-full object-cover grayscale-[35%] transition-all duration-[1.4s] ease-out group-hover:scale-105 group-hover:grayscale-0`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent opacity-80 transition-opacity duration-700 group-hover:opacity-100" />
          <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between p-5">
            <div>
              <p className="font-serif text-lg text-ivory">{s.caption}</p>
              <p className="mt-1 text-[10px] uppercase tracking-[0.28em] text-gold-2/90">{s.meta}</p>
            </div>
            <span className="h-8 w-px bg-gold/50 opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
          </div>
        </div>
      ))}
    </motion.div>
  );
}

export default function Campus() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y1 = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const y2 = useTransform(scrollYProgress, [0, 1], [140, -110]);
  const y3 = useTransform(scrollYProgress, [0, 1], [90, -80]);

  return (
    <section id="campus" ref={ref} className="relative overflow-hidden bg-ink py-28 md:py-40">
      <span className="text-stroke-ivory pointer-events-none absolute -left-8 bottom-10 select-none font-serif text-[20vw] leading-none md:text-[15vw]">
        Campus
      </span>

      <div className="relative mx-auto max-w-[1500px] px-6 md:px-10">
        <div className="mb-20 flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
          <div>
            <Reveal>
              <Eyebrow>Life on the Hill</Eyebrow>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="mt-6 font-serif text-4xl font-light leading-[1.08] text-ivory md:text-6xl">
                Forty-Two Acres
                <br />
                of <em className="gold-text italic">Possibility</em>
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.2}>
            <p className="max-w-sm text-sm leading-relaxed text-ivory-2">
              Eleven residence houses, a working observatory, three theatres and a
              boathouse — arranged around the same quadrangle our founders walked.
            </p>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 md:gap-8">
          <Column shots={COLS[0]} y={y1} />
          <div className="md:-mt-16">
            <Column shots={COLS[1]} y={y2} />
          </div>
          <div className="sm:col-span-2 md:col-span-1 md:mt-10">
            <Column shots={COLS[2]} y={y3} />
          </div>
        </div>
      </div>
    </section>
  );
}
