import {
  SiAppstore,
  SiClaudecode,
  SiExpo,
  SiFigma,
  SiGit,
  SiGithub,
  SiJavascript,
  SiJest,
  SiNextdotjs,
  SiReact,
  SiReactquery,
  SiRevenuecat,
  SiRedux,
  SiStripe,
  SiSupabase,
  SiSwift,
  SiTailwindcss,
  SiTypescript,
  SiUikit,
  SiXcode,
} from "react-icons/si";
// Fuera de Simple Icons (`si`) solo lo que ese set no tiene: Simple Icons sacó
// el logo de OpenAI (Codex) por pedido de la marca, y "Push" no es una marca
// sino una función, así que va con un ícono genérico de notificación.
import { RiNotification3Fill, RiOpenaiFill } from "react-icons/ri";

// Data del stack por área, definida UNA sola vez (ver tarea: la grilla de
// StackSection y la franja del hero, HeroStackStrip, comparten estos mismos
// nombres/iconos en vez de mantener dos listas que se puedan desincronizar).
//
// Los NOMBRES de tecnología no se traducen (son nombres propios: "Swift",
// "React", etc.), por eso van como string literal acá y no como key de
// Languajes/*.js. Lo que SÍ se traduce es la etiqueta de cada ÁREA (mono,
// "iOS nativo" / "Native iOS") y una entrada puntual que es una frase, no un
// nombre propio ("Módulos nativos (Swift/Kotlin)") — esas van con
// `translationKey` y se resuelven contra `languaje.landing.stack` en el
// componente, nunca acá.
//
// `Icon` queda `null` a propósito cuando no existe un ícono real en
// react-icons para esa tecnología (SwiftUI, TestFlight, Zustand, deep
// linking, módulos nativos): mostrar el logo de otra
// cosa sería un logo incorrecto, peor que no mostrar ninguno (ver tarea).
export const STACK_AREAS = [
  {
    id: "ios",
    labelKey: "ios",
    featured: { label: "Swift", Icon: SiSwift },
    items: [
      { label: "SwiftUI", Icon: null },
      { label: "UIKit", Icon: SiUikit },
      { label: "Xcode", Icon: SiXcode },
      { label: "TestFlight", Icon: null },
      { label: "App Store Connect", Icon: SiAppstore },
      { label: "Push (APNs)", Icon: RiNotification3Fill },
    ],
  },
  {
    id: "crossPlatform",
    labelKey: "crossPlatform",
    featured: { label: "React Native", Icon: SiReact },
    items: [
      { label: "Expo · EAS", Icon: SiExpo },
      { translationKey: "nativeModules", Icon: null },
      { label: "Stripe", Icon: SiStripe },
      { label: "RevenueCat", Icon: SiRevenuecat },
      { label: "Deep linking", Icon: null },
    ],
  },
  {
    id: "frontend",
    labelKey: "frontend",
    featured: { label: "React", Icon: SiReact },
    items: [
      { label: "TypeScript", Icon: SiTypescript },
      { label: "JavaScript", Icon: SiJavascript },
      { label: "Next.js", Icon: SiNextdotjs },
      { label: "Tailwind CSS", Icon: SiTailwindcss },
      { label: "TanStack Query", Icon: SiReactquery },
      { label: "Zustand", Icon: null },
      { label: "Redux Toolkit", Icon: SiRedux },
      { label: "Jest", Icon: SiJest },
    ],
  },
  {
    id: "aiTools",
    labelKey: "aiTools",
    // Claude Code al frente: el CV destaca el desarrollo asistido por IA en el
    // día a día (implementación y code review). Supabase va como una
    // herramienta más, no como protagonista del área.
    featured: { label: "Claude Code", Icon: SiClaudecode },
    items: [
      { label: "Codex", Icon: RiOpenaiFill },
      { label: "Supabase", Icon: SiSupabase },
      { label: "Git", Icon: SiGit },
      { label: "GitHub", Icon: SiGithub },
      { label: "Figma", Icon: SiFigma },
    ],
  },
];

// Franja del hero (ver HeroStackStrip.jsx): un recorte más chico y más
// "vendible" del stack completo de arriba — los nombres que de verdad abren
// la puerta (React Native, Swift) más el resto del día a día. Se referencia
// desde STACK_AREAS en vez de reimportar los íconos de nuevo, para que un
// ícono que cambia arriba no se desincronice acá.
const ios = STACK_AREAS.find((area) => area.id === "ios");
const crossPlatform = STACK_AREAS.find((area) => area.id === "crossPlatform");
const frontend = STACK_AREAS.find((area) => area.id === "frontend");
const aiTools = STACK_AREAS.find((area) => area.id === "aiTools");

export const HERO_STACK_ITEMS = [
  crossPlatform.featured,
  ios.featured,
  { label: "SwiftUI", Icon: null },
  frontend.items.find((item) => item.label === "TypeScript"),
  frontend.featured,
  frontend.items.find((item) => item.label === "Next.js"),
  { label: "Expo", Icon: SiExpo },
  aiTools.items.find((item) => item.label === "Supabase"),
];
