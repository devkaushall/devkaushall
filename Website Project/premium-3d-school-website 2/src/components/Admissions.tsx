import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { CalendarDays, FileText, Users, GraduationCap, Send, CheckCircle2 } from "lucide-react";
import SectionHeading from "./SectionHeading";

const steps = [
  { icon: FileText, title: "Enquire", text: "Submit the form and receive our prospectus within 24 hours." },
  { icon: CalendarDays, title: "Visit", text: "Join an Open Morning or book a private campus tour." },
  { icon: Users, title: "Assess", text: "Entrance assessment and a conversation with our Head of Admissions." },
  { icon: GraduationCap, title: "Enrol", text: "Welcome to Aurelian — your journey begins in September." },
];

export default function Admissions() {
  const [sent, setSent] = useState(false);
  const submit = (e: FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <section id="admissions" className="relative overflow-hidden py-28">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(212,164,58,0.14),transparent_60%)]" />
      <div className="relative mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="Admissions 2026"
          title="Your place among the exceptional"
          description="We welcome applications for Years 7–12 and a limited number of boarding places. Scholarships available for academic, artistic and sporting distinction."
        />

        <div className="mt-16 grid gap-12 lg:grid-cols-5">
          {/* Steps */}
          <div className="lg:col-span-2">
            <ol className="relative space-y-8 border-l border-gold-400/20 pl-8">
              {steps.map((s, i) => (
                <motion.li
                  key={s.title}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.12 }}
                  className="group relative"
                >
                  <span className="absolute -left-[2.6rem] flex h-10 w-10 items-center justify-center rounded-full border border-gold-400/40 bg-navy-950 text-gold-400 shadow-lg transition-all group-hover:scale-110 group-hover:bg-gold-400 group-hover:text-navy-950">
                    <s.icon className="h-4 w-4" />
                  </span>
                  <div className="text-xs uppercase tracking-[0.3em] text-gold-400/70">Step {i + 1}</div>
                  <h3 className="mt-1 font-display text-xl font-semibold text-white">{s.title}</h3>
                  <p className="mt-1 text-sm text-slate-400">{s.text}</p>
                </motion.li>
              ))}
            </ol>
            <div className="glass gold-border mt-10 rounded-2xl p-5">
              <div className="text-xs uppercase tracking-[0.3em] text-gold-400">Next Open Morning</div>
              <div className="mt-2 font-display text-2xl font-semibold text-white">Saturday, 14 March 2026</div>
              <div className="text-sm text-slate-400">9:30 AM · Hawthorne Hall</div>
            </div>
          </div>

          {/* Form */}
          <div className="perspective-1000 lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, rotateY: 15, x: 40 }}
              whileInView={{ opacity: 1, rotateY: 0, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-gold-300/60 via-white/10 to-gold-600/40 p-px shadow-[0_40px_100px_-30px_rgba(0,0,0,0.8)]"
            >
              <div className="relative rounded-[calc(2rem-1px)] bg-navy-900/95 p-8 backdrop-blur-xl sm:p-10">
                <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-gold-500/10 blur-[80px]" />
                {sent ? (
                  <div className="flex flex-col items-center py-16 text-center">
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }}>
                      <CheckCircle2 className="h-20 w-20 text-gold-400" />
                    </motion.div>
                    <h3 className="mt-6 font-display text-3xl font-semibold text-white">Thank you!</h3>
                    <p className="mt-3 max-w-sm text-slate-400">
                      Our Admissions team will be in touch within one working day with your personalised prospectus.
                    </p>
                    <button onClick={() => setSent(false)} className="mt-8 text-sm text-gold-300 underline-offset-4 hover:underline">
                      Submit another enquiry
                    </button>
                  </div>
                ) : (
                  <form onSubmit={submit} className="relative space-y-5">
                    <h3 className="font-display text-2xl font-semibold text-white">Request a Prospectus</h3>
                    <div className="grid gap-5 sm:grid-cols-2">
                      <Field label="Parent / Guardian Name" placeholder="Alexandra Smith" />
                      <Field label="Email Address" type="email" placeholder="alexandra@email.com" />
                      <Field label="Student Name" placeholder="Oliver Smith" />
                      <div>
                        <label className="mb-2 block text-xs font-medium uppercase tracking-[0.2em] text-slate-400">Entry Year</label>
                        <select className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-gold-400/60 focus:bg-white/10">
                          {["Year 7", "Year 8", "Year 9", "Year 10", "Year 11", "Year 12"].map((y) => (
                            <option key={y} className="bg-navy-900">{y}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="mb-2 block text-xs font-medium uppercase tracking-[0.2em] text-slate-400">Message</label>
                      <textarea
                        rows={4}
                        placeholder="Tell us about your child's interests and aspirations…"
                        className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-500 outline-none transition focus:border-gold-400/60 focus:bg-white/10"
                      />
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                      <label className="flex items-center gap-2 text-xs text-slate-400">
                        <input type="checkbox" className="accent-gold-500" /> Interested in boarding
                      </label>
                      <button
                        type="submit"
                        className="group relative inline-flex items-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-gold-300 via-gold-500 to-gold-600 px-7 py-3.5 font-semibold text-navy-950 shadow-lg shadow-gold-500/30 transition-transform hover:-translate-y-0.5"
                      >
                        Send Enquiry <Send className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({ label, type = "text", placeholder }: { label: string; type?: string; placeholder: string }) {
  return (
    <div>
      <label className="mb-2 block text-xs font-medium uppercase tracking-[0.2em] text-slate-400">{label}</label>
      <input
        required
        type={type}
        placeholder={placeholder}
        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-500 outline-none transition focus:border-gold-400/60 focus:bg-white/10"
      />
    </div>
  );
}
