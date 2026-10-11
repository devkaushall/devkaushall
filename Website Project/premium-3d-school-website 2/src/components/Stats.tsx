import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

const stats = [
  { value: 1240, suffix: "", label: "Students enrolled" },
  { value: 156, suffix: "", label: "Expert faculty" },
  { value: 98, suffix: "%", label: "Top-tier university placement" },
  { value: 120, suffix: " acres", label: "Historic campus" },
];

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    const dur = 1800;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 4);
      setN(Math.round(eased * value));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, value]);
  return (
    <span ref={ref}>
      {n.toLocaleString()}
      {suffix}
    </span>
  );
}

const partners = ["Harvard", "Oxford", "MIT", "Cambridge", "Stanford", "ETH Zürich", "Yale", "Imperial", "Princeton", "Sorbonne"];

export default function Stats() {
  return (
    <section className="relative overflow-hidden py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="perspective-1000">
          <motion.div
            initial={{ opacity: 0, rotateX: 25, y: 60 }}
            whileInView={{ opacity: 1, rotateX: 0, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-gold-300 via-gold-500 to-gold-600 p-px shadow-[0_40px_120px_-30px_rgba(212,164,58,0.5)]"
          >
            <div className="relative grid gap-8 rounded-[calc(2rem-1px)] bg-navy-900 px-8 py-14 md:grid-cols-4">
              <div className="absolute inset-0 grid-bg opacity-40" />
              <div className="absolute -top-32 left-1/2 h-64 w-[80%] -translate-x-1/2 rounded-full bg-gold-500/20 blur-[100px]" />
              {stats.map((s, i) => (
                <div key={s.label} className="relative text-center">
                  {i > 0 && <div className="absolute left-0 top-1/2 hidden h-16 w-px -translate-y-1/2 bg-white/10 md:block" />}
                  <div className="font-display text-5xl font-semibold text-gradient-gold">
                    <Counter value={s.value} suffix={s.suffix} />
                  </div>
                  <div className="mt-2 text-sm tracking-wide text-slate-400">{s.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Marquee */}
      <div className="mt-20">
        <p className="mb-6 text-center text-xs uppercase tracking-[0.35em] text-slate-500">Our graduates continue to</p>
        <div className="relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_15%,#000_85%,transparent)]">
          <div className="animate-marquee flex w-max gap-16">
            {[...partners, ...partners].map((p, i) => (
              <span key={i} className="font-display text-2xl font-medium text-slate-500/70 transition-colors hover:text-gold-300">
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
