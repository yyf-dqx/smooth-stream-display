import { useEffect, useRef, useState } from "react";
import { AGENTS as INITIAL_AGENTS, VCSO_STATS as INITIAL_STATS, Agent } from "@/data/warroom";

export type RealtimeMode = "mock" | "polling" | "websocket";

export interface AgentUpdate {
  id: string;
  progress?: number;
  status?: Agent["status"];
}

export interface RealtimePayload {
  agents?: AgentUpdate[];
  stats?: Partial<typeof INITIAL_STATS>;
}

export interface UseWarroomRealtimeOptions {
  mode?: RealtimeMode;
  /** polling URL — GET, returns RealtimePayload */
  pollUrl?: string;
  pollInterval?: number; // ms
  /** websocket URL — sends RealtimePayload messages */
  wsUrl?: string;
}

const STATUSES: Agent["status"][] = ["online", "busy", "warn", "joined"];

export function useWarroomRealtime(opts: UseWarroomRealtimeOptions = {}) {
  const { mode = "mock", pollUrl, pollInterval = 3000, wsUrl } = opts;

  const [agents, setAgents] = useState<Agent[]>(INITIAL_AGENTS);
  const [stats, setStats] = useState(INITIAL_STATS);
  const [connected, setConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<number | null>(null);

  const wsRef = useRef<WebSocket | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const applyPayload = (payload: RealtimePayload) => {
    if (payload.agents?.length) {
      setAgents((prev) =>
        prev.map((a) => {
          const u = payload.agents!.find((x) => x.id === a.id);
          if (!u) return a;
          return {
            ...a,
            progress: u.progress ?? a.progress,
            status: u.status ?? a.status,
          };
        })
      );
    }
    if (payload.stats) setStats((prev) => ({ ...prev, ...payload.stats }));
    setLastUpdate(Date.now());
  };

  // -------- mock generator --------
  const generateMockTick = (): RealtimePayload => {
    const updates: AgentUpdate[] = [];
    // Update ~30% of agents per tick
    INITIAL_AGENTS.forEach((a) => {
      if (Math.random() > 0.7) {
        const delta = Math.floor(Math.random() * 7) - 2; // -2 ~ +4
        updates.push({
          id: a.id,
          progress: undefined,
          status:
            Math.random() > 0.85
              ? STATUSES[Math.floor(Math.random() * STATUSES.length)]
              : undefined,
        });
        // compute new progress relative to current
        updates[updates.length - 1].progress = undefined;
        updates[updates.length - 1] = {
          ...updates[updates.length - 1],
          // resolve progress later in setAgents to use latest
        };
        // store delta in a side-channel via custom field
        (updates[updates.length - 1] as any)._delta = delta;
      }
    });

    return {
      agents: updates,
      stats: {
        queue: Math.max(50, INITIAL_STATS.queue + Math.floor(Math.random() * 60 - 30)),
        latency: Math.max(5, 12 + Math.floor(Math.random() * 10 - 5)),
        health: Math.min(100, Math.max(80, 95 + Math.floor(Math.random() * 6 - 3))),
      },
    };
  };

  const applyMockPayload = (payload: RealtimePayload) => {
    setAgents((prev) =>
      prev.map((a) => {
        const u = payload.agents?.find((x) => x.id === a.id);
        if (!u) return a;
        const delta = (u as any)._delta ?? 0;
        const next = Math.min(100, Math.max(0, a.progress + delta));
        return { ...a, progress: next, status: u.status ?? a.status };
      })
    );
    if (payload.stats) setStats((prev) => ({ ...prev, ...payload.stats }));
    setLastUpdate(Date.now());
  };

  useEffect(() => {
    // cleanup any prior
    if (timerRef.current) clearInterval(timerRef.current);
    if (wsRef.current) wsRef.current.close();
    wsRef.current = null;

    if (mode === "mock") {
      setConnected(true);
      timerRef.current = setInterval(() => {
        applyMockPayload(generateMockTick());
      }, 2000);
      return () => {
        if (timerRef.current) clearInterval(timerRef.current);
        setConnected(false);
      };
    }

    if (mode === "polling" && pollUrl) {
      setConnected(true);
      const fetchOnce = async () => {
        try {
          const res = await fetch(pollUrl);
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const data: RealtimePayload = await res.json();
          applyPayload(data);
        } catch (e) {
          console.error("[warroom] poll failed", e);
        }
      };
      fetchOnce();
      timerRef.current = setInterval(fetchOnce, pollInterval);
      return () => {
        if (timerRef.current) clearInterval(timerRef.current);
        setConnected(false);
      };
    }

    if (mode === "websocket" && wsUrl) {
      try {
        const ws = new WebSocket(wsUrl);
        wsRef.current = ws;
        ws.onopen = () => setConnected(true);
        ws.onclose = () => setConnected(false);
        ws.onerror = (e) => console.error("[warroom] ws error", e);
        ws.onmessage = (ev) => {
          try {
            const data: RealtimePayload = JSON.parse(ev.data);
            applyPayload(data);
          } catch (e) {
            console.error("[warroom] ws parse failed", e);
          }
        };
      } catch (e) {
        console.error("[warroom] ws init failed", e);
      }
      return () => {
        wsRef.current?.close();
        wsRef.current = null;
        setConnected(false);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, pollUrl, pollInterval, wsUrl]);

  return { agents, stats, connected, lastUpdate };
}
