import { motion } from "framer-motion";
import { FlaskConical, Palette, Trophy, BookOpen, Cpu, Globe, ArrowUpRight } from "lucide-react";
import TiltCard from "./TiltCard";
import SectionHeading from "./SectionHeading";

const programs = [
  {
    icon: FlaskConical,
    title: "Sciences & Research",
    desc: "University-grade labs, an on-campus observatory and a published student research journal.",
    image: "/images/science.jpg",
    tag: "STEM",
  },
  {
    icon: Palette,
    title: "Creative & Performing Arts",
    desc: "A 600-seat theatre, recording studios and conservatory-level instruction in music and visual arts.",
    image: "/images/arts.jpg",
    tag: "Arts",
  },
  {
    icon: Trophy,
    title: "Athletics & Wellbeing",
    desc: "Olympic-standard aquatics centre, 14 varsity sports and a dedicated performance science team.",
    image: "/images/sports.jpg",
    tag: "Sport",
  },
];

const minis = [
  { icon: BookOpen, title: "Humanities", text: "Socratic seminars & global literature" },
  { icon: Cpu, title: "Computer Science", text: "AI, robotics & quantum fundamentals" },
  { icon: Globe, title: "Global Studies", text: "Six languages & diplomacy programme" },
];

export default function Academics() {
  return (
    <section id="academics" className="relative py-28">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(27,42,94,0.5),transparent_60%)]" />
      <div className="relative mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="Academics"
          title="A curriculum engineered for curiosity"
          description="Three signature schools within the Academy, each led by faculty who are leaders in their fields."
        />

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {programs.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 60, rotateX: 20 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
            >
              <TiltCard className="group h-[480px] overflow-hidden rounded-3xl gold-border" intensity={10}>
                <img
                  src={p.image}
                  alt={p.title}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/60 to-navy-950/10" />
                <div className="relative flex h-full flex-col justify-between p-7" style={{ transform: "translateZ(40px)" }}>
                  <div className="flex items-start justify-between">
                    <span className="rounded-full glass px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-gold-300">
                      {p.tag}
                    </span>
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-gold-300 to-gold-600 text-navy-950 shadow-lg shadow-gold-500/30">
                      <p.icon className="h-5 w-5" />
                    </span>
                  </div>
                  <div>
                    <h3 className="font-display text-2xl font-semibold text-white">{p.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-slate-300">{p.desc}</p>
                    <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-gold-300">
                      Discover
                      <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </div>
                  </div>
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {minis.map((m, i) => (
            <motion.div
              key={m.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="group glass flex items-center gap-4 rounded-2xl p-5 transition-all hover:-translate-y-1 hover:bg-white/10"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/5 text-gold-400 transition-all group-hover:bg-gold-400 group-hover:text-navy-950">
                <m.icon className="h-5 w-5" />
              </span>
              <div>
                <div className="font-semibold text-white">{m.title}</div>
                <div className="text-sm text-slate-400">{m.text}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
