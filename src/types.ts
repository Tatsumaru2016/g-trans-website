export enum SceneStage {
  COSMIC_CORE = "COSMIC_CORE", // Scene 1
  CROSS_PLATFORM = "CROSS_PLATFORM", // Scene 2
  NEBULA_BARRIER = "NEBULA_BARRIER", // Scene 3
  RACIAL_HARMONY = "RACIAL_HARMONY", // Scene 4
  PLANETARY_SINGULARITY = "PLANETARY_SINGULARITY", // Scene 5
  INFINITE_WEB = "INFINITE_WEB", // Scene 6
  GRAND_RING = "GRAND_RING" // Scene 7
}

export interface TranslationNode {
  id: string;
  position: [number, number, number];
  originalText: string;
  translatedText: string;
  language: string;
  color: string;
}

export interface ConstellationPanel {
  id: string;
  position: [number, number, number];
  platform: "discord" | "slack" | "wechat" | "twitter" | "telegram";
  sender: string;
  originalText: string;
  translatedText: string;
  progress: number; // 0 to 1 for decoding effect
}

export interface PlanetData {
  id: string;
  name: string;
  position: [number, number, number];
  radius: number;
  color: string;
  wireframeColor: string;
  textureOffset?: number;
  connections: string[]; // planet IDs it connects to
}

// Multilingual translations for particles fluttering around core Earth
export const CORE_TRANSLATIONS = [
  { text: "Connect", lang: "EN" },
  { text: "连接", lang: "ZH" },
  { text: "Connecter", lang: "FR" },
  { text: "Verbinden", lang: "DE" },
  { text: "Conectarse", lang: "ES" },
  { text: "Connetti", lang: "IT" },
  { text: "つなぐ", lang: "JA" },
  { text: "연결", lang: "KO" },
  { text: "Conectar", lang: "PT" },
  { text: "Связать", lang: "RU" },
  { text: "İletişim", lang: "TR" }
];

export const PANEL_MESSAGES: ConstellationPanel[] = [
  {
    id: "p1",
    position: [-2.5, 1.8, 12],
    platform: "discord",
    sender: "Sato_99",
    originalText: "今どこ？会議始まっちゃうよ！",
    translatedText: "Where are you? The meeting is starting!",
    progress: 0
  },
  {
    id: "p2",
    position: [2.8, -1.2, 10],
    platform: "telegram",
    sender: "Elena_Dev",
    originalText: "Релиз готов, проверяйте билд.",
    translatedText: "The release is ready, check the build.",
    progress: 0
  },
  {
    id: "p3",
    position: [-3.2, -1.5, 5],
    platform: "twitter",
    sender: "Pierre_Design",
    originalText: "Cette nouvelle interface est incroyable !",
    translatedText: "This new interface is incredible!",
    progress: 0
  },
  {
    id: "p4",
    position: [3.4, 2.0, 3],
    platform: "wechat",
    sender: "Emma_Z",
    originalText: "方案已经发你邮箱了，请查收。",
    translatedText: "The proposal has been sent to your email, please check.",
    progress: 0
  },
  {
    id: "p5",
    position: [-1.5, 0.8, -2],
    platform: "slack",
    sender: "Hans_Müller",
    originalText: "Lass uns den Code heute noch mergen.",
    translatedText: "Let's merge the code today.",
    progress: 0
  }
];

export const PLANETS: PlanetData[] = [
  {
    id: "earth",
    name: "G.trans Nexus (Earth)",
    position: [0, 0, -90],
    radius: 3.5,
    color: "#00ffff",
    wireframeColor: "#1e1b4b",
    connections: ["mars", "jupiter"]
  },
  {
    id: "mars",
    name: "Ares-4 Colony",
    position: [-15, 6, -110],
    radius: 2.2,
    color: "#f87171",
    wireframeColor: "#7f1d1d",
    connections: ["earth", "jupiter"]
  },
  {
    id: "jupiter",
    name: "Jovian Spaceport",
    position: [18, -8, -135],
    radius: 5.0,
    color: "#fb923c",
    wireframeColor: "#7c2d12",
    connections: ["earth", "mars"]
  }
];
