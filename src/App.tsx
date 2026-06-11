import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Terminal,
  Settings,
  Activity,
  Mic,
  Volume2,
  VolumeX,
  Send,
  Cpu,
  Clock,
  Database,
  ShieldCheck,
  ShieldAlert,
  CheckCircle2,
  Lock,
  Unlock,
  Radio,
  X,
  Compass,
  AlertTriangle,
  Globe2,
  ListRestart
} from "lucide-react";
import { Message, ViewType, SystemStats } from "./types";

export default function App() {
  const [activeTab, setActiveTab] = useState<ViewType>("view-console");
  const [chatInput, setChatInput] = useState("");
  
  // Custom API key configuration
  const [apiKey, setApiKey] = useState(() => {
    return sessionStorage.getItem("JARVIS_CORE_KEY") || "";
  });
  const [apiKeyInput, setApiKeyInput] = useState(apiKey);
  const [configStatus, setConfigStatus] = useState(() => {
    return apiKey ? "Token loaded from active storage. Core link stabilized." : "Key unmounted. Reverting to sandbox routing.";
  });

  // Chat memory
  const [chatHistory, setChatHistory] = useState<Message[]>([
    {
      id: "boot-message",
      sender: "JARVIS",
      text: "Good day, sir. JARVIS OS online. All networks functional.\nNote: I am securely connected to your server-side Gemini Core Matrix. You may configure a custom Claude credentials token in the **Config** section at your convenience. Cognitive core standing by. What are we solving today?",
      timestamp: new Date().toLocaleTimeString(),
      type: "jarvis",
      provider: "System Base"
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(true);

  // Live Event logs for nostalgic and immersive sci-fi terminal feel
  const [eventLogs, setEventLogs] = useState<string[]>([
    "[12:04:12] - AUTH_GRANTED_USER_01",
    "[12:04:15] - NEURAL_SYNC_STARTED",
    "[12:04:18] - HEURISTIC_OVERRIDE_OFF",
    "[12:05:01] - PKT_DROP_0.00%",
    "[12:05:22] - INITIALIZED_BASE_CORE"
  ]);

  // Uptime and dynamic visual parameters
  const [uptimeSeconds, setUptimeSeconds] = useState(104 * 3600 + 12 * 60 + 55); // align with High Density template start
  const [stats, setStats] = useState<SystemStats>({
    cpuLoad: 34,
    responseTime: 0.8,
    requestCount: 0,
    uptimeSeconds: 0,
    voiceStatus: "IDLE",
    voiceSub: "Ready"
  });

  // Clock with local timezone state
  const [currentTime, setCurrentTime] = useState("");
  const [fullDate, setFullDate] = useState("");

  // Speech interface refs & visualizer states
  const [isOverlayActive, setIsOverlayActive] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState("");
  const [frequencies, setFrequencies] = useState<number[]>(new Array(12).fill(4));
  
  const recognitionRef = useRef<any>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // Event logger helper
  const addLog = (event: string) => {
    const time = new Date().toLocaleTimeString();
    setEventLogs(prev => [
      `[${time}] - ${event}`,
      ...prev.slice(0, 18)
    ]);
  };

  // Log active states changes
  useEffect(() => {
    addLog(`VIEW_MUTATED_TO_${activeTab.replace("view-", "").toUpperCase()}`);
  }, [activeTab]);

  useEffect(() => {
    addLog(`VOICE_SYNTH_STATE_${ttsEnabled ? "MUTATED_ACTIVE" : "SUSPENDED"}`);
  }, [ttsEnabled]);

  // Time & date lifecycle
  useEffect(() => {
    const updateTimeAndUptime = () => {
      const d = new Date();
      
      const hours = String(d.getHours()).padStart(2, '0');
      const minutes = String(d.getMinutes()).padStart(2, '0');
      const seconds = String(d.getSeconds()).padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}:${seconds}`);

      const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
      const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
      const dayName = days[d.getDay()];
      const dayNum = d.getDate();
      const monthName = months[d.getMonth()];
      const year = d.getFullYear();
      setFullDate(`${dayName} ${dayNum} ${monthName} ${year}`);

      setUptimeSeconds(prev => prev + 1);
    };

    updateTimeAndUptime();
    const interval = setInterval(updateTimeAndUptime, 1000);
    return () => clearInterval(interval);
  }, []);

  // System fluctuating telemetry
  useEffect(() => {
    const statsInterval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        cpuLoad: Math.floor(Math.random() * 18 + 26), // hover around the 34% high density look
        responseTime: parseFloat((Math.random() * 0.4 + 0.3).toFixed(1)),
        uptimeSeconds: uptimeSeconds
      }));
    }, 3000);
    return () => clearInterval(statsInterval);
  }, [uptimeSeconds]);

  // Keep chat automatic scrolled-down
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, isTyping]);

  // Function to save configuration key
  const saveApiKey = () => {
    const val = apiKeyInput.trim();
    if (val) {
      sessionStorage.setItem("JARVIS_CORE_KEY", val);
      setApiKey(val);
      setConfigStatus("Token active inside memory cluster. Core link stabilized.");
      addLog("SECURITY_BEARER_TOKEN_MOUNTED_ENCRYPTED");
      setChatHistory(prev => [
        ...prev,
        {
          id: `sys-${Date.now()}`,
          sender: "SYSTEM",
          text: "Core link reconstructed. Anthropic router mapped safely inside sandboxed memory.",
          timestamp: new Date().toLocaleTimeString(),
          type: "system"
        }
      ]);
    } else {
      sessionStorage.removeItem("JARVIS_CORE_KEY");
      setApiKey("");
      setConfigStatus("Key unmounted. Reverting to sandbox routing.");
      addLog("SECURITY_BEARER_TOKEN_UNMOUNTED");
      setChatHistory(prev => [
        ...prev,
        {
          id: `sys-${Date.now()}`,
          sender: "SYSTEM",
          text: "Credentials safely purged. Reverted default routing to server Gemini 3.5 Flash.",
          timestamp: new Date().toLocaleTimeString(),
          type: "system"
        }
      ]);
    }
  };

  // Text formatting markdown-inspired processor
  const formatMarkdown = (text: string) => {
    if (!text) return "";
    const lines = text.split("\n");
    return lines.map((line, lineIdx) => {
      const inlineRegex = /(\*\*.*?\*\*|\*.*\*|`.*?`)/g;
      const parts = line.split(inlineRegex);
      return (
        <div key={lineIdx} className="mb-1 min-h-[14px]">
          {parts.map((p, pIdx) => {
            if (p.startsWith("**") && p.endsWith("**")) {
              return <strong key={pIdx} className="font-bold text-hud-text text-[12px]">{p.slice(2, -2)}</strong>;
            } else if (p.startsWith("*") && p.endsWith("*")) {
              return <em key={pIdx} className="italic text-hud-text/80 text-[12px]">{p.slice(1, -1)}</em>;
            } else if (p.startsWith("`") && p.endsWith("`")) {
              return (
                <code key={pIdx} className="bg-hud-blue-dim/40 px-1.5 py-0.5 rounded text-xs select-all font-mono border border-hud-blue/30 text-cyan-200">
                  {p.slice(1, -1)}
                </code>
              );
            }
            return <span key={pIdx} className="text-hud-text/90 text-[12px] leading-relaxed">{p}</span>;
          })}
        </div>
      );
    });
  };

  // Speaks output text aloud with speech synthesis
  const speakOutput = (text: string) => {
    if (!ttsEnabled || typeof window === "undefined" || !window.speechSynthesis) return;
    
    // Stop any current reading
    window.speechSynthesis.cancel();
    
    const cleanText = text.replace(/[*_`#]/g, "").replace(/\n/g, ". ");
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.05;
    utterance.pitch = 0.88;
    utterance.volume = 0.95;

    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => v.name.toLowerCase().includes("google uk english male"))
      || voices.find(v => v.name.toLowerCase().includes("daniel"))
      || voices.find(v => v.lang === "en-GB")
      || voices.find(v => v.lang.startsWith("en"));
      
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onstart = () => {
      setStats(prev => ({
        ...prev,
        voiceStatus: "OUT",
        voiceSub: "Speaking"
      }));
      addLog("SPEECH_SYNTHESIZER_DISPATCH_SOUND_ACTIVE");
    };

    utterance.onend = () => {
      setStats(prev => ({
        ...prev,
        voiceStatus: "IDLE",
        voiceSub: "Ready"
      }));
      addLog("SPEECH_SYNTHESIZER_OUTPUT_SEQUENCE_COMPLETE");
    };

    utterance.onerror = () => {
      setStats(prev => ({
        ...prev,
        voiceStatus: "IDLE",
        voiceSub: "Ready"
      }));
      addLog("SPEECH_SYNTHESIZER_FAULT_RECOVERED");
    };

    window.speechSynthesis.speak(utterance);
  };

  // Formulate secure API call to our server backend
  const handleSubmission = async (overridePrompt?: string) => {
    const promptToSend = overridePrompt || chatInput;
    if (!promptToSend.trim()) return;

    if (!overridePrompt) {
      setChatInput("");
    }

    addLog("USER_PROMPT_MUTATED_DISPATCH");

    // Add user question to timeline
    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: "YOU",
      text: promptToSend,
      timestamp: new Date().toLocaleTimeString(),
      type: "user"
    };

    setChatHistory(prev => [...prev, userMsg]);
    setIsTyping(true);

    setStats(prev => ({
      ...prev,
      requestCount: prev.requestCount + 1
    }));

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: promptToSend,
          customApiKey: apiKey,
          chatHistory: chatHistory
            .filter(h => h.id !== "boot-message" && h.type !== "system")
            .slice(-10) // Limit context payload size safely
            .map(h => ({
              role: h.type === "user" ? "user" : "model",
              text: h.text
            }))
        })
      });

      const data = await response.json();
      setIsTyping(false);

      if (data.error) {
        setChatHistory(prev => [
          ...prev,
          {
            id: `err-${Date.now()}`,
            sender: "JARVIS STATUS",
            text: `Matrix link interrupted: ${data.error}`,
            timestamp: new Date().toLocaleTimeString(),
            type: "system"
          }
        ]);
        addLog("GW_ERR_TRANSMISSION_INTERRUPT");
        return;
      }

      const replyText = data.reply || "I encountered an empty buffer stream, sir.";
      const provider = data.provider || "Gemini 3.5";

      addLog(`CORE_RESPONSE_ROUTED_VIA_${provider.toUpperCase().replace(/\s+/g, '_')}`);

      setChatHistory(prev => [
        ...prev,
        {
          id: `jarvis-${Date.now()}`,
          sender: "JARVIS",
          text: replyText,
          timestamp: new Date().toLocaleTimeString(),
          type: "jarvis",
          provider: provider
        }
      ]);

      // Talk response aloud
      speakOutput(replyText);

    } catch (err: any) {
      setIsTyping(false);
      addLog("GW_SYS_NEURAL_ROUTE_FATAL");
      setChatHistory(prev => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: "JARVIS SYSTEM",
          text: `Neural gateway collapse. Core server connection failed.`,
          timestamp: new Date().toLocaleTimeString(),
          type: "system"
        }
      ]);
    }
  };

  // Stop client audio context analysis
  const stopAudioAnalysis = () => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    analyserRef.current = null;
    setFrequencies(new Array(12).fill(4));
    
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach(track => track.stop());
      micStreamRef.current = null;
    }
  };

  // Launch Web Audio API capture to map frequency bars live
  const startAudioAnalysis = async (stream: MediaStream) => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      const analyserNode = ctx.createAnalyser();
      analyserNode.fftSize = 32; // Low res for 16 groupings
      
      const source = ctx.createMediaStreamSource(stream);
      source.connect(analyserNode);

      audioContextRef.current = ctx;
      analyserRef.current = analyserNode;

      const loop = () => {
        if (!analyserRef.current) return;
        const info = new Uint8Array(analyserRef.current.frequencyBinCount);
        analyserRef.current.getByteFrequencyData(info);
        
        const mapped = Array.from(info).slice(0, 12).map(val => {
          return Math.max(4, Math.floor((val / 255) * 36));
        });
        
        while (mapped.length < 12) {
          mapped.push(4);
        }
        
        setFrequencies(mapped);
        animFrameRef.current = requestAnimationFrame(loop);
      };

      loop();
    } catch (e) {
      console.error("Audio analyser failed to link", e);
    }
  };

  // Establish standard browser SpeechRecognition interface
  const triggerVoiceCapture = async () => {
    if (typeof window === "undefined") return;
    
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      addLog("MIC_FEED_HARDWARE_REJECT");
      setChatHistory(prev => [
        ...prev,
        {
          id: `sys-${Date.now()}`,
          sender: "SYSTEM DIAGNOSTICS",
          text: "Web Speech API is unsupported in this browser wrapper. Sir, please try launching directly inside standard Chrome/Edge.",
          timestamp: new Date().toLocaleTimeString(),
          type: "system"
        }
      ]);
      return;
    }

    if (window.speechSynthesis && window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }

    setIsOverlayActive(true);
    setVoiceTranscript("");
    setStats(prev => ({ ...prev, voiceStatus: "REC", voiceSub: "Listening" }));
    addLog("MIC_FEED_CAPTURE_LIVE");

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      micStreamRef.current = stream;
      startAudioAnalysis(stream);

      const recog = new SpeechRecognition();
      recog.continuous = false;
      recog.interimResults = true;
      recog.lang = "en-US";

      recog.onresult = (event: any) => {
        let interim = "";
        let final = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            final += event.results[i][0].transcript;
          } else {
            interim += event.results[i][0].transcript;
          }
        }
        setVoiceTranscript(final || interim);
      };

      recog.onend = () => {
        stopAudioAnalysis();
        setIsOverlayActive(false);
        setStats(prev => ({ ...prev, voiceStatus: "IDLE", voiceSub: "Ready" }));
        addLog("MIC_FEED_CAPTURE_HALT");

        // Only send if transcript is non-empty
        setVoiceTranscript(prev => {
          if (prev && prev.trim()) {
            handleSubmission(prev.trim());
          }
          return "";
        });
      };

      recog.onerror = (err: any) => {
        console.error("Speech Recognition error:", err);
        stopAudioAnalysis();
        setIsOverlayActive(false);
        setStats(prev => ({ ...prev, voiceStatus: "ERR", voiceSub: "Failure" }));
        addLog("MIC_FEED_FAULT_MUTED");
      };

      recognitionRef.current = recog;
      recog.start();

    } catch (err) {
      console.error("Microphone access denied", err);
      setIsOverlayActive(false);
      setStats(prev => ({ ...prev, voiceStatus: "ERR", voiceSub: "Muted" }));
      addLog("MIC_FEED_ACCESS_DENIED");
      setChatHistory(prev => [
        ...prev,
        {
          id: `sys-${Date.now()}`,
          sender: "SYSTEM",
          text: "Hardware mic link denied by terminal sandbox frame permissions.",
          timestamp: new Date().toLocaleTimeString(),
          type: "system"
        }
      ]);
    }
  };

  const closeVoiceOverlay = () => {
    setIsOverlayActive(false);
    if (recognitionRef.current) {
      recognitionRef.current.abort();
    }
    stopAudioAnalysis();
    setStats(prev => ({ ...prev, voiceStatus: "IDLE", voiceSub: "Ready" }));
    addLog("MIC_FEED_USER_DISMISS");
  };

  // High Density formatted Uptime representation: Days:Hours:Minutes:Seconds
  const formattedUptime = () => {
    const d = Math.floor(uptimeSeconds / (3600 * 24));
    const h = Math.floor((uptimeSeconds % (3600 * 24)) / 3600);
    const m = Math.floor((uptimeSeconds % 3600) / 60);
    const s = uptimeSeconds % 60;
    return `${d}:${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  return (
    <div className="relative flex flex-col h-screen w-screen bg-[#050505] text-[#00f2ff] font-mono overflow-hidden select-none">
      
      {/* Retro Sci-fi authentic scanline filter overlay */}
      <div className="scanline" />

      {/* Fullscreen HUD micro-feedback active voice triggers */}
      <AnimatePresence>
        {isOverlayActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] flex flex-col items-center justify-center bg-[#050505]/95 gap-8"
          >
            <div className="relative w-36 h-36 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border border-[#00f2ff]/30 animate-ping opacity-30" />
              <div className="absolute inset-0 rounded-full border-2 border-[#00f2ff] animate-spin border-t-transparent" />
              <div className="absolute inset-3 rounded-full border border-red-500/20 animate-pulse" />
              <div className="relative z-10 text-[#00f2ff] text-3xl">
                <Mic className="w-12 h-12 animate-bounce" />
              </div>
            </div>

            {/* Glowing captured audio matrix groupings */}
            <div className="flex h-12 items-end gap-1.5 px-5 py-2.5 border border-cyan-800/40 bg-[#0a0a0a] rounded-md">
              {frequencies.map((h, i) => (
                <motion.div
                  key={i}
                  className="w-2 rounded-full bg-[#00f2ff] shadow-[0_0_8px_#00f2ff]"
                  animate={{ height: h }}
                  transition={{ type: "spring", stiffness: 220, damping: 14 }}
                  style={{ minHeight: "4px" }}
                />
              ))}
            </div>

            <div className="text-[#00f2ff]/60 text-[10px] uppercase tracking-[0.25em] animate-pulse">
              Listening for cognitive input waves...
            </div>

            <div className="text-cyan-100 font-bold text-center text-sm max-w-lg px-8 min-h-[42px] leading-relaxed italic">
              {voiceTranscript ? `"${voiceTranscript}"` : "Initializing sound stream hardware grid..."}
            </div>

            <button
              onClick={closeVoiceOverlay}
              className="flex items-center gap-2 px-6 py-2 border border-red-500/35 text-red-500 hover:bg-red-500/10 hover:border-red-500 rounded transition-all text-[10px] uppercase tracking-widest cursor-pointer"
            >
              <X className="w-4 h-4" /> Terminate Feed
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* TOP HEADER SECTION */}
      <header className="h-12 border-b border-[#1a1a1a] flex items-center justify-between px-6 bg-[#0a0a0a] flex-shrink-0">
        <div className="flex items-center space-x-4">
          <div className="w-3 h-3 bg-[#00f2ff] shadow-[0_0_8px_#00f2ff] animate-pulse"></div>
          <span className="text-xs tracking-[0.2em] uppercase font-bold text-[#00f2ff]">
            Jarvise Intelligence // Core v4.6.0
          </span>
        </div>
        
        <div className="flex space-x-8 text-[10px] tracking-widest uppercase text-cyan-600 font-bold">
          <div>Status: <span className="text-[#00f2ff]">Operational</span></div>
          <div>Lat: <span className="text-[#00f2ff]">{stats.responseTime * 1000}ms</span></div>
          <div>Uptime: <span className="text-[#00f2ff] select-all tabular-nums">{formattedUptime()}</span></div>
          <div>Secure: <span className="text-[#00f2ff]">{apiKey ? "Encrypted" : "Base-Link"}</span></div>
          <div className="hidden sm:block">Time: <span className="text-[#00f2ff] tabular-nums select-all">{currentTime || "--:--:--"}</span></div>
        </div>
      </header>

      {/* THREE COLUMN COMMAND GRID */}
      <main className="flex-1 grid grid-cols-12 gap-px bg-[#1a1a1a] overflow-hidden">
        
        {/* COLUMN 1 (LEFT 3 COLS): Sub-realms Navigation and Context */}
        <section className="col-span-3 bg-[#050505] flex flex-col p-4 overflow-y-auto">
          <div className="mb-4">
            <h3 className="text-[10px] uppercase tracking-[0.16em] text-cyan-700 border-b border-cyan-900/50 pb-1 mb-3 font-bold flex items-center justify-between">
              <span>Sub-Routine Modules</span>
              <span className="text-[8px] bg-cyan-950 px-1 py-px text-[#00f2ff]/60 scale-95 border border-cyan-800/40">HUD_V46</span>
            </h3>
            
            <div className="space-y-2">
              {/* NLP Parser (Switches to Console View) */}
              <button
                onClick={() => setActiveTab("view-console")}
                className={`w-full flex justify-between items-center text-left p-2 transition-all cursor-pointer border-l-2 ${
                  activeTab === "view-console"
                    ? "bg-cyan-950/20 border-cyan-400 border-y border-r border-[#1a1a1a] shadow-[0_0_8px_rgba(0,242,255,0.1)] text-[#00f2ff]"
                    : "bg-cyan-950/5 hover:bg-cyan-950/10 border-cyan-900/40 text-cyan-500"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Terminal className="w-3.5 h-3.5" />
                  <span className="text-xs font-semibold uppercase tracking-wider">NLP_PARSER_CORE</span>
                </div>
                <span className="text-[9px] font-bold tracking-widest text-[#00f2ff]">
                  {activeTab === "view-console" ? "ACTIVE" : "STANDBY"}
                </span>
              </button>

              {/* Secure Credentials Mappings (Switches to Config View) */}
              <button
                onClick={() => setActiveTab("view-config")}
                className={`w-full flex justify-between items-center text-left p-2 transition-all cursor-pointer border-l-2 ${
                  activeTab === "view-config"
                    ? "bg-cyan-950/20 border-cyan-400 border-y border-r border-[#1a1a1a] shadow-[0_0_8px_rgba(0,242,255,0.1)] text-[#00f2ff]"
                    : "bg-cyan-950/5 hover:bg-cyan-950/10 border-cyan-900/40 text-cyan-500"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Settings className="w-3.5 h-3.5" />
                  <span className="text-xs font-semibold uppercase tracking-wider">MEMBER_CONFIG</span>
                </div>
                <span className="text-[9px] font-bold tracking-widest">
                  {activeTab === "view-config" ? "RUNNING" : "WAITING"}
                </span>
              </button>

              {/* Analytics & Diagnostic Metrics (Switches to Analytics View) */}
              <button
                onClick={() => setActiveTab("view-analytics")}
                className={`w-full flex justify-between items-center text-left p-2 transition-all cursor-pointer border-l-2 ${
                  activeTab === "view-analytics"
                    ? "bg-cyan-950/20 border-cyan-400 border-y border-r border-[#1a1a1a] shadow-[0_0_8px_rgba(0,242,255,0.1)] text-[#00f2ff]"
                    : "bg-cyan-950/5 hover:bg-cyan-950/10 border-cyan-900/40 text-cyan-500"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Activity className="w-3.5 h-3.5" />
                  <span className="text-xs font-semibold uppercase tracking-wider">GATE_METRICS</span>
                </div>
                <span className="text-[9px] font-bold tracking-widest">
                  {activeTab === "view-analytics" ? "MONITORING" : "STANDBY"}
                </span>
              </button>

              {/* Vocal TTS Sync Control */}
              <div className="p-2 bg-cyan-950/5 border border-cyan-900/20 border-l-2 border-[#1a1a1a] flex justify-between items-center">
                <div className="flex items-center gap-2 text-cyan-500/80">
                  {ttsEnabled ? <Volume2 className="w-3.5 h-3.5 text-[#00f2ff]" /> : <VolumeX className="w-3.5 h-3.5 text-red-500" />}
                  <span className="text-[10px] font-bold uppercase tracking-wider">VOCAL_FEED_BACK</span>
                </div>
                <button
                  onClick={() => setTtsEnabled(!ttsEnabled)}
                  className={`text-[9px] font-extrabold tracking-widest px-1 py-px rounded border cursor-pointer select-none transition-all ${
                    ttsEnabled 
                      ? "border-cyan-400 bg-cyan-950 text-[#00f2ff] shadow-[0_0_4px_rgba(0,242,255,0.2)]" 
                      : "border-red-500/40 text-red-400 bg-red-950/20 hover:border-red-500"
                  }`}
                >
                  {ttsEnabled ? "ON" : "OFF"}
                </button>
              </div>

              {/* Vocal Mic Sync Control */}
              <div className="p-2 bg-cyan-950/5 border border-cyan-900/20 border-l-2 border-[#1a1a1a] flex justify-between items-center">
                <div className="flex items-center gap-2 text-cyan-500/80">
                  <Mic className={`w-3.5 h-3.5 ${stats.voiceStatus === "REC" ? "text-red-500 animate-pulse" : "text-cyan-500"}`} />
                  <span className="text-[10px] font-bold uppercase tracking-wider">MIC_AUDIO_CAPTURE</span>
                </div>
                <span className={`text-[9px] font-extrabold tracking-widest px-1 py-px border select-none ${
                    stats.voiceStatus === "REC" 
                      ? "border-red-500 bg-red-950/10 text-red-500 animate-pulse" 
                      : "border-cyan-800/40 text-cyan-600"
                  }`}
                >
                  {stats.voiceStatus}
                </span>
              </div>
            </div>
          </div>
          
          <div className="mt-auto pt-4 border-t border-cyan-950/50">
            <h3 className="text-[10px] uppercase text-cyan-700 border-b border-cyan-900/50 pb-1 mb-3 font-bold">
              Environmental Context
            </h3>
            <div className="grid grid-cols-2 gap-2 text-[10px]">
              <div className="bg-[#0a0a0a] p-2 border border-[#1a1a1a]">
                <div className="text-[9px] text-cyan-800 font-bold uppercase">Location Coordinates</div>
                <div className="text-xs font-semibold text-[#00f2ff] select-all">40.7128 N, 74.006 W</div>
              </div>
              <div className="bg-[#0a0a0a] p-2 border border-[#1a1a1a]">
                <div className="text-[9px] text-cyan-800 font-bold uppercase">Secure Cluster</div>
                <div className="text-xs font-semibold text-[#00f2ff]">STARK-HQ-NYC</div>
              </div>
              <div className="bg-[#0a0a0a] p-2 border border-[#1a1a1a]">
                <div className="text-[9px] text-cyan-800 font-bold uppercase">Module Temperature</div>
                <div className="text-xs font-semibold text-[#00f2ff]">21.4°C — NOMINAL</div>
              </div>
              <div className="bg-[#0a0a0a] p-2 border border-[#1a1a1a]">
                <div className="text-[9px] text-cyan-800 font-bold uppercase">Grid Latency</div>
                <div className="text-xs font-semibold text-[#00f2ff] tabular-nums">{stats.responseTime * 1000} ms</div>
              </div>
            </div>
          </div>
        </section>

        {/* COLUMN 2 (CENTER 6 COLS): Concentric Pulsing Visual Orb & Tabbed Workspace panel */}
        <section className="col-span-6 bg-[#050505] flex flex-col border-x border-[#1a1a1a] p-4 relative overflow-hidden">
          
          {/* Subtle concentric grid pulsing backflow matrix */}
          <div className="absolute inset-0 opacity-5 pointer-events-none z-0">
            <div className="w-full h-full bg-[radial-gradient(circle_at_center,_#00f2ff_0%,_transparent_75%)]"></div>
          </div>
          
          {/* Centered Neural Concentric Visualization Module */}
          <div className="flex-shrink-0 flex flex-col items-center justify-center p-3 mb-4 bg-[#0a0a0a] border border-[#1a1a1a] rounded relative z-10">
            <div className="relative flex items-center justify-center w-36 h-36">
              
              {/* Pulse circle 1 */}
              <div className={`absolute w-32 h-32 rounded-full border border-cyan-400/20 transition-all duration-300 ${
                stats.voiceStatus === "OUT" ? "scale-105 border-cyan-400/40" :
                stats.voiceStatus === "REC" ? "scale-95 border-red-500/20 animate-ping" : "animate-pulse"
              }`} />
              
              {/* Dashed spinning orbital indicator circle 2 */}
              <div className="absolute w-28 h-28 rounded-full border-2 border-dashed border-cyan-500/35 animate-[spin_10s_linear_infinite]" />
              
              {/* Inner Circle 3 */}
              <div className="absolute w-20 h-20 rounded-full border border-cyan-300/40 flex items-center justify-center relative">
                
                {/* Visual scanning line */}
                <div className="absolute inset-x-0 h-px bg-[#00f2ff]/60 animate-bounce" />
                
                {/* Active centerpiece glowing dot core */}
                <div className={`w-3.5 h-3.5 rounded-full transition-all duration-200 ${
                  stats.voiceStatus === "REC" ? "bg-red-500 shadow-[0_0_12px_#ff3131]" :
                  stats.voiceStatus === "OUT" ? "bg-[#00f2ff] shadow-[0_0_16px_#00f2ff] scale-125" : "bg-cyan-400 shadow-[0_0_8px_#00f2ff] animate-pulse"
                }`} />
                
              </div>

              {/* Orbital Labels */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-2.5 text-[8px] bg-[#050505] px-1 text-cyan-400/80 uppercase font-mono tracking-widest font-extrabold select-none">
                NEURAL_N_01
              </div>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 -mb-2.5 text-[8px] bg-[#050505] px-1 text-cyan-400/80 uppercase font-mono tracking-widest select-none">
                IQ_INTEG: 99.8%
              </div>
            </div>
          </div>

          {/* ACTIVE WORKSPACE AREA */}
          <div className="flex-1 bg-[#0a0a0a]/40 border border-[#1a1a1a] rounded p-4 overflow-hidden flex flex-col relative z-20">
            
            <AnimatePresence mode="wait">
              
              {/* VIEW 1: CONSOLE CHAT */}
              {activeTab === "view-console" && (
                <motion.div
                  key="console"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.15 }}
                  className="flex-1 flex flex-col overflow-hidden h-full"
                >
                  {/* Scrolling dialog list */}
                  <div className="flex-1 overflow-y-auto space-y-4 pr-1 mb-3 scroll-smooth">
                    {chatHistory.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex flex-col gap-1 max-w-[85%] ${
                          msg.type === "user" ? "ml-auto items-end text-right" : "items-start text-left"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className={`text-[9px] uppercase tracking-widest font-bold ${
                            msg.type === "user" ? "text-green-400" : msg.type === "system" ? "text-amber-400" : "text-[#00f2ff]"
                          }`}>
                            [{msg.sender}]
                          </span>
                          <span className="text-[8px] text-[#00f2ff]/40 tracking-wider font-semibold tabular-nums">
                            {msg.timestamp}
                          </span>
                          {msg.provider && (
                            <span className="text-[8px] bg-cyan-950 text-[#00f2ff] border border-cyan-800/40 px-1 py-px rounded uppercase tracking-wider scale-95 font-sans font-bold">
                              {msg.provider}
                            </span>
                          )}
                        </div>
                        
                        <div className={`px-3 py-2 rounded text-xs select-text leading-relaxed border ${
                          msg.type === "user"
                            ? "bg-[#39ff14]/5 border-[#39ff14]/30 text-emerald-200 rounded-tr-none shadow-[0_0_4px_rgba(57,255,20,0.05)]"
                            : msg.type === "system"
                            ? "bg-amber-500/5 border-amber-500/30 text-amber-200 rounded-tl-none font-bold italic"
                            : "bg-[#00f2ff]/5 border-cyan-500/20 text-[#bbaeff] rounded-tl-none pr-12 relative"
                        }`}>
                          {formatMarkdown(msg.text)}
                        </div>
                      </div>
                    ))}

                    {isTyping && (
                      <div className="flex flex-col gap-1 items-start text-left max-w-sm">
                        <span className="text-[9px] text-[#00f2ff]/60 uppercase tracking-widest font-bold">
                          [JARVIS SYNAPSE]
                        </span>
                        <div className="flex items-center gap-1 bg-[#00f2ff]/5 border border-cyan-800/20 px-3 py-2.5 rounded-lg rounded-tl-none">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#00f2ff] animate-bounce" style={{ animationDelay: "0ms" }} />
                          <span className="w-1.5 h-1.5 rounded-full bg-[#00f2ff] animate-bounce" style={{ animationDelay: "150ms" }} />
                          <span className="w-1.5 h-1.5 rounded-full bg-[#00f2ff] animate-bounce" style={{ animationDelay: "300ms" }} />
                        </div>
                      </div>
                    )}

                    <div ref={chatEndRef} />
                  </div>

                  {/* Input form panel prompt block */}
                  <div className="flex items-center gap-2 border border-cyan-900/50 bg-[#0a0a0a] p-1.5 rounded flex-shrink-0">
                    <span className="text-[12px] text-[#00f2ff] font-bold px-1.5">&#91;CMD_IN&#93;:</span>
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSubmission();
                      }}
                      placeholder="Specify task variables or invoke core commands..."
                      className="flex-1 bg-transparent border-none text-cyan-100 placeholder:text-cyan-800 text-xs py-1 outline-none font-mono tracking-wider"
                      autocomplete="off"
                    />

                    {/* Mic toggling trigger */}
                    <button
                      onClick={triggerVoiceCapture}
                      title="Initiate voice recognition channel stream"
                      className="p-1 px-1.5 rounded bg-[#0d0d0d] hover:bg-cyan-950 hover:text-[#00f2ff] border border-cyan-900/40 text-cyan-600 transition-all cursor-pointer"
                    >
                      <Mic className="w-3.5 h-3.5" />
                    </button>

                    {/* Submit Dispatch dispatch button */}
                    <button
                      onClick={() => handleSubmission()}
                      className="flex items-center gap-1.5 bg-cyan-950/40 border border-cyan-400/40 hover:border-cyan-400 text-[#00f2ff] hover:bg-cyan-950/80 rounded px-3 py-1 text-[9px] tracking-widest uppercase font-bold transition-all cursor-pointer"
                    >
                      <Send className="w-3 h-3" /> Dispatch
                    </button>
                  </div>
                </motion.div>
              )}

              {/* VIEW 2: AUTH KEY CONFIG */}
              {activeTab === "view-config" && (
                <motion.div
                  key="config"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.15 }}
                  className="flex-1 flex flex-col gap-4 overflow-y-auto"
                >
                  <div>
                    <h2 className="text-xs font-bold text-[#00f2ff] tracking-widest uppercase mb-1.5 flex items-center gap-2">
                      <Settings className="w-4 h-4 text-[#00f2ff]" /> Core AI Security configuration
                    </h2>
                    <p className="text-[11px] text-[#b8dcff] leading-relaxed">
                      By default, JARVIS OS uses the workspace-provided, safe server-side **Gemini 3.5 Flash** matrix.
                      If you wish to deploy and proxy requests over Claude 3.5 Sonnet, insert an sk-ant token inside volatilized memory below.
                    </p>
                  </div>

                  <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded p-4 max-w-full flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] text-[#00f2ff]/60 uppercase font-bold tracking-widest select-none">
                        Anthropic Bearer Credentials
                      </span>
                      <span className="text-[8px] bg-cyan-950 border border-cyan-400/35 px-1.5 py-0.5 rounded text-[#00f2ff] uppercase font-bold tracking-widest">
                        Volatile RAM Sandbox
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <input
                          type="password"
                          placeholder="sk-ant-api03-..."
                          value={apiKeyInput}
                          onChange={(e) => setApiKeyInput(e.target.value)}
                          className="w-full bg-[#0d0d0d] border border-cyan-950 rounded px-3 py-2 text-xs text-cyan-200 outline-none placeholder:text-cyan-800 font-mono"
                        />
                        <div className="absolute top-2.5 right-3 text-[#00f2ff]/40">
                          {apiKey ? <Lock className="w-3.5 h-3.5 text-green-400 animate-pulse" /> : <Unlock className="w-3.5 h-3.5" />}
                        </div>
                      </div>

                      <button
                        onClick={saveApiKey}
                        className="px-4 py-2 border border-cyan-400/45 rounded bg-cyan-950 text-[#00f2ff] hover:bg-cyan-950/90 text-[9px] uppercase font-bold tracking-widest cursor-pointer transition-all"
                      >
                        Mount Link
                      </button>
                    </div>

                    <div className="flex items-center gap-2 text-[10px] min-h-[16px] font-semibold">
                      {apiKey ? (
                        <>
                          <ShieldCheck className="w-4 h-4 text-green-400" />
                          <span className="text-green-400">{configStatus}</span>
                        </>
                      ) : (
                        <>
                          <ShieldAlert className="w-4 h-4 text-[#ffaa00]" />
                          <span className="text-[#ffaa00]">{configStatus}</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="bg-[#0a0a0a]/50 border border-[#1a1a1a] rounded p-3 text-[10px] leading-relaxed text-[#00f2ff]/60">
                    <h3 className="font-bold text-[#00f2ff] uppercase tracking-widest mb-1">Encrypted Sandbox Statement</h3>
                    All authentication materials are processed behind encrypted server layers and held securely on browser-bound non-persistent `sessionStorage` arrays. Your keys are temporarily proxied for Sonnet request validation, and never logged, persisted, or exported.
                  </div>
                </motion.div>
              )}

              {/* VIEW 3: SYSTEM ANALYTICS */}
              {activeTab === "view-analytics" && (
                <motion.div
                  key="analytics"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.15 }}
                  className="flex-1 flex flex-col gap-4 overflow-y-auto"
                >
                  <div>
                    <h2 className="text-xs font-bold text-[#00f2ff] tracking-widest uppercase mb-1 flex items-center gap-2">
                      <Activity className="w-4 h-4 text-[#00f2ff]" /> Diagnostic Signal Traces
                    </h2>
                    <p className="text-[11px] text-[#b8dcff] leading-relaxed">
                      Analyzing downstream API integrations, local clock processes, and runtime variables inside the secure Cloud Run container.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded p-3 flex flex-col gap-1.5 text-[10px]">
                      <h3 className="text-[9px] text-[#00f2ff]/60 tracking-widest uppercase font-bold text-cyan-600">Secure CORS Routing</h3>
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
                        <span className="text-green-400 font-bold">CLIENT ROUTING NOMINAL</span>
                      </div>
                      <p className="text-[#00f2ff]/40 leading-relaxed">
                        API routing layer prevents browser credential drops by executing chats server-side at `/api/chat`.
                      </p>
                    </div>

                    <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded p-3 flex flex-col gap-1.5 text-[10px]">
                      <h3 className="text-[9px] text-[#00f2ff]/60 tracking-widest uppercase font-bold text-cyan-600">Model Response Synthesis</h3>
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
                        <span className="text-green-400 font-bold">CORE NEURAL MODEL ONLINE</span>
                      </div>
                      <p className="text-[#00f2ff]/40 leading-relaxed">
                        Default runtime utilizes Google's official Node.js `@google/genai` model client for robust wittiness.
                      </p>
                    </div>

                    <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded p-3 flex flex-col gap-1 col-span-2 text-[10px]">
                      <h3 className="text-[9px] text-[#00f2ff]/60 tracking-widest uppercase font-bold col-span-2 text-cyan-600">Environmental Parameters</h3>
                      <div className="grid grid-cols-2 gap-2 mt-1 border-t border-cyan-950 pt-2 font-mono">
                        <div className="flex items-center justify-between px-2 py-0.5 bg-cyan-950/15 border border-cyan-950 rounded">
                          <span className="text-[#00f2ff]/40">HOSTING RUNTIME:</span>
                          <span className="text-[#00f2ff] font-bold">Cloud-Run</span>
                        </div>
                        <div className="flex items-center justify-between px-2 py-0.5 bg-cyan-950/15 border border-cyan-950 rounded">
                          <span className="text-[#00f2ff]/40">SPEECH_VOICE_RATE:</span>
                          <span className="text-[#00f2ff] font-bold">1.05</span>
                        </div>
                        <div className="flex items-center justify-between px-2 py-0.5 bg-cyan-950/15 border border-cyan-950 rounded">
                          <span className="text-[#00f2ff]/40">LOCAL TIMEZONE:</span>
                          <span className="text-[#00f2ff] font-bold">UTC_GCP</span>
                        </div>
                        <div className="flex items-center justify-between px-2 py-0.5 bg-cyan-950/15 border border-cyan-950 rounded">
                          <span className="text-[#00f2ff]/40">NETWORK PORT:</span>
                          <span className="text-[#00f2ff] font-bold">3000</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>

          </div>

        </section>

        {/* COLUMN 3 (RIGHT 3 COLS): Hardware Telemetry & Real Event log */}
        <section className="col-span-3 bg-[#050505] flex flex-col p-4 overflow-y-auto">
          <h3 className="text-[10px] uppercase text-cyan-700 border-b border-cyan-900/50 pb-1 mb-3 font-bold flex items-center justify-between">
            <span>Hardware Telemetry</span>
            <Database className="w-3 h-3 text-cyan-600 animate-pulse" />
          </h3>
          
          <div className="space-y-4">
            
            {/* CPU Load bar */}
            <div>
              <div className="flex justify-between text-[10px] mb-1 font-semibold">
                <span>CPU NEURAL CORE</span>
                <span className="text-[#00f2ff] font-bold tabular-nums">{stats.cpuLoad}%</span>
              </div>
              <div className="h-1 bg-cyan-950 border border-cyan-900/10">
                <motion.div 
                  initial={{ width: "34%" }}
                  animate={{ width: `${stats.cpuLoad}%` }}
                  className="h-full bg-[#00f2ff] shadow-[0_0_5px_#00f2ff]" 
                />
              </div>
            </div>

            {/* RAM Progress bar */}
            <div>
              <div className="flex justify-between text-[10px] mb-1 font-semibold">
                <span>MEMORY ALLOCATE</span>
                <span className="text-[#00f2ff] font-bold pr-1">12.4 GB / 16.0 GB</span>
              </div>
              <div className="h-1 bg-cyan-950 border border-cyan-900/10">
                <div className="h-full bg-[#00f2ff] w-[77.5%] shadow-[0_0_5px_#00f2ff]" />
              </div>
            </div>

            {/* Neural Synthesis status */}
            <div>
              <div className="flex justify-between text-[10px] mb-1 font-semibold">
                <span>NEURAL_SYNAPSE_GRID</span>
                <span className="text-amber-500 font-bold animate-pulse">78% INTEGRITY</span>
              </div>
              <div className="h-1 bg-cyan-950 border border-cyan-900/10">
                <div className="h-full bg-amber-500 w-[78%] shadow-[0_0_5px_#ff9900]" />
              </div>
            </div>
          </div>

          <div className="mt-6 flex-1 flex flex-col min-h-[140px] overflow-hidden">
            <h3 className="text-[10px] uppercase text-cyan-700 border-b border-cyan-900/50 pb-1 mb-2 font-bold">
              Dynamic Activity Log
            </h3>
            
            {/* Live react-synchronized active log streams */}
            <div className="flex-1 overflow-y-auto text-[9px] space-y-1 pr-1 font-mono text-cyan-800 leading-tight">
              {eventLogs.map((log, idx) => (
                <p key={idx} className={idx === 0 ? "text-cyan-400 font-bold" : ""}>
                  {log}
                </p>
              ))}
            </div>
          </div>

          <div className="mt-4 border border-cyan-900/60 p-2 text-center text-[10px] text-cyan-600 bg-cyan-950/5 select-all uppercase">
            Distributed sandbox computing link stable // shagun_v46
          </div>
        </section>

      </main>

      {/* NOSTALGIC COMMAND LINE CLI FOOTER AREA */}
      <footer className="h-10 border-t border-[#1a1a1a] flex items-center justify-between bg-[#0a0a0a] px-5 flex-shrink-0">
        <div className="flex items-center space-x-3 text-xs">
          <span className="text-[#00f2ff] font-bold">CMD_IN:</span>
          <span className="text-cyan-100 font-semibold tracking-wider flex items-center select-all cursor-text text-[11px]">
            execute_sequence --mode="artificial_intelligence" --target="self" <span className="animate-pulse font-bold text-[#00f2ff] ml-0.5">_</span>
          </span>
        </div>
        
        <div className="flex items-center space-x-5 text-[9px] uppercase tracking-widest text-[#00f2ff]/40 font-semibold">
          <span>X: 0.342</span>
          <span>Y: -1.229</span>
          <span>Z: 8.121</span>
          <span className="bg-[#00f2ff] text-[#050505] px-1.5 font-bold rounded-sm py-0.5 select-none text-[8px]">TERM-X9</span>
        </div>
      </footer>

    </div>
  );
}
