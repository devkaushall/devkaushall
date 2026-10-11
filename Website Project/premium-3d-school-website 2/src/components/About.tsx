import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import SectionHeading from "./SectionHeading";

const points = [
  "IB Diploma & Advanced Placement pathways",
  "Dedicated Innovation Lab & Observatory",
  "1:1 mentorship from Year 7 through graduation",
  "Global exchange with 18 partner schools",
];

export default function About() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const yBack = useTransform(scrollYProgress, [0, 1], [80, -80]);
  const yFront = useTransform(scrollYProgress, [0, 1], [-40, 60]);
  const rotate = useTransform(scrollYProgress, [0, 1], [-6, 6]);

  return (
    <section id="about" ref={ref} className="relative py-28">
      <div className="absolute left-0 top-1/3 h-96 w-96 -translate-x-1/2 rounded-full bg-gold-500/10 blur-[120px]" />
      <div className="mx-auto grid max-w-7xl items-center gap-16 px-6 lg:grid-cols-2">
        {/* 3D Image composition */}
        <div className="perspective-2000 relative h-[520px]">
          <motion.div
            style={{ y: yBack, rotateY: rotate, transformStyle: "preserve-3d" }}
            className="absolute left-0 top-0 h-[400px] w-[78%] overflow-hidden rounded-3xl shadow-2xl shadow-black/60"
          >
            <img src="/images/campus.jpg" alt="Aurelian campus" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-navy-950/70 to-transparent" />
          </motion.div>
          <motion.div
            style={{ y: yFront, transformStyle: "preserve-3d" }}
            className="gold-border absolute bottom-0 right-0 h-[300px] w-[58%] overflow-hidden rounded-3xl shadow-2xl shadow-black/70"
          >
            <img src="/images/library.jpg" alt="Library" className="h-full w-full object-cover" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotateX: 30 }}
            whileInView={{ opacity: 1, scale: 1, rotateX: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="glass gold-border animate-float absolute left-8 bottom-16 rounded-2xl p-5 shadow-2xl"
          >
            <div className="font-display text-4xl font-semibold text-gradient-gold">130+</div>
            <div className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-300">Years of Excellence</div>
          </motion.div>
          <div className="absolute -right-6 top-10 h-24 w-24 rounded-full border border-gold-400/30" />
          <div className="absolute -right-2 top-14 h-16 w-16 rounded-full border border-gold-400/20" />
        </div>

        <div>
          <SectionHeading
            eyebrow="Our Story"
            title="A legacy of excellence, reimagined for tomorrow"
            align="left"
          />
          <p className="mt-6 leading-relaxed text-slate-300">
            Founded in 1892 on the principle that character and intellect must grow together,
            Aurelian Academy has evolved into one of the world's most distinguished day and boarding
            schools. Our 120-acre campus pairs heritage architecture with purpose-built facilities
            for the sciences, performing arts and athletics.
          </p>
          <ul className="mt-8 space-y-4">
            {points.map((p, i) => (
              <motion.li
                key={p}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-start gap-3 text-slate-200"
              >
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-gold-400" />
                {p}
              </motion.li>
            ))}
          </ul>
          <div className="mt-10 flex items-center gap-6">
            <a
              href="#academics"
              className="rounded-xl border border-gold-400/40 px-6 py-3 text-sm font-semibold text-gold-300 transition-all hover:bg-gold-400 hover:text-navy-950"
            >
              Explore Academics
            </a>
            <div className="flex items-center gap-3">
              <div className="flex -space-x-3">
                {["#f3d589", "#9bb7ff", "#e6bd5c", "#c7d2fe"].map((c, i) => (
                  <div
                    key={i}
                    className="h-9 w-9 rounded-full border-2 border-navy-950"
                    style={{ background: `linear-gradient(135deg, ${c}, #1b2a5e)` }}
                  />
                ))}
              </div>
              <div className="text-xs text-slate-400">
                <span className="font-semibold text-white">1,240</span> students
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
