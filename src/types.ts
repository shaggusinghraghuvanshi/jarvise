export interface Message {
  id: string;
  sender: string;
  text: string;
  timestamp: string;
  type: "jarvis" | "user" | "system";
  provider?: string;
}

export type ViewType = "view-console" | "view-config" | "view-analytics";

export interface SystemStats {
  cpuLoad: number;
  responseTime: number;
  requestCount: number;
  uptimeSeconds: number;
  voiceStatus: "IDLE" | "REC" | "OUT" | "ERR";
  voiceSub: string;
}
