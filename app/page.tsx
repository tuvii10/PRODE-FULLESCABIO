import Link from 'next/link';
import { Users, Star, Trophy, ChevronRight, Zap, Clock } from 'lucide-react';
import Logo from '@/components/ui/logo';

export default function LandingPage() {
  return (
    <main className="min-h-dvh flex flex-col" style={{ background: '#0a0a0a' }}>

      {/* ── FRANJA ARGENTINA top ── */}
      <div className="flex h-1.5 w-full">
        <div className="flex-1 bg-[#74ACDF]" />
        <div className="flex-1 bg-white/90" />
        <div className="flex-1 bg-[#74ACDF]" />
      </div>

      {/* ── NAV ── */}
      <nav className="flex items-center justify-between px-5 py-4 md:px-10 border-b border-[#1a1a1a]">
        <Logo width={150} />
        <Link href="/login" className="btn-secondary text-xs px-4 py-2">
          Iniciar sesión
        </Link>
      </nav>

      {/* ── HERO ── */}
      <section className="relative flex flex-1 flex-col items-center justify-center overflow-hidden px-5 py-10 text-center">

        {/* Decoraciones de fondo — pelota */}
        <img
          src="/ball.png" alt="" aria-hidden="true"
          className="pointer-events-none select-none absolute -right-10 -top-10 w-56 opacity-[0.06] rotate-12 md:w-80"
        />
        <img
          src="/ball.png" alt="" aria-hidden="true"
          className="pointer-events-none select-none absolute -left-12 bottom-12 w-44 opacity-[0.05] -rotate-6 md:w-64"
        />

        {/* Eyebrow */}
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#74ACDF]/40 bg-[#74ACDF]/10 px-4 py-1.5 text-xs font-bold text-[#74ACDF] uppercase tracking-wide">
          🇦🇷 Vamos Argentina · Mundial 2026 · ⭐⭐⭐
        </div>

        {/* Headline */}
        <h1 className="max-w-2xl text-4xl font-black leading-[1.0] tracking-tight text-white md:text-5xl uppercase">
          Jugá al Prode<br />
          y ganá un año de<br />
          <span className="text-[#3483fa]">Escabio Gratis</span>
        </h1>

        {/* Logo */}
        <div className="mt-7 mb-6 opacity-90">
          <Logo width={230} />
        </div>

        <p className="max-w-md text-sm text-slate-400 md:text-base leading-relaxed">
          Pronosticá los resultados, sumá puntos y competí contra todos
          por el <strong className="text-white">premio mayor</strong>.
        </p>

        {/* PRIZE CALLOUT */}
        <div className="relative mt-7 w-full max-w-sm rounded-2xl border-2 border-[#74ACDF]/50 bg-gradient-to-b from-[#74ACDF]/15 to-[#74ACDF]/5 px-6 py-5 text-center overflow-hidden">
          {/* Trofeo decorativo */}
          <img
            src="/trophy.png" alt="" aria-hidden="true"
            className="pointer-events-none select-none absolute -right-4 -bottom-2 h-24 opacity-20"
          />
          <p className="text-[11px] font-bold text-[#74ACDF] uppercase tracking-[0.2em] mb-2">
            🏆 Premio · 1° puesto del ranking
          </p>
          <p className="text-3xl font-black text-white uppercase leading-tight">
            1 Año de<br />Escabio Gratis
          </p>
          <p className="mt-2 text-xs text-slate-500">
            Cortesía de Fullescabio Almacén de Bebidas 🍾
          </p>
        </div>

        {/* CTAs */}
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
          <Link href="/login" className="btn-primary text-base px-8 py-3.5 w-full sm:w-auto">
            Participar ahora
            <ChevronRight size={18} />
          </Link>
          <Link href="/ranking" className="btn-secondary text-base px-8 py-3.5 w-full sm:w-auto">
            Ver ranking 🇦🇷
          </Link>
        </div>

        {/* Stats */}
        <div className="mt-14 grid grid-cols-3 gap-6 text-center">
          {[
            { icon: Users,  label: 'Participantes', value: '—'   },
            { icon: Star,   label: 'Partidos',       value: '104' },
            { icon: Trophy, label: 'Premio',          value: '🍾'  },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex flex-col items-center gap-1">
              <Icon size={18} className="text-[#3483fa]/60 mb-1" />
              <span className="text-2xl font-black text-white">{value}</span>
              <span className="text-xs text-slate-600">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── BANNER ARGENTINA ── */}
      <section
        className="border-y border-[#74ACDF]/20 px-5 py-6 text-center relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, rgba(116,172,223,0.08) 0%, rgba(116,172,223,0.03) 100%)' }}
      >
        <img
          src="/ball.png" alt="" aria-hidden="true"
          className="pointer-events-none select-none absolute right-6 top-1/2 -translate-y-1/2 w-16 opacity-10 rotate-45"
        />
        <p className="text-xl font-black text-white">
          🇦🇷 ¡Vamos Argentina! 🇦🇷
        </p>
        <p className="mt-1 text-sm text-[#74ACDF]/70">
          Tres estrellas, un sueño — la <strong className="text-[#74ACDF]">Scaloneta</strong> va por más en 2026
        </p>
      </section>

      {/* ── CÓMO FUNCIONA ── */}
      <section className="relative border-t border-[#1a1a1a] bg-[#111] px-5 py-14 md:px-10 overflow-hidden">
        <img
          src="/trophy.png" alt="" aria-hidden="true"
          className="pointer-events-none select-none absolute right-0 top-0 h-full max-h-64 opacity-[0.04]"
        />
        <h2 className="mb-1 text-center text-xl font-black text-white uppercase tracking-wide">
          ¿Cómo se juega?
        </h2>
        <p className="mb-8 text-center text-sm text-slate-600">Fácil, rápido y sin vueltas</p>
        <div className="mx-auto grid max-w-3xl gap-4 md:grid-cols-3">
          {[
            {
              icon: Zap,
              step: '01',
              title: 'Registrate',
              desc: 'Ingresás tu email y confirmás con el link que te enviamos. Gratis, sin contraseña, una sola cuenta por persona.',
            },
            {
              icon: Clock,
              step: '02',
              title: 'Cargá tus pronósticos',
              desc: 'Ingresá el marcador que le ves a cada partido antes del pitazo inicial. Podés editar hasta que arranque.',
            },
            {
              icon: Trophy,
              step: '03',
              title: '¡Ganá el escabio!',
              desc: '3 puntos por resultado exacto, 1 punto por acertar el ganador o empate. El mejor puntaje al final del torneo se lleva el premio.',
            },
          ].map(({ icon: Icon, step, title, desc }) => (
            <div key={step} className="rounded-xl border border-[#2a2a2a] bg-[#141414] p-5">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl font-black text-[#3483fa]/20 leading-none">{step}</span>
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#3483fa]/10 text-[#3483fa]">
                  <Icon size={18} />
                </div>
              </div>
              <h3 className="font-bold text-white mb-1">{title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── PUNTUACIÓN ── */}
      <section className="relative px-5 py-14 md:px-10 overflow-hidden">
        <img
          src="/ball.png" alt="" aria-hidden="true"
          className="pointer-events-none select-none absolute left-0 top-1/2 -translate-y-1/2 w-48 opacity-[0.04] -rotate-12"
        />
        <h2 className="mb-1 text-center text-xl font-black text-white uppercase tracking-wide">
          Sistema de puntaje
        </h2>
        <p className="mb-6 text-center text-sm text-slate-600">Sin trampa ni cartón</p>
        <div className="mx-auto max-w-sm space-y-2">
          {[
            { pts: '3 pts', label: '⚽ Resultado exacto',             color: 'text-white',     bg: 'bg-[#3483fa]/10 border-[#3483fa]/30' },
            { pts: '1 pt',  label: '👌 Ganador o empate correcto',    color: 'text-[#3483fa]', bg: 'bg-[#3483fa]/05 border-[#3483fa]/15' },
            { pts: '0 pts', label: '😬 Ni cerca, amigo',              color: 'text-slate-600', bg: 'bg-white/[0.02] border-white/5'      },
          ].map(({ pts, label, color, bg }) => (
            <div key={pts} className={`flex items-center justify-between rounded-lg border px-5 py-3 ${bg}`}>
              <span className="text-sm text-slate-300">{label}</span>
              <span className={`text-base font-black ${color}`}>{pts}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA BOTTOM ── */}
      <section className="relative border-t border-[#1a1a1a] bg-[#111] px-5 py-14 text-center overflow-hidden">
        <img
          src="/ball.png" alt="" aria-hidden="true"
          className="pointer-events-none select-none absolute -left-8 -bottom-8 w-40 opacity-[0.06] rotate-45"
        />
        <img
          src="/trophy.png" alt="" aria-hidden="true"
          className="pointer-events-none select-none absolute -right-4 -bottom-4 h-40 opacity-[0.06]"
        />
        <Logo width={160} className="mx-auto mb-5 opacity-80" />
        <h2 className="text-xl font-black text-white uppercase">¿Te animás o te rajás?</h2>
        <p className="mt-2 text-sm text-slate-500">
          Anotate gratis y seguí el ranking en tiempo real. El escabio no se espera.
        </p>
        <Link href="/login" className="btn-primary mt-6 inline-flex text-base px-8 py-3.5">
          Quiero el escabio 🍾
          <ChevronRight size={18} />
        </Link>
        <p className="mt-4 text-xs text-slate-700">
          🇦🇷 &nbsp;Vamos Argentina · 104 partidos · 1 campeón
        </p>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-[#1a1a1a] px-5 py-5 text-center text-xs text-slate-700">
        © 2026 Fullescabio Almacén de Bebidas · Prode Mundial 2026 🇦🇷
      </footer>

      {/* ── FRANJA ARGENTINA bottom ── */}
      <div className="flex h-1.5 w-full">
        <div className="flex-1 bg-[#74ACDF]" />
        <div className="flex-1 bg-white/90" />
        <div className="flex-1 bg-[#74ACDF]" />
      </div>

    </main>
  );
}
