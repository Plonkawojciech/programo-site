import Navbar from "@/components/navbar";
import Hero from "@/components/hero";
import FeaturedWork from "@/components/featured-work";
import About from "@/components/about";
import TechStack from "@/components/tech-stack";
import Contact from "@/components/contact";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <FeaturedWork />
        <About />
        <TechStack />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
