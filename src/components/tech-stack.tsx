const technologies = [
  { name: "Next.js", description: "Full-stack React framework" },
  { name: "React Native", description: "Cross-platform mobile apps" },
  { name: "Supabase", description: "Backend & database" },
  { name: "Stripe", description: "Payments infrastructure" },
  { name: "Azure AI", description: "AI & cognitive services" },
  { name: "Vercel", description: "Deployment & hosting" },
];

export default function TechStack() {
  return (
    <section id="stack" className="px-6 py-32 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div>
          <p className="mb-3 text-sm tracking-[0.2em] uppercase text-sage-muted">
            Our Tools
          </p>
          <h2 className="font-serif text-4xl tracking-tight text-sage md:text-5xl">
            Tech Stack
          </h2>
          <p className="mt-4 max-w-lg text-sage-muted">
            We pick tools that let us move fast without sacrificing quality.
            Battle-tested, well-documented, production-ready.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-2 gap-4 md:grid-cols-3 lg:gap-6">
          {technologies.map((tech) => (
            <div
              key={tech.name}
              className="group rounded-xl border border-sage/8 bg-beige/60 p-6 transition-all duration-300 hover:border-sage/15 hover:bg-beige lg:p-8"
            >
              <h3 className="font-serif text-xl text-sage transition-colors group-hover:text-sage-light md:text-2xl">
                {tech.name}
              </h3>
              <p className="mt-2 text-sm text-sage-muted">{tech.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
