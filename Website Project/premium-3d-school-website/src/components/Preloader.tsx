import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const LETTERS = "AURUM".split("");

export default function Preloader({ onDone }: { onDone: () => void }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let value = 0;
    const tick = () => {
      value += Math.max(1, Math.round((100 - value) * 0.09));
      setProgress(Math.min(value, 100));
      if (value < 100) {
        timer = window.setTimeout(tick, 90);
      } else {
        timer = window.setTimeout(onDone, 450);
      }
    };
    let timer = window.setTimeout(tick, 250);
    return () => window.clearTimeout(timer);
  }, [onDone]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-ink"
      exit={{ y: "-100%" }}
      transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
    >
      <div className="flex overflow-hidden">
        {LETTERS.map((l, i) => (
          <motion.span
            key={i}
            initial={{ y: "115%" }}
            animate={{ y: 0 }}
            transition={{ duration: 0.9, delay: 0.15 + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
            className="font-serif text-5xl md:text-7xl font-light tracking-[0.18em] text-ivory"
          >
            {l}
          </motion.span>
        ))}
      </div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.8 }}
        className="mt-3 text-[10px] uppercase tracking-[0.6em] text-gold"
      >
        Academy · Est. 1898
      </motion.p>

      <div className="mt-14 h-px w-48 overflow-hidden bg-white/10">
        <motion.div
          className="h-full bg-gold"
          style={{ width: `${progress}%` }}
          transition={{ ease: "easeOut" }}
        />
      </div>
      <span className="mt-4 font-serif text-sm italic text-ivory-2 tabular-nums">
        {String(progress).padStart(3, "0")}%
      </span>
    </motion.div>
  );
}
