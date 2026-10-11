import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Landmark, BookOpen, Users } from "lucide-react";
import Reveal, { Eyebrow } from "./Reveal";

const PILLARS = [
  {
    icon: Landmark,
    title: "Honor",
    copy: "A century-old honor code, signed by every scholar, governs life on the Hill.",
  },
  {
    icon: BookOpen,
    title: "Scholarship",
    copy: "Socratic seminars — never lectures — where ideas are tested against first principles.",
  },
  {
    icon: Users,
    title: "Fellowship",
    copy: "Advisory families of eight, shared tables at every meal, friendships for a lifetime.",
  },
];

export default function About() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y1 = useTransform(scrollYProgress, [0, 1], [70, -70]);
  const y2 = useTransform(scrollYProgress, [0, 1], [120, -40]);
  const rot = useTransform(scrollYProgress, [0, 1], [-3, 2]);

  return (
    <section id="legacy" ref={ref} className="relative overflow-hidden bg-ink py-28 md:py-40">
      {/* watermark */}
      <span className="text-stroke-ivory pointer-events-none absolute -right-10 top-16 select-none font-serif text-[24vw] leading-none md:text-[18vw]">
        1898
      </span>

      <div className="relative mx-auto grid max-w-[1500px] gap-16 px-6 md:grid-cols-2 md:gap-10 md:px-10 lg:gap-24">
        {/* copy column */}
        <div className="flex flex-col justify-center">
          <Reveal>
            <Eyebrow>The Legacy</Eyebrow>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="mt-6 font-serif text-4xl font-light leading-[1.08] text-ivory md:text-6xl">
              A Tradition
              <br />
              <em className="gold-text italic">Reimagined</em> for
              <br />
              a Modern Age
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-8 max-w-lg text-sm leading-relaxed text-ivory-2 md:text-base">
              Founded by the astronomer Dr. Eleanor Voss, Aurum began as a single
              observatory and nine pupils beneath the Berkshire stars. One hundred
              and twenty-seven years later, the stars remain our compass: we teach
              scholars to orient themselves by ideas that outlast them.
            </p>
          </Reveal>

          <div className="mt-12 space-y-8">
            {PILLARS.map((p, i) => (
              <Reveal key={p.title} delay={0.15 + i * 0.1}>
                <div className="group flex gap-6 border-b border-white/5 pb-8" data-hover>
                  <span className="grid h-12 w-12 shrink-0 rotate-45 place-items-center border border-gold/40 transition-colors duration-500 group-hover:bg-gold/10">
                    <p.icon className="-rotate-45 text-gold-2" size={18} strokeWidth={1.4} />
                  </span>
                  <div>
                    <h3 className="font-serif text-2xl text-ivory transition-colors duration-500 group-hover:text-gold-2">
                      {p.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-ivory-2">{p.copy}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* image column */}
        <div className="relative min-h-[520px]">
          <motion.div style={{ y: y1 }} className="absolute left-0 top-0 w-[72%]">
            <div className="group relative overflow-hidden rounded-sm">
              <img
                src="/images/campus.jpg"
                alt="The main hall at dusk"
                className="aspect-[4/5] w-full object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent" />
              <span className="absolute bottom-4 left-4 text-[10px] uppercase tracking-[0.3em] text-ivory/80">
                Voss Hall · The Heart of Campus
              </span>
            </div>
          </motion.div>
          <motion.div style={{ y: y2, rotate: rot }} className="absolute bottom-0 right-0 w-[52%]">
            <div className="group relative overflow-hidden rounded-sm border-[6px] border-ink shadow-2xl shadow-black/60">
              <img
                src="/images/students.jpg"
                alt="Scholars crossing the courtyard"
                className="aspect-[4/5] w-full object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/50 to-transparent" />
              <span className="absolute bottom-3 left-3 text-[10px] uppercase tracking-[0.3em] text-ivory/80">
                Morning Procession
              </span>
            </div>
          </motion.div>
          {/* orbiting badge */}
          <motion.div
            style={{ y: y2 }}
            className="absolute -left-6 bottom-10 hidden h-28 w-28 md:block"
          >
            <div className="spin-slower h-full w-full">
              <svg viewBox="0 0 100 100" className="h-full w-full">
                <defs>
                  <path id="circ" d="M 50,50 m -37,0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" />
                </defs>
                <text className="fill-gold text-[8.5px] uppercase tracking-[3px]">
                  <textPath href="#circ">Honor · Scholarship · Fellowship ·</textPath>
                </text>
              </svg>
            </div>
            <Landmark className="absolute inset-0 m-auto text-gold-2" size={20} strokeWidth={1.4} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
