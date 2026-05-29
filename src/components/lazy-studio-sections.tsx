"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

const Hero = dynamic(() => import("@/components/hero"), { ssr: false });
const HorizontalIntro = dynamic(() => import("@/components/horizontal-intro"), { ssr: false });
const FeaturedWork = dynamic(() => import("@/components/featured-work"), { ssr: false });
const About = dynamic(() => import("@/components/about"), { ssr: false });
const TechStack = dynamic(() => import("@/components/tech-stack"), { ssr: false });
const Contact = dynamic(() => import("@/components/contact"), { ssr: false });
const Footer = dynamic(() => import("@/components/footer"), { ssr: false });

export default function LazyStudioSections() {
  const triggerRef = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    if (shouldLoad) return;

    const load = () => setShouldLoad(true);
    const idleTimer = window.setTimeout(load, 1400);

    if (window.location.hash === "#work" || window.location.hash === "#work-archive") {
      const hashTimer = window.setTimeout(load, 0);
      return () => {
        window.clearTimeout(hashTimer);
        window.clearTimeout(idleTimer);
      };
    }

    const node = triggerRef.current;
    if (!node) {
      return () => window.clearTimeout(idleTimer);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: "900px 0px" }
    );

    observer.observe(node);
    return () => {
      observer.disconnect();
      window.clearTimeout(idleTimer);
    };
  }, [shouldLoad]);

  return (
    <div ref={triggerRef} className="bg-[#051f20]">
      {shouldLoad ? (
        <>
          <HorizontalIntro />
          <Hero />
        </>
      ) : (
        <div className="h-[350vh] bg-[#051f20]" aria-hidden />
      )}

      <div id="work" className="scroll-mt-24">
        {shouldLoad ? (
          <FeaturedWork sectionId="work-archive" />
        ) : (
          <div className="flex min-h-screen items-center justify-center bg-[#051f20] px-6 text-center text-[#daf1de]">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-[#8eb69b]">
                Loading studio mode
              </p>
              <p className="mt-5 font-serif text-4xl italic tracking-normal md:text-6xl">
                Programo archive
              </p>
            </div>
          </div>
        )}
      </div>

      {shouldLoad ? (
        <>
          <About />
          <TechStack />
          <Contact />
          <Footer />
        </>
      ) : (
        <div className="h-64 bg-[#051f20]" aria-hidden />
      )}
    </div>
  );
}
