import { Diamond } from "lucide-react";

const ITEMS = [
  "Admissions Open — Class of 2030",
  "98% Matriculation to Top-30 Universities",
  "12:1 Scholar–Faculty Ratio",
  "42-Acre Historic Campus",
  "$14M in Financial Aid Awarded",
  "47 National Merit Scholars",
];

export default function Marquee() {
  const row = [...ITEMS, ...ITEMS];
  return (
    <div className="relative z-20 -mt-px border-y border-gold/25 bg-ink-2 py-4 overflow-hidden">
      <div className="marquee-track flex w-max items-center">
        {[0, 1].map((half) => (
          <div key={half} className="flex items-center" aria-hidden={half === 1}>
            {row.map((item, i) => (
              <span key={`${half}-${i}`} className="flex items-center">
                <span className="whitespace-nowrap px-8 font-serif text-sm italic tracking-wide text-ivory-2 md:text-base">
                  {item}
                </span>
                <Diamond size={8} className="fill-gold text-gold" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
