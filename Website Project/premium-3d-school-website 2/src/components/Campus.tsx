import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import SectionHeading from "./SectionHeading";

const slides = [
  { img: "/images/campus.jpg", title: "The Main Quadrangle", text: "Heritage architecture at the heart of 120 acres." },
  { img: "/images/library.jpg", title: "Hawthorne Library", text: "180,000 volumes beneath a cathedral skylight." },
  { img: "/images/science.jpg", title: "Innovation Laboratories", text: "Twelve research-grade labs and a makerspace." },
  { img: "/images/arts.jpg", title: "Conservatory of Arts", text: "Studios, galleries and a 600-seat theatre." },
  { img: "/images/sports.jpg", title: "Aquatics & Athletics Centre", text: "Olympic-standard pool and performance hub." },
];

export default function Campus() {
  const [active, setActive] = useState(0);
  const n = slides.length;

  useEffect(() => {
    const id = setInterval(() => setActive((a) => (a + 1) % n), 5000);
    return () => clearInterval(id);
  }, [n]);

  const prev = () => setActive((a) => (a - 1 + n) % n);
  const next = () => setActive((a) => (a + 1) % n);

  return (
    <section id="campus" className="relative overflow-hidden py-28">
      <div className="absolute right-0 top-0 h-[500px] w-[500px] translate-x-1/3 rounded-full bg-indigo-500/10 blur-[140px]" />
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="Campus Life"
          title="Spaces designed to inspire"
          description="Explore the landmarks of our campus in an immersive 3D gallery."
        />
      </div>

      <div className="perspective-2000 relative mt-16 h-[460px] md:h-[520px]">
        <div className="preserve-3d relative mx-auto h-full w-full max-w-5xl">
          {slides.map((s, i) => {
            let offset = i - active;
            if (offset > n / 2) offset -= n;
            if (offset < -n / 2) offset += n;
            const abs = Math.abs(offset);
            const isActive = offset === 0;
            return (
              <motion.div
                key={s.title}
                animate={{
                  x: `${offset * 62}%`,
                  z: -abs * 260,
                  rotateY: offset * -32,
                  scale: isActive ? 1 : 0.85,
                  opacity: abs > 2 ? 0 : 1 - abs * 0.25,
                  filter: isActive ? "brightness(1)" : "brightness(0.55)",
                }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                style={{ zIndex: 10 - abs, transformStyle: "preserve-3d" }}
                onClick={() => setActive(i)}
                className="absolute left-1/2 top-0 h-full w-[85%] -translate-x-1/2 cursor-pointer overflow-hidden rounded-3xl shadow-[0_40px_100px_-20px_rgba(0,0,0,0.8)] md:w-[62%]"
              >
                <img src={s.img} alt={s.title} className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-transparent to-transparent" />
                <motion.div
                  animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 20 }}
                  transition={{ delay: 0.3 }}
                  className="absolute inset-x-0 bottom-0 p-8"
                >
                  <div className="mb-2 inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-gold-300">
                    <MapPin className="h-3.5 w-3.5" /> {String(i + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}
                  </div>
                  <h3 className="font-display text-3xl font-semibold text-white">{s.title}</h3>
                  <p className="mt-2 text-slate-300">{s.text}</p>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="mt-10 flex items-center justify-center gap-6">
        <button onClick={prev} aria-label="Previous" className="glass gold-border flex h-12 w-12 items-center justify-center rounded-full text-white transition hover:bg-gold-400 hover:text-navy-950">
          <ChevronLeft />
        </button>
        <div className="flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              aria-label={`Slide ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-500 ${i === active ? "w-10 bg-gold-400" : "w-3 bg-white/20 hover:bg-white/40"}`}
            />
          ))}
        </div>
        <button onClick={next} aria-label="Next" className="glass gold-border flex h-12 w-12 items-center justify-center rounded-full text-white transition hover:bg-gold-400 hover:text-navy-950">
          <ChevronRight />
        </button>
      </div>
    </section>
  );
}
