import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Academics from "./components/Academics";
import Stats from "./components/Stats";
import Campus from "./components/Campus";
import Faculty from "./components/Faculty";
import Admissions from "./components/Admissions";
import Footer from "./components/Footer";

export default function App() {
  return (
    <div className="relative min-h-screen bg-navy-950 text-white">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Academics />
        <Stats />
        <Campus />
        <Faculty />
        <Admissions />
      </main>
      <Footer />
    </div>
  );
}
