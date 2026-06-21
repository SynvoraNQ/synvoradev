import { useEffect, useMemo, useRef, useState } from "react";
import { Volume2, VolumeX, Play, Pause, MapPin, Eye } from "lucide-react";
import { siteConfig } from "@/config/site.config";
import { SocialIcon } from "./SocialIcon";

export function BioPage() {
  const cfg = siteConfig;
  const [entered, setEntered] = useState(!cfg.splash.enabled);
  const [muted, setMuted] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(cfg.music.initialVolume);
  const [views, setViews] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);

  // view counter (local, just for vibe)
  useEffect(() => {
    if (!cfg.effects.showViewCounter) return;
    try {
      const k = "bio_views";
      const n = Number(localStorage.getItem(k) ?? "0") + 1;
      localStorage.setItem(k, String(n));
      setViews(n);
    } catch { /* ignore */ }
  }, [cfg.effects.showViewCounter]);

  // start audio + video when user enters
  const handleEnter = async () => {
    setEntered(true);
    if (videoRef.current) {
      try { await videoRef.current.play(); } catch { /* autoplay can fail */ }
    }
    if (cfg.music.enabled && audioRef.current && cfg.music.autoplay) {
      audioRef.current.volume = volume;
      try {
        await audioRef.current.play();
        setPlaying(true);
      } catch { /* ignore */ }
    }
  };

  // mouse tilt
  useEffect(() => {
    if (!cfg.effects.tiltOnMouse || !entered) return;
    const el = cardRef.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      el.style.transform = `perspective(1000px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg)`;
    };
    const onLeave = () => { el.style.transform = ""; };
    window.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [entered, cfg.effects.tiltOnMouse]);

  // sync volume / mute
  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = muted ? 0 : volume;
  }, [volume, muted]);

  const togglePlay = async () => {
    if (!audioRef.current) return;
    if (playing) { audioRef.current.pause(); setPlaying(false); }
    else { try { await audioRef.current.play(); setPlaying(true); } catch { /* ignore */ } }
  };

  const particles = useMemo(
    () => Array.from({ length: 30 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 8,
      duration: 8 + Math.random() * 10,
      size: 1 + Math.random() * 2,
    })),
    [],
  );

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
      {/* Background */}
      {cfg.background.type === "video" && cfg.background.videoUrl ? (
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={cfg.background.posterUrl}
          className="absolute inset-0 h-full w-full object-cover"
          style={{ zIndex: 0, pointerEvents: "none" }}
        >
          <source src={cfg.background.videoUrl} />
        </video>
      ) : (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${cfg.background.imageUrl})`, zIndex: 0 }}
        />
      )}

      {/* Dark overlay + blue tint */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(135deg, ${cfg.theme.accent}1f 0%, rgba(0,0,0,${cfg.background.overlayOpacity}) 50%, #00000033 100%)`,
          zIndex: 1,
        }}
      />

      {/* Floating particles */}
      {cfg.effects.rainParticles && entered && (
        <div className="pointer-events-none absolute inset-0" style={{ zIndex: 2 }}>
          {particles.map(p => (
            <span
              key={p.id}
              className="absolute rounded-full bg-white/40 animate-float"
              style={{
                left: `${p.left}%`,
                bottom: -10,
                width: p.size,
                height: p.size,
                animationDelay: `${p.delay}s`,
                animationDuration: `${p.duration}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Audio */}
      {cfg.music.enabled && cfg.music.src && (
        <audio ref={audioRef} src={cfg.music.src} loop={cfg.music.loop} preload="auto" />
      )}

      {/* Splash */}
      {!entered && cfg.splash.enabled && (
        <button
          onClick={handleEnter}
          className="absolute inset-0 flex flex-col items-center justify-center gap-3 backdrop-blur-md transition-opacity"
          style={{ zIndex: 50, background: "rgba(5,7,15,0.55)" }}
        >
          <div
            className="flex h-20 w-20 items-center justify-center rounded-full border"
            style={{ borderColor: cfg.theme.cardBorder, background: cfg.theme.cardBg }}
          >
            <Play className="h-7 w-7 text-white" />
          </div>
          <p className="text-lg font-medium tracking-wide" style={{ color: cfg.theme.textPrimary }}>
            {cfg.splash.text}
          </p>
          <p className="text-sm" style={{ color: cfg.theme.textMuted }}>{cfg.splash.subtext}</p>
          <p className="mt-2 text-xs uppercase tracking-[0.3em]" style={{ color: cfg.theme.textMuted }}>
            {cfg.splash.buttonText}
          </p>
        </button>
      )}

      {/* Volume / mute */}
      {entered && cfg.music.enabled && (
        <div
          className="absolute left-4 top-4 z-30 flex items-center gap-2 rounded-full border px-3 py-2 backdrop-blur-md"
          style={{ background: cfg.theme.cardBg, borderColor: cfg.theme.cardBorder }}
        >
          <button onClick={() => setMuted(m => !m)} aria-label="mute">
            {muted || volume === 0 ? (
              <VolumeX className="h-4 w-4 text-white" />
            ) : (
              <Volume2 className="h-4 w-4 text-white" />
            )}
          </button>
          <input
            type="range" min={0} max={1} step={0.01}
            value={muted ? 0 : volume}
            onChange={(e) => { setVolume(Number(e.target.value)); setMuted(false); }}
            className="h-1 w-24 cursor-pointer accent-white"
          />
          <span className="w-9 text-right text-[11px]" style={{ color: cfg.theme.textMuted }}>
            {Math.round((muted ? 0 : volume) * 100)}%
          </span>
        </div>
      )}

      {/* View counter */}
      {entered && cfg.effects.showViewCounter && (
        <div
          className="absolute right-4 top-4 z-30 flex items-center gap-2 rounded-full border px-3 py-2 text-xs backdrop-blur-md"
          style={{ background: cfg.theme.cardBg, borderColor: cfg.theme.cardBorder, color: cfg.theme.textMuted }}
        >
          <Eye className="h-3.5 w-3.5" />
          <span>{views.toLocaleString()} views</span>
        </div>
      )}

      {/* Main card */}
      {entered && (
        <main className="relative z-10 flex h-full w-full items-center justify-center px-4">
          <div
            ref={cardRef}
            className="w-full max-w-md rounded-3xl border p-8 shadow-2xl backdrop-blur-xl transition-transform duration-200 ease-out animate-fade-in"
            style={{
              background: cfg.theme.cardBg,
              borderColor: cfg.theme.cardBorder,
              boxShadow: `0 30px 80px rgba(0,0,0,0.55), 0 0 60px ${cfg.theme.accent}33`,
            }}
          >
            {/* avatar + name */}
            <div className="flex flex-col items-center text-center">
              <div
                className="relative h-28 w-28 overflow-hidden rounded-full border-2"
                style={{ borderColor: cfg.theme.accent, boxShadow: `0 0 30px ${cfg.theme.accent}66` }}
              >
                <img
                  src={cfg.profile.avatarUrl}
                  alt={cfg.profile.displayName}
                  className="h-full w-full object-cover"
                  draggable={false}
                />
              </div>
              <h1 className="mt-4 text-2xl font-semibold tracking-tight" style={{ color: cfg.theme.textPrimary }}>
                {cfg.profile.displayName}
              </h1>
              <p className="text-sm" style={{ color: cfg.theme.textMuted }}>@{cfg.profile.username}</p>

              {cfg.profile.badges && cfg.profile.badges.length > 0 && (
                <div className="mt-3 flex flex-wrap justify-center gap-2">
                  {cfg.profile.badges.map(b => (
                    <span
                      key={b}
                      className="rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
                      style={{
                        borderColor: cfg.theme.cardBorder,
                        background: `${cfg.theme.accent}22`,
                        color: cfg.theme.textPrimary,
                      }}
                    >
                      {b}
                    </span>
                  ))}
                </div>
              )}

              <p className="mt-4 text-sm leading-relaxed" style={{ color: cfg.theme.textPrimary }}>
                {cfg.profile.bio}
              </p>

              {cfg.profile.location && (
                <div className="mt-2 flex items-center gap-1.5 text-xs" style={{ color: cfg.theme.textMuted }}>
                  <MapPin className="h-3 w-3" />
                  <span>{cfg.profile.location}</span>
                </div>
              )}
            </div>

            {/* socials */}
            <div className="mt-6 grid grid-cols-3 gap-2">
              {cfg.socials.map((s, i) => (
                <a
                  key={i}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-xs font-medium transition-all hover:scale-[1.03]"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    borderColor: cfg.theme.cardBorder,
                    color: cfg.theme.textPrimary,
                  }}
                >
                  <SocialIcon name={s.icon} className="h-4 w-4" />
                  <span className="capitalize">{s.label}</span>
                </a>
              ))}
            </div>

            {/* now playing */}
            {cfg.music.enabled && cfg.music.src && (
              <div
                className="mt-6 flex items-center gap-3 rounded-2xl border p-3"
                style={{ background: "rgba(255,255,255,0.03)", borderColor: cfg.theme.cardBorder }}
              >
                {cfg.music.coverUrl && (
                  <img
                    src={cfg.music.coverUrl}
                    alt=""
                    className="h-11 w-11 rounded-lg object-cover"
                    draggable={false}
                  />
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium" style={{ color: cfg.theme.textPrimary }}>
                    {cfg.music.title ?? "now playing"}
                  </p>
                  <p className="truncate text-xs" style={{ color: cfg.theme.textMuted }}>
                    {cfg.music.artist ?? ""}
                  </p>
                </div>
                <button
                  onClick={togglePlay}
                  className="flex h-9 w-9 items-center justify-center rounded-full"
                  style={{ background: cfg.theme.accent, color: "white" }}
                  aria-label={playing ? "pause" : "play"}
                >
                  {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </button>
              </div>
            )}
          </div>
        </main>
      )}
    </div>
  );
}
