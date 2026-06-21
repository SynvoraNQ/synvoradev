import { useEffect, useMemo, useRef, useState } from "react";
import { Volume2, VolumeX, Play, MapPin, Eye, Sparkles } from "lucide-react";
import { siteConfig } from "@/config/site.config";
import { SocialIcon } from "./SocialIcon";

// ---- minimal YT IFrame API typing ----
declare global {
  interface Window {
    YT?: any;
    onYouTubeIframeAPIReady?: () => void;
  }
}

let ytApiPromise: Promise<void> | null = null;
function loadYouTubeApi(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.YT && window.YT.Player) return Promise.resolve();
  if (ytApiPromise) return ytApiPromise;
  ytApiPromise = new Promise<void>((resolve) => {
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(tag);
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      prev?.();
      resolve();
    };
  });
  return ytApiPromise;
}

export function BioPage() {
  const cfg = siteConfig;
  const [entered, setEntered] = useState(!cfg.splash.enabled);
  const [muted, setMuted] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(cfg.music.initialVolume);
  const [views, setViews] = useState(0);
  const [mouse, setMouse] = useState({ x: 50, y: 50 });

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const ytPlayerRef = useRef<any>(null);
  const ytHostRef = useRef<HTMLDivElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);

  const useYTMusic = cfg.music.enabled && cfg.music.source === "youtube" && !!cfg.music.youtubeId;
  const useFileMusic = cfg.music.enabled && cfg.music.source === "file" && !!cfg.music.src;

  // view counter
  useEffect(() => {
    if (!cfg.effects.showViewCounter) return;
    try {
      const k = "bio_views";
      const n = Number(localStorage.getItem(k) ?? "0") + 1;
      localStorage.setItem(k, String(n));
      setViews(n);
    } catch { /* ignore */ }
  }, [cfg.effects.showViewCounter]);

  // init YT music player
  useEffect(() => {
    if (!useYTMusic || !ytHostRef.current) return;
    let cancelled = false;
    loadYouTubeApi().then(() => {
      if (cancelled || !ytHostRef.current) return;
      ytPlayerRef.current = new window.YT.Player(ytHostRef.current, {
        videoId: cfg.music.youtubeId,
        playerVars: {
          autoplay: 0,
          controls: 0,
          disablekb: 1,
          modestbranding: 1,
          playsinline: 1,
          loop: cfg.music.loop ? 1 : 0,
          playlist: cfg.music.loop ? cfg.music.youtubeId : undefined,
        },
        events: {
          onReady: (e: any) => {
            try {
              e.target.setVolume(Math.round(volume * 100));
            } catch { /* */ }
          },
          onStateChange: (e: any) => {
            if (!window.YT) return;
            if (e.data === window.YT.PlayerState.PLAYING) setPlaying(true);
            else if (
              e.data === window.YT.PlayerState.PAUSED ||
              e.data === window.YT.PlayerState.ENDED
            ) setPlaying(false);
          },
        },
      });
    });
    return () => {
      cancelled = true;
      try { ytPlayerRef.current?.destroy?.(); } catch { /* */ }
      ytPlayerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [useYTMusic]);

  const handleEnter = async () => {
    setEntered(true);
    if (useFileMusic && audioRef.current && cfg.music.autoplay) {
      audioRef.current.volume = volume;
      try { await audioRef.current.play(); setPlaying(true); } catch { /* */ }
    }
    if (useYTMusic && ytPlayerRef.current && cfg.music.autoplay) {
      try {
        ytPlayerRef.current.unMute?.();
        ytPlayerRef.current.setVolume?.(Math.round(volume * 100));
        ytPlayerRef.current.playVideo?.();
        setPlaying(true);
      } catch { /* */ }
    }
  };

  // mouse tilt + spotlight tracking
  useEffect(() => {
    if (!entered) return;
    const el = cardRef.current;
    const onMove = (e: MouseEvent) => {
      setMouse({ x: (e.clientX / window.innerWidth) * 100, y: (e.clientY / window.innerHeight) * 100 });
      if (cfg.effects.tiltOnMouse && el) {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = `perspective(1100px) rotateY(${x * 7}deg) rotateX(${-y * 7}deg)`;
      }
    };
    const onLeave = () => { if (el) el.style.transform = ""; };
    window.addEventListener("mousemove", onMove);
    if (el) el.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      if (el) el.removeEventListener("mouseleave", onLeave);
    };
  }, [entered, cfg.effects.tiltOnMouse]);

  // sync volume / mute
  useEffect(() => {
    const v = muted ? 0 : volume;
    if (audioRef.current) audioRef.current.volume = v;
    try {
      if (ytPlayerRef.current) {
        ytPlayerRef.current.setVolume?.(Math.round(v * 100));
        if (muted) ytPlayerRef.current.mute?.(); else ytPlayerRef.current.unMute?.();
      }
    } catch { /* */ }
  }, [volume, muted]);


  const particles = useMemo(
    () => Array.from({ length: 40 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 10,
      duration: 9 + Math.random() * 12,
      size: 1 + Math.random() * 2.5,
    })),
    [],
  );

  const ytBgSrc = cfg.background.type === "youtube" && cfg.background.youtubeId
    ? `https://www.youtube.com/embed/${cfg.background.youtubeId}?autoplay=1&mute=1&loop=1&playlist=${cfg.background.youtubeId}&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&iv_load_policy=3&disablekb=1`
    : null;

  return (
    <div
      className="relative h-screen w-screen overflow-hidden select-none"
      style={{
        ["--accent" as never]: cfg.theme.accent,
        ["--accent2" as never]: cfg.theme.accent2,
        ["--card-bg" as never]: cfg.theme.cardBg,
        ["--card-border" as never]: cfg.theme.cardBorder,
        ["--text" as never]: cfg.theme.textPrimary,
        ["--muted" as never]: cfg.theme.textMuted,
      }}
    >
      {/* Background: YouTube / video / image */}
      {ytBgSrc ? (
        <div className="absolute inset-0 overflow-hidden" style={{ zIndex: 0 }}>
          {/* Scaled iframe to hide black bars + controls */}
          <iframe
            src={ytBgSrc}
            title="background"
            allow="autoplay; encrypted-media"
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            style={{
              width: "max(177.78vh, 100vw)",
              height: "max(56.25vw, 100vh)",
              border: 0,
            }}
          />
        </div>
      ) : cfg.background.type === "video" && cfg.background.videoUrl ? (
        <video
          autoPlay muted loop playsInline preload="metadata"
          poster={cfg.background.posterUrl}
          className="absolute inset-0 h-full w-full object-cover scale-105"
          style={{ zIndex: 0, pointerEvents: "none", filter: "saturate(1.1)" }}
        >
          <source src={cfg.background.videoUrl} />
        </video>
      ) : (
        <div
          className="absolute inset-0 bg-cover bg-center scale-105"
          style={{ backgroundImage: `url(${cfg.background.imageUrl ?? cfg.background.posterUrl})`, zIndex: 0 }}
        />
      )}

      {/* Aurora conic glow */}
      {entered && (
        <div className="pointer-events-none absolute -inset-1/2 animate-aurora" style={{ zIndex: 1, opacity: 0.35 }}>
          <div
            className="h-full w-full"
            style={{
              background: `conic-gradient(from 0deg, transparent 0deg, ${cfg.theme.accent}55 90deg, transparent 180deg, ${cfg.theme.accent2}55 270deg, transparent 360deg)`,
              filter: "blur(80px)",
            }}
          />
        </div>
      )}

      {/* Drifting grid */}
      {entered && (
        <div className="pointer-events-none absolute inset-0 animate-grid" style={{ zIndex: 1, opacity: 0.5 }} />
      )}

      {/* Dark overlay tint (heavier per request) */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `linear-gradient(135deg, ${cfg.theme.accent}1f 0%, rgba(0,0,0,${cfg.background.overlayOpacity}) 50%, rgba(0,0,0,0.55) 100%)`,
          zIndex: 2,
        }}
      />
      {/* Extra vignette for darkness */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.55) 100%)",
          zIndex: 2,
        }}
      />

      {/* Mouse spotlight */}
      {entered && (
        <div
          className="pointer-events-none absolute inset-0 transition-opacity duration-500"
          style={{
            zIndex: 3,
            background: `radial-gradient(600px circle at ${mouse.x}% ${mouse.y}%, ${cfg.theme.accent}33, transparent 60%)`,
          }}
        />
      )}

      {/* Floating particles */}
      {cfg.effects.rainParticles && entered && (
        <div className="pointer-events-none absolute inset-0" style={{ zIndex: 3 }}>
          {particles.map(p => (
            <span
              key={p.id}
              className="absolute rounded-full bg-white/50 animate-float"
              style={{
                left: `${p.left}%`,
                bottom: -10,
                width: p.size,
                height: p.size,
                animationDelay: `${p.delay}s`,
                animationDuration: `${p.duration}s`,
                boxShadow: `0 0 6px ${cfg.theme.accent}`,
              }}
            />
          ))}
        </div>
      )}

      {/* File audio (only used when source="file") */}
      {useFileMusic && (
        <audio ref={audioRef} src={cfg.music.src} loop={cfg.music.loop} preload="auto" />
      )}

      {/* Hidden YouTube music host */}
      {useYTMusic && (
        <div
          aria-hidden
          style={{
            position: "absolute",
            width: 1,
            height: 1,
            opacity: 0,
            pointerEvents: "none",
            left: -9999,
            top: -9999,
          }}
        >
          <div ref={ytHostRef} />
        </div>
      )}

      {/* Splash */}
      {!entered && cfg.splash.enabled && (
        <button
          onClick={handleEnter}
          className="group absolute inset-0 flex flex-col items-center justify-center gap-4 backdrop-blur-md"
          style={{ zIndex: 50, background: "rgba(5,7,15,0.6)" }}
        >
          <div
            className="flex h-24 w-24 items-center justify-center rounded-full border animate-splash-pulse transition-transform duration-300 group-hover:scale-110"
            style={{
              borderColor: cfg.theme.cardBorder,
              background: cfg.theme.cardBg,
              boxShadow: `0 0 40px ${cfg.theme.accent}66, inset 0 0 20px ${cfg.theme.accent}22`,
            }}
          >
            <Play className="h-8 w-8 translate-x-0.5" style={{ color: "white" }} />
          </div>
          <p
            className="text-lg font-medium tracking-[0.2em] uppercase animate-gradient bg-clip-text text-transparent"
            style={{
              backgroundImage: `linear-gradient(90deg, ${cfg.theme.textPrimary}, ${cfg.theme.accent}, ${cfg.theme.textPrimary})`,
            }}
          >
            {cfg.splash.text}
          </p>
          <p className="text-sm" style={{ color: cfg.theme.textMuted }}>{cfg.splash.subtext}</p>
          <p className="mt-2 text-xs uppercase tracking-[0.3em]" style={{ color: cfg.theme.textMuted }}>
            {cfg.splash.buttonText}<span className="ml-1 animate-blink">_</span>
          </p>
        </button>
      )}

      {/* Volume control */}
      {entered && cfg.music.enabled && (
        <div
          className="absolute left-2 top-2 sm:left-4 sm:top-4 z-30 flex items-center gap-2 rounded-full border px-2.5 sm:px-3 py-1.5 sm:py-2 backdrop-blur-md transition-all duration-300 hover:scale-105 animate-rise"
          style={{
            background: cfg.theme.cardBg,
            borderColor: cfg.theme.cardBorder,
            animationDelay: "0.4s",
            boxShadow: `0 8px 24px rgba(0,0,0,0.4), 0 0 0 1px ${cfg.theme.accent}22`,
          }}
        >
          <button onClick={() => setMuted(m => !m)} aria-label="mute" className="transition-transform hover:scale-110 active:scale-95">
            {muted || volume === 0 ? (
              <VolumeX className="h-4 w-4" style={{ color: "white" }} />
            ) : (
              <Volume2 className="h-4 w-4" style={{ color: "white" }} />
            )}
          </button>
          <input
            type="range" min={0} max={1} step={0.01}
            value={muted ? 0 : volume}
            onChange={(e) => { setVolume(Number(e.target.value)); setMuted(false); }}
            className="h-1 w-16 sm:w-24 cursor-pointer accent-white"
          />
          <span className="w-9 text-right text-[11px] tabular-nums" style={{ color: cfg.theme.textMuted }}>
            {Math.round((muted ? 0 : volume) * 100)}%
          </span>
        </div>
      )}

      {/* View counter */}
      {entered && cfg.effects.showViewCounter && (
        <div
          className="absolute right-2 top-2 sm:right-4 sm:top-4 z-30 flex items-center gap-1.5 sm:gap-2 rounded-full border px-2.5 sm:px-3 py-1.5 sm:py-2 text-[10px] sm:text-xs backdrop-blur-md transition-all duration-300 hover:scale-105 animate-rise"
          style={{
            background: cfg.theme.cardBg,
            borderColor: cfg.theme.cardBorder,
            color: cfg.theme.textMuted,
            animationDelay: "0.5s",
          }}
        >
          <Eye className="h-3.5 w-3.5" />
          <span className="tabular-nums">{views.toLocaleString()} views</span>
        </div>
      )}

      {/* Main card */}
      {entered && (
        <main className="relative z-10 flex h-full w-full items-center justify-center px-4">
          <div className="animate-hover-float" style={{ willChange: "transform" }}>
            <div
              ref={cardRef}
              className="relative w-full max-w-md overflow-hidden rounded-3xl border p-8 backdrop-blur-2xl transition-transform duration-200 ease-out animate-fade-in"
              style={{
                background: cfg.theme.cardBg,
                borderColor: cfg.theme.cardBorder,
                boxShadow: `0 30px 80px rgba(0,0,0,0.6), 0 0 80px ${cfg.theme.accent}22, inset 0 0 0 1px ${cfg.theme.accent}11`,
              }}
            >
              {/* animated gradient ribbon */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-3xl animate-gradient"
                style={{
                  background: `linear-gradient(120deg, transparent 30%, ${cfg.theme.accent}33 50%, transparent 70%)`,
                  mixBlendMode: "screen",
                  opacity: 0.6,
                }}
              />

              {/* avatar + name */}
              <div className="relative flex flex-col items-center text-center">
                <div className="relative h-36 w-36">
                  {/* outer pulsing halo */}
                  <div
                    className="absolute -inset-3 rounded-full animate-pulse-glow"
                    style={{
                      background: `radial-gradient(circle, ${cfg.theme.accent}55 0%, transparent 70%)`,
                      filter: "blur(14px)",
                    }}
                  />
                  {/* rotating conic ring */}
                  <div
                    className="absolute -inset-1 rounded-full animate-spin-slow"
                    style={{
                      background: `conic-gradient(from 0deg, ${cfg.theme.accent}, ${cfg.theme.accent2}, transparent, ${cfg.theme.accent2}, ${cfg.theme.accent})`,
                      filter: "blur(2px)",
                    }}
                  />
                  {/* counter-rotating dotted ring */}
                  <div
                    className="absolute -inset-2 rounded-full animate-spin-reverse"
                    style={{
                      border: `1px dashed ${cfg.theme.accent}88`,
                      maskImage: "radial-gradient(circle, transparent 60%, black 62%)",
                      WebkitMaskImage: "radial-gradient(circle, transparent 60%, black 62%)",
                    }}
                  />
                  {/* dark backdrop */}
                  <div
                    className="absolute inset-0 rounded-full"
                    style={{ background: "#05060d" }}
                  />
                  {/* photo */}
                  <div
                    className="absolute inset-1 overflow-hidden rounded-full border-2 transition-transform duration-500 hover:scale-105"
                    style={{
                      borderColor: cfg.theme.accent,
                      boxShadow: `0 0 30px ${cfg.theme.accent}99, inset 0 0 20px ${cfg.theme.accent}33`,
                    }}
                  >
                    <img
                      src={cfg.profile.avatarUrl}
                      alt={cfg.profile.displayName}
                      className="h-full w-full object-cover transition-transform duration-700 hover:scale-110"
                      draggable={false}
                    />
                    {/* shine sweep */}
                    <div
                      aria-hidden
                      className="pointer-events-none absolute inset-0 animate-shine"
                      style={{
                        background: "linear-gradient(115deg, transparent 30%, rgba(255,255,255,0.25) 50%, transparent 70%)",
                      }}
                    />
                  </div>
                  {/* orbiting dot */}
                  <span
                    aria-hidden
                    className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 animate-orbit"
                    style={{
                      background: cfg.theme.accent,
                      borderRadius: 9999,
                      boxShadow: `0 0 12px ${cfg.theme.accent}, 0 0 24px ${cfg.theme.accent}88`,
                    }}
                  />
                </div>

                <h1
                  className="mt-6 animate-rise bg-clip-text text-2xl font-semibold tracking-tight text-transparent animate-gradient"
                  style={{
                    backgroundImage: `linear-gradient(90deg, ${cfg.theme.textPrimary}, ${cfg.theme.accent}, ${cfg.theme.textPrimary})`,
                    animationDelay: "0.2s",
                  }}
                >
                  {cfg.profile.displayName}
                </h1>
                <p
                  className="animate-rise text-sm"
                  style={{ color: cfg.theme.textMuted, animationDelay: "0.28s" }}
                >
                  @{cfg.profile.username}
                </p>

                {cfg.profile.badges && cfg.profile.badges.length > 0 && (
                  <div className="mt-3 flex flex-wrap justify-center gap-2">
                    {cfg.profile.badges.map((b, i) => (
                      <span
                        key={b}
                        className="animate-rise rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider transition-all duration-300 hover:scale-110 hover:-translate-y-0.5"
                        style={{
                          borderColor: cfg.theme.cardBorder,
                          background: `${cfg.theme.accent}22`,
                          color: cfg.theme.textPrimary,
                          animationDelay: `${0.35 + i * 0.06}s`,
                          boxShadow: `0 0 14px ${cfg.theme.accent}33`,
                        }}
                      >
                        <Sparkles className="mr-1 inline h-2.5 w-2.5" />
                        {b}
                      </span>
                    ))}
                  </div>
                )}

                <p
                  className="mt-4 animate-rise text-sm leading-relaxed"
                  style={{ color: cfg.theme.textPrimary, animationDelay: "0.45s" }}
                >
                  {cfg.profile.bio}
                </p>

                {cfg.profile.location && (
                  <div
                    className="mt-2 flex animate-rise items-center gap-1.5 text-xs"
                    style={{ color: cfg.theme.textMuted, animationDelay: "0.52s" }}
                  >
                    <MapPin className="h-3 w-3" />
                    <span>{cfg.profile.location}</span>
                  </div>
                )}
              </div>

              {/* socials */}
              <div
                className="relative mt-6 grid gap-2"
                style={{ gridTemplateColumns: `repeat(${Math.min(cfg.socials.length, 4)}, minmax(0, 1fr))` }}
              >
                {cfg.socials.map((s, i) => (
                  <a
                    key={i}
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    className="shine-on-hover group/btn relative flex animate-rise items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-xs font-medium transition-all duration-300 hover:-translate-y-1 hover:scale-[1.04]"
                    style={{
                      background: "rgba(255,255,255,0.03)",
                      borderColor: cfg.theme.cardBorder,
                      color: cfg.theme.textPrimary,
                      animationDelay: `${0.6 + i * 0.05}s`,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = `0 10px 30px ${cfg.theme.accent}55, 0 0 0 1px ${cfg.theme.accent}88 inset`;
                      e.currentTarget.style.background = `${cfg.theme.accent}22`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = "";
                      e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                    }}
                  >
                    <SocialIcon
                      name={s.icon}
                      className="h-4 w-4 transition-transform duration-300 group-hover/btn:scale-125 group-hover/btn:rotate-6"
                    />
                    <span className="capitalize">{s.label}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </main>
      )}
    </div>
  );
}
