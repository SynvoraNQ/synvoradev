import {
  MessageCircle,
  Twitter,
  Instagram,
  Github,
  Youtube,
  Twitch,
  Music2,
  Send,
  Mail,
  Globe,
  Gamepad2,
  Link as LinkIcon,
} from "lucide-react";
import type { SocialIcon as SocialIconName } from "@/config/site.config";

export function SocialIcon({ name, className }: { name: SocialIconName; className?: string }) {
  const props = { className: className ?? "h-5 w-5", strokeWidth: 1.8 };
  switch (name) {
    case "discord": return <MessageCircle {...props} />;
    case "twitter": return <Twitter {...props} />;
    case "instagram": return <Instagram {...props} />;
    case "github": return <Github {...props} />;
    case "youtube": return <Youtube {...props} />;
    case "tiktok": return <Music2 {...props} />;
    case "twitch": return <Twitch {...props} />;
    case "spotify": return <Music2 {...props} />;
    case "telegram": return <Send {...props} />;
    case "email": return <Mail {...props} />;
    case "globe": return <Globe {...props} />;
    case "steam": return <Gamepad2 {...props} />;
    default: return <LinkIcon {...props} />;
  }
}
