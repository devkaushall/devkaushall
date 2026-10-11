import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";
import TiltCard from "./TiltCard";
import SectionHeading from "./SectionHeading";

const faculty = [
  { name: "Dr. Eleanor Whitmore", role: "Head of School", creds: "DPhil, Oxford · Former Rhodes Scholar", initials: "EW", hue: "from-gold-300 to-gold-600" },
  { name: "Prof. Kenji Takahashi", role: "Director of Sciences", creds: "PhD, MIT · 40+ published papers", initials: "KT", hue: "from-sky-300 to-indigo-600" },
  { name: "Ms. Amara Okafor", role: "Dean of Arts", creds: "Juilliard · Royal Philharmonic alumna", initials: "AO", hue: "from-rose-300 to-fuchsia-600" },
  { name: "Mr. Lucas Bergström", role: "Director of Athletics", creds: "Olympic Coach · Sports Science, Loughborough", initials: "LB", hue: "from-emerald-300 to-teal-600" },
];

const testimonials = [
  {
    quote: "Aurelian didn't just prepare our daughter for university — it taught her how to think, lead, and care. The faculty know every child by name and by dream.",
    name: "Catherine & James Hale",
    role: "Parents, Class of 2024",
  },
  {
    quote: "The research opportunities here are unlike anything I'd seen at the secondary level. I co-authored a paper before I turned seventeen.",
    name: "Priya Raman",
    role: "Alumna, now at Stanford",
  },
  {
    quote: "A truly global community. My son arrived knowing no one and left with friends on four continents and a scholarship to Cambridge.",
    name: "Dr. Ahmed El-Sayed",
    role: "Parent, Class of 2023",
  },
];

export default function Faculty() {
  return (
    <section id="faculty" className="relative py-28">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="Our People"
          title="Taught by those who lead their fields"
          description="Over 60% of our faculty hold doctorates. All of them hold a passion for teaching."
        />

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {faculty.map((f, i) => (
            <motion.div
              key={f.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.7 }}
            >
              <TiltCard className="group glass gold-border rounded-3xl p-6 text-center" intensity={14}>
                <div style={{ transform: "translateZ(30px)" }}>
                  <div
                    className={`mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br ${f.hue} font-display text-2xl font-semibold text-navy-950 shadow-xl ring-4 ring-navy-950/60 transition-transform duration-500 group-hover:scale-105`}
                  >
                    {f.initials}
                  </div>
                  <h3 className="mt-5 font-display text-xl font-semibold text-white">{f.name}</h3>
                  <div className="mt-1 text-sm font-medium text-gold-400">{f.role}</div>
                  <p className="mt-3 text-xs leading-relaxed text-slate-400">{f.creds}</p>
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="mt-28 grid gap-6 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.figure
              key={t.name}
              initial={{ opacity: 0, rotateY: -20, x: -30 }}
              whileInView={{ opacity: 1, rotateY: 0, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.8 }}
              className="perspective-1000 group relative flex flex-col rounded-3xl border border-white/8 bg-gradient-to-b from-white/[0.06] to-transparent p-8 transition-all duration-500 hover:-translate-y-2 hover:border-gold-400/40 hover:shadow-[0_30px_80px_-20px_rgba(212,164,58,0.3)]"
            >
              <Quote className="h-8 w-8 text-gold-400/60" />
              <div className="mt-3 flex gap-1">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star key={j} className="h-3.5 w-3.5 fill-gold-400 text-gold-400" />
                ))}
              </div>
              <blockquote className="mt-5 flex-1 font-display text-lg leading-relaxed text-slate-200 italic">
                “{t.quote}”
              </blockquote>
              <figcaption className="mt-6 border-t border-white/10 pt-5">
                <div className="font-semibold text-white">{t.name}</div>
                <div className="text-sm text-slate-400">{t.role}</div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
