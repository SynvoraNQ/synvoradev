import { useEffect, useMemo, useRef, useState } from "react";
import { Volume2, VolumeX, Play, Pause, MapPin, Eye, Sparkles } from "lucide-react";
import { siteConfig } from "@/config/site.config";
import { SocialIcon } from "./SocialIcon";

export function BioPage() {
  const cfg = siteConfig;
  const [entered, setEntered] = useState(!cfg.splash.enabled);
  const [muted, setMuted] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(cfg.music.initialVolume);
  const [views, setViews] = useState(0);
  const [mouse, setMouse] = useState({ x: 50, y: 50 });
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!cfg.effects.showViewCounter) return;
    try {
      const k = "bio_views";
      const n = Number(localStorage.getItem(k) ?? "0") + 1;
      localStorage.setItem(k, String(n));
      setViews(n);
    } catch { /* ignore */ }
  }, [cfg.effects.showViewCounter]);

  const handleEnter = async () => {
    setEntered(true);
    if (videoRef.current) { try { await videoRef.current.play(); } catch { /* */ } }
    if (cfg.music.enabled && audioRef.current && cfg.music.autoplay) {
      audioRef.current.volume = volume;
      try { await audioRef.current.play(); setPlaying(true); } catch { /* */ }
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

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = muted ? 0 : volume;
  }, [volume, muted]);

  const togglePlay = async () => {
    if (!audioRef.current) return;
    if (playing) { audioRef.current.pause(); setPlaying(false); }
    else { try { await audioRef.current.play(); setPlaying(true); } catch { /* */ } }
  };

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
      {/* Background video / image */}
      {cfg.background.type === "video" && cfg.background.videoUrl ? (
        <video
          ref={videoRef}
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
          style={{ backgroundImage: `url(${cfg.background.imageUrl})`, zIndex: 0 }}
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

      {/* Dark overlay tint */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(135deg, ${cfg.theme.accent}1f 0%, rgba(0,0,0,${cfg.background.overlayOpacity}) 50%, #00000044 100%)`,
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

      {/* Audio */}
      {cfg.music.enabled && cfg.music.src && (
        <audio ref={audioRef} src={cfg.music.src} loop={cfg.music.loop} preload="auto" />
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
          className="absolute left-4 top-4 z-30 flex items-center gap-2 rounded-full border px-3 py-2 backdrop-blur-md transition-all duration-300 hover:scale-105 animate-rise"
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
            className="h-1 w-24 cursor-pointer accent-white"
          />
          <span className="w-9 text-right text-[11px] tabular-nums" style={{ color: cfg.theme.textMuted }}>
            {Math.round((muted ? 0 : volume) * 100)}%
          </span>
        </div>
      )}

      {/* View counter */}
      {entered && cfg.effects.showViewCounter && (
        <div
          className="absolute right-4 top-4 z-30 flex items-center gap-2 rounded-full border px-3 py-2 text-xs backdrop-blur-md transition-all duration-300 hover:scale-105 animate-rise"
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
                boxShadow: `0 30px 80px rgba(0,0,0,0.55), 0 0 80px ${cfg.theme.accent}22, inset 0 0 0 1px ${cfg.theme.accent}11`,
              }}
            >
              {/* animated gradient border ribbon */}
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
                <div className="relative h-32 w-32">
                  {/* rotating ring */}
                  <div
                    className="absolute inset-0 rounded-full animate-spin-slow"
                    style={{
                      background: `conic-gradient(from 0deg, ${cfg.theme.accent}, ${cfg.theme.accent2}, transparent, ${cfg.theme.accent})`,
                      filter: "blur(2px)",
                    }}
                  />
                  <div
                    className="absolute inset-1 rounded-full animate-pulse-glow"
                    style={{ background: "#05060d" }}
                  />
                  <div
                    className="absolute inset-2 overflow-hidden rounded-full border-2 transition-transform duration-500 hover:scale-105"
                    style={{ borderColor: cfg.theme.accent }}
                  >
                    <img
                      src={cfg.profile.avatarUrl}
                      alt={cfg.profile.displayName}
                      className="h-full w-full object-cover transition-transform duration-700 hover:scale-110"
                      draggable={false}
                    />
                  </div>
                </div>

                <h1
                  className="mt-5 animate-rise bg-clip-text text-2xl font-semibold tracking-tight text-transparent animate-gradient"
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
              <div className="relative mt-6 grid grid-cols-3 gap-2">
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

              {/* now playing */}
              {cfg.music.enabled && cfg.music.src && (
                <div
                  className="relative mt-6 flex animate-rise items-center gap-3 overflow-hidden rounded-2xl border p-3 transition-all duration-300 hover:scale-[1.02]"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    borderColor: cfg.theme.cardBorder,
                    animationDelay: "0.95s",
                    boxShadow: playing ? `0 0 30px ${cfg.theme.accent}33` : "none",
                  }}
                >
                  {cfg.music.coverUrl && (
                    <img
                      src={cfg.music.coverUrl}
                      alt=""
                      className={`h-11 w-11 rounded-lg object-cover transition-transform duration-700 ${playing ? "animate-spin-slow" : ""}`}
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

                  {/* equalizer */}
                  {playing && (
                    <div className="flex h-6 items-end gap-0.5">
                      {[0, 0.15, 0.3, 0.1].map((d, i) => (
                        <span
                          key={i}
                          className="eq-bar w-0.5 rounded-sm"
                          style={{ height: "100%", background: cfg.theme.accent, animationDelay: `${d}s` }}
                        />
                      ))}
                    </div>
                  )}

                  <button
                    onClick={togglePlay}
                    className="flex h-9 w-9 items-center justify-center rounded-full transition-all duration-300 hover:scale-110 active:scale-95"
                    style={{
                      background: cfg.theme.accent,
                      color: "white",
                      boxShadow: `0 0 20px ${cfg.theme.accent}88`,
                    }}
                    aria-label={playing ? "pause" : "play"}
                  >
                    {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 translate-x-0.5" />}
                  </button>
                </div>
              )}
            </div>
          </div>
        </main>
      )}
    </div>
  );
}
