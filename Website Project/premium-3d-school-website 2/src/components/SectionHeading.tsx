import { motion } from "framer-motion";
import { cn } from "../utils/cn";

interface Props {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  light?: boolean;
}

export default function SectionHeading({ eyebrow, title, description, align = "center", light }: Props) {
  return (
    <div className={cn("max-w-3xl", align === "center" && "mx-auto text-center")}>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className={cn(
          "mb-4 inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.35em]",
          light ? "text-gold-600" : "text-gold-400"
        )}
      >
        <span className="h-px w-8 bg-current" />
        {eyebrow}
        {align === "center" && <span className="h-px w-8 bg-current" />}
      </motion.div>
      <motion.h2
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.1 }}
        className={cn(
          "font-display text-4xl font-semibold leading-tight sm:text-5xl",
          light ? "text-navy-950" : "text-white"
        )}
      >
        {title}
      </motion.h2>
      {description && (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className={cn("mt-5 text-lg leading-relaxed", light ? "text-slate-600" : "text-slate-400")}
        >
          {description}
        </motion.p>
      )}
    </div>
  );
}
