
export type PortfolioData = {
  profile: { name: string; headline: string; bio: string; image?: string; availability?: string };
  skills: Array<{ name: string; level?: number }>;
  projects: Array<{ id: string; title: string; description: string; image?: string; url?: string; tags?: string[] }>;
  videos: Array<{ id: string; title: string; youtubeId: string; thumbnail?: string }>;
  gallery: Array<{ id: string; image: string; caption?: string }>;
  socialLinks: Array<{ label: string; url: string }>;
  contact: { email?: string; whatsapp?: string; location?: string };
  settings: { availability?: string; theme?: string };
};

export const fallbackData: PortfolioData = {
  profile: { name: "MA LEGEND", headline: "Digital creator · Full-stack developer · Builder", bio: "I turn ambitious ideas into polished digital experiences. From web platforms and Android tools to APIs and immersive interfaces, I build with curiosity, precision and a little bit of LEGEND energy.", image: "", availability: "Available for select projects" },
  skills: ["Full-Stack Web Development", "Android APK Development", "REST APIs & AI Bots", "3D Crystal UI/UX", "PHP & Cloud Database", "Digital Content Creation"].map(name => ({ name, level: 88 })),
  projects: [
    { id: "legendlink", title: "LEGEND LINK", description: "A clean link management experience built for fast sharing and private user workspaces.", tags: ["PHP", "MySQL", "Web App"], url: "#contact" },
    { id: "toolkit", title: "HINA TOOLKIT", description: "A mobile-first toolkit concept with Firebase-powered accounts, rewards and admin-managed content.", tags: ["Android", "Firebase", "Kotlin"] },
    { id: "crystal-ui", title: "CRYSTAL INTERFACE", description: "An experimental visual system exploring depth, refractive glass and expressive motion.", tags: ["UI/UX", "Motion", "Design"] }
  ],
  videos: [], gallery: [],
  socialLinks: [{ label: "YouTube", url: "https://www.youtube.com/@legendmod407" }, { label: "WhatsApp Channel", url: "https://whatsapp.com/channel/0029VarS46O3QxRtTZO0z60x" }],
  contact: { email: "", whatsapp: "", location: "Pakistan" }, settings: { availability: "Available for select projects", theme: "dark" }
};

export async function getPortfolioData(): Promise<PortfolioData> {
  const databaseURL = process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL;
  if (!databaseURL) return fallbackData;
  try {
    // Public RTDB content is fetched over its REST endpoint, keeping browser Auth out of the server render.
    const response = await fetch(`${databaseURL.replace(/\/$/, "")}/site.json`, { cache: "no-store", signal: AbortSignal.timeout(4500) });
    if (!response.ok) return fallbackData;
    const remote = await response.json() as Partial<PortfolioData> | null;
    if (!remote) return fallbackData;
    const asArray = <T,>(value: unknown): T[] => Array.isArray(value) ? value : value && typeof value === "object" ? Object.entries(value).map(([id, item]) => ({ id, ...(item as object) } as T)) : [];
    return { ...fallbackData, ...remote, profile: { ...fallbackData.profile, ...(remote.profile ?? {}) }, contact: { ...fallbackData.contact, ...(remote.contact ?? {}) }, settings: { ...fallbackData.settings, ...(remote.settings ?? {}) }, skills: asArray<PortfolioData["skills"][number]>(remote.skills).length ? asArray<PortfolioData["skills"][number]>(remote.skills) : fallbackData.skills, projects: asArray<PortfolioData["projects"][number]>(remote.projects), videos: asArray<PortfolioData["videos"][number]>(remote.videos), gallery: asArray<PortfolioData["gallery"][number]>(remote.gallery), socialLinks: asArray<PortfolioData["socialLinks"][number]>(remote.socialLinks).length ? asArray<PortfolioData["socialLinks"][number]>(remote.socialLinks) : fallbackData.socialLinks };
  } catch (error) {
    console.error("Portfolio data unavailable; using local fallback.", error);
    return fallbackData;
  }
}
