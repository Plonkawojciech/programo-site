// Portfolio: featured-work cards, status labels and the project detail page.
export const projects = {
  // Featured Work
  "work.label": { pl: "Wybrane projekty", en: "Selected Projects" },
  "work.title": { pl: "Nasze realizacje", en: "Featured Work" },
  "work.viewProject": { pl: "Zobacz projekt", en: "View project" },
  "work.comingSoon": { pl: "Wkrótce", en: "Coming Soon" },
  "work.inDevelopment": { pl: "W realizacji", en: "In Development" },
  "work.live": { pl: "Na żywo", en: "Live" },

  // Project Detail Page
  "project.backToProjects": { pl: "← Wszystkie projekty", en: "← All projects" },
  "project.about": { pl: "O projekcie", en: "About" },
  "project.whatWeBuilt": { pl: "Co zbudowaliśmy", en: "What we built" },
  "project.role": { pl: "Rola", en: "Role" },
  "project.status": { pl: "Status", en: "Status" },
  "project.techStack": { pl: "Technologie", en: "Tech Stack" },
  "project.year": { pl: "Rok", en: "Year" },
  "project.visitSite": { pl: "Odwiedź stronę", en: "Visit site" },
  "project.nextProject": { pl: "Następny projekt", en: "Next project" },
  "project.prevProject": { pl: "Poprzedni projekt", en: "Previous project" },
  "project.statusLive": { pl: "Na żywo", en: "Live" },
  "project.statusDev": { pl: "W realizacji", en: "In Development" },
  "project.statusPlanned": { pl: "Planowany", en: "Planned" },
  "project.interestedCta": {
    pl: "Chcesz zbudować coś podobnego?",
    en: "Want to build something similar?",
  },
  "project.letsTalk": { pl: "Porozmawiajmy", en: "Let's talk" },
} as const satisfies Record<string, { pl: string; en: string }>;
