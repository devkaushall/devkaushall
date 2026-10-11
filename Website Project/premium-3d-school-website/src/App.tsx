import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { initLenis } from "./lib/lenis";
import Preloader from "./components/Preloader";
import Cursor from "./components/Cursor";
import Nav from "./components/Nav";
import Hero from "./components/Hero";
import Marquee from "./components/Marquee";
import Stats from "./components/Stats";
import About from "./components/About";
import Programs from "./components/Programs";
import Campus from "./components/Campus";
import Voices from "./components/Voices";
import Admissions from "./components/Admissions";
import Footer from "./components/Footer";

export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initLenis();
  }, []);

  return (
    <div className="grain relative min-h-svh bg-ink text-ivory">
      <AnimatePresence>
        {loading && <Preloader onDone={() => setLoading(false)} />}
      </AnimatePresence>

      <Cursor />
      <Nav ready={!loading} />

      <main>
        <Hero ready={!loading} />
        <Marquee />
        <Stats />
        <About />
        <Programs />
        <Campus />
        <Voices />
        <Admissions />
      </main>

      <Footer />
    </div>
  );
}
