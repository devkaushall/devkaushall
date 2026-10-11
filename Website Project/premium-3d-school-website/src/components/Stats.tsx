import { useEffect, useRef, useState } from "react";
import { animate, useInView } from "framer-motion";
import Reveal from "./Reveal";

interface Stat {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  label: string;
  sub: string;
}

const STATS: Stat[] = [
  { value: 98, suffix: "%", label: "University Placement", sub: "Top-30 global institutions" },
  { value: 12, suffix: ":1", label: "Scholar–Faculty Ratio", sub: "Average seminar of nine" },
  { value: 38, label: "Nations Represented", sub: "One residential community" },
  { value: 14, prefix: "$", suffix: "M", label: "Annual Financial Aid", sub: "44% of scholars supported" },
];

function Counter({ stat }: { stat: Stat }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, stat.value, {
      duration: 2.2,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(String(Math.round(v))),
    });
    return () => controls.stop();
  }, [inView, stat.value]);

  return (
    <span ref={ref} className="font-serif text-6xl font-light text-ivory md:text-7xl tabular-nums">
      {stat.prefix}
      {display}
      <span className="gold-text">{stat.suffix}</span>
    </span>
  );
}

export default function Stats() {
  return (
    <section className="relative bg-ink">
      <div className="mx-auto grid max-w-[1500px] grid-cols-1 gap-px bg-white/5 px-6 py-20 sm:grid-cols-2 md:px-10 lg:grid-cols-4">
        {STATS.map((s, i) => (
          <Reveal key={s.label} delay={i * 0.1} className="bg-ink px-8 py-10">
            <Counter stat={s} />
            <p className="mt-5 text-[11px] font-bold uppercase tracking-[0.25em] text-ivory">
              {s.label}
            </p>
            <p className="mt-2 text-xs tracking-wide text-ivory-2">{s.sub}</p>
            <div className="gold-sep mt-6 w-16" />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
