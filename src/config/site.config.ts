/**
 * ============================================================================
 *  ALL-IN-ONE BIO PAGE CONFIG
 *  Edit everything here. Nothing else needs to change.
 * ============================================================================
 */

export type SocialIcon =
  | "discord"
  | "twitter"
  | "instagram"
  | "github"
  | "youtube"
  | "tiktok"
  | "twitch"
  | "spotify"
  | "telegram"
  | "email"
  | "globe"
  | "steam"
  | "link";

export interface SocialLink {
  icon: SocialIcon;
  label: string;
  href: string;
}

export interface SiteConfig {
  meta: { title: string; description: string; favicon?: string };

  splash: { enabled: boolean; text: string; subtext: string; buttonText: string };

  background: {
    /** "video" = mp4, "image" = static, "youtube" = YouTube video as background */
    type: "video" | "image" | "youtube";
    videoUrl?: string;
    posterUrl?: string;
    imageUrl?: string;
    /** YouTube video ID (the part after v=) — used when type="youtube" */
    youtubeId?: string;
    overlayOpacity: number;
  };

  profile: {
    avatarUrl: string;
    displayName: string;
    username: string;
    bio: string;
    badges?: string[];
    location?: string;
  };

  socials: SocialLink[];

  music: {
    enabled: boolean;
    /** "file" plays an mp3/ogg src; "youtube" plays the audio of a YouTube video */
    source: "file" | "youtube";
    src?: string;
    /** YouTube video ID — used when source="youtube" */
    youtubeId?: string;
    title?: string;
    artist?: string;
    coverUrl?: string;
    autoplay: boolean;
    initialVolume: number;
    loop: boolean;
  };

  theme: {
    accent: string;
    accent2: string;
    cardBg: string;
    cardBorder: string;
    textPrimary: string;
    textMuted: string;
  };

  effects: {
    tiltOnMouse: boolean;
    showViewCounter: boolean;
    typewriterBio: boolean;
    rainParticles: boolean;
  };
}

// ============================================================================
//  YOUR CONFIG  ←  EDIT EVERYTHING BELOW
// ============================================================================

export const siteConfig: SiteConfig = {
  meta: {
    title: "@synvora",
    description: "Some names are meant to stay in the source code.",
    favicon: "/favicon.ico",
  },

  splash: {
    enabled: true,
    text: "click to enter",
    subtext: "audio plays on entry",
    buttonText: "click anywhere",
  },

  background: {
    type: "youtube",
    youtubeId: "AMxlkS-VX-4",
    posterUrl:
      "https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=1920&q=80",
    overlayOpacity: 0.7,
  },

  profile: {
    avatarUrl:
      "https://cdn.discordapp.com/attachments/907961537677901854/1518195224877334659/IMG_6051.png?ex=6a3908fc&is=6a37b77c&hm=51ac12c7ff7bd2e3cef9c7da566594b9f987a4ad0810f872f4e9ab739085c76e",
    displayName: "Synvora",
    username: "synvora",
    bio: "Some names are meant to stay in the source code.",
    badges: ["developer", "trader"],
  },

  socials: [
    { icon: "discord", label: "discord", href: "https://discord.com/users/000" },
    { icon: "steam", label: "steam", href: "https://steamcommunity.com/id/synvora" },
    { icon: "github", label: "github", href: "https://github.com/synvora" },
    { icon: "email", label: "email", href: "mailto:hi@example.com" },
  ],

  music: {
    enabled: true,
    source: "youtube",
    youtubeId: "W-hwLlqwiKI",
    title: "Люби меня",
    artist: "Miyagi",
    coverUrl: "https://i.ytimg.com/vi/W-hwLlqwiKI/hqdefault.jpg",
    autoplay: true,
    initialVolume: 0.5,
    loop: true,
  },

  theme: {
    accent: "#4361ee",
    accent2: "#3651d4",
    cardBg: "rgba(8, 10, 18, 0.65)",
    cardBorder: "rgba(67, 97, 238, 0.35)",
    textPrimary: "rgba(255,255,255,0.95)",
    textMuted: "rgba(255,255,255,0.55)",
  },

  effects: {
    tiltOnMouse: true,
    showViewCounter: true,
    typewriterBio: false,
    rainParticles: true,
  },
};
