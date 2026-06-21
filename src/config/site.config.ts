/**
 * ============================================================================
 *  ALL-IN-ONE BIO PAGE CONFIG
 *  Edit everything about your bio site here. No need to touch other files.
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
  | "link";

export interface SocialLink {
  icon: SocialIcon;
  label: string;
  href: string;
}

export interface SiteConfig {
  // ---------- Page metadata (browser tab + sharing) ----------
  meta: {
    title: string;        // browser tab title
    description: string;  // og description
    favicon?: string;     // url or /path
  };

  // ---------- Splash / "click to enter" overlay ----------
  splash: {
    enabled: boolean;
    text: string;        // big text on splash
    subtext: string;     // small text below
    buttonText: string;  // hint text
  };

  // ---------- Background ----------
  background: {
    // either "video" or "image"
    type: "video" | "image";
    videoUrl?: string;   // mp4 url, used if type="video"
    posterUrl?: string;  // fallback image while video loads
    imageUrl?: string;   // used if type="image"
    overlayOpacity: number; // 0..1 dark overlay strength
  };

  // ---------- Profile card ----------
  profile: {
    avatarUrl: string;       // square image, will be circled
    displayName: string;     // big name at top
    username: string;        // shown as @username
    bio: string;             // short bio / description
    badges?: string[];       // optional small badge labels (e.g. "developer", "17 y/o")
    location?: string;       // optional location text
  };

  // ---------- Social / link buttons ----------
  socials: SocialLink[];

  // ---------- Background music ----------
  music: {
    enabled: boolean;
    src?: string;            // mp3/ogg url
    title?: string;          // song title
    artist?: string;         // artist name
    coverUrl?: string;       // album art
    autoplay: boolean;
    initialVolume: number;   // 0..1
    loop: boolean;
  };

  // ---------- Theme (dark-blue defaults match the inspiration) ----------
  theme: {
    accent: string;        // primary accent color (hex)
    accent2: string;       // secondary accent color (hex)
    cardBg: string;        // rgba/hex for the glass card
    cardBorder: string;    // border for the glass card
    textPrimary: string;
    textMuted: string;
  };

  // ---------- Effects ----------
  effects: {
    tiltOnMouse: boolean;     // card tilts as you move the mouse
    showViewCounter: boolean; // simple local view counter
    typewriterBio: boolean;   // type the bio out
    rainParticles: boolean;   // subtle floating particles
  };
}

// ============================================================================
//  YOUR CONFIG  ←  EDIT EVERYTHING BELOW
// ============================================================================

export const siteConfig: SiteConfig = {
  meta: {
    title: "@yourname",
    description: "my little corner of the internet",
    favicon: "/favicon.ico",
  },

  splash: {
    enabled: true,
    text: "click to enter",
    subtext: "loud music at start, be aware",
    buttonText: "click anywhere",
  },

  background: {
    type: "video",
    videoUrl:
      "https://cdn.pixabay.com/video/2023/10/26/186026-878853431_large.mp4",
    posterUrl:
      "https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=1920&q=80",
    imageUrl:
      "https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=1920&q=80",
    overlayOpacity: 0.55,
  },

  profile: {
    avatarUrl:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop&q=80",
    displayName: "your name",
    username: "yourname",
    bio: "just a person who loves the night sky.",
    badges: ["developer", "designer"],
    location: "somewhere on earth",
  },

  socials: [
    { icon: "discord", label: "discord", href: "https://discord.com/users/000" },
    { icon: "twitter", label: "twitter", href: "https://twitter.com/yourname" },
    { icon: "instagram", label: "instagram", href: "https://instagram.com/yourname" },
    { icon: "github", label: "github", href: "https://github.com/yourname" },
    { icon: "spotify", label: "spotify", href: "https://open.spotify.com/user/yourname" },
    { icon: "email", label: "email", href: "mailto:hi@example.com" },
  ],

  music: {
    enabled: true,
    src: "https://cdn.pixabay.com/audio/2023/10/30/audio_67c3a17e8d.mp3",
    title: "midnight blue",
    artist: "ambient",
    coverUrl:
      "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=200&h=200&fit=crop&q=80",
    autoplay: true,
    initialVolume: 0.5,
    loop: true,
  },

  theme: {
    accent: "#4361ee",
    accent2: "#3651d4",
    cardBg: "rgba(10, 12, 22, 0.55)",
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
