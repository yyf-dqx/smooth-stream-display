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
  pollInterval?: number; // ms - 默认间隔
  pollTimeout?: number;  // ms - 单次请求超时
  pollMaxInterval?: number; // ms - 退避上限
  /** websocket URL */
  wsUrl?: string;
  wsMaxRetries?: number;     // 最大重连次数
  wsBaseRetryDelay?: number; // 初始重连延迟
  wsMaxRetryDelay?: number;  // 最大重连延迟
}

const STATUSES: Agent["status"][] = ["online", "busy", "warn", "joined"];

export function useWarroomRealtime(opts: UseWarroomRealtimeOptions = {}) {
  const {
    mode = "mock",
    pollUrl,
    pollInterval = 3000,
    pollTimeout = 5000,
    pollMaxInterval = 30000,
    wsUrl,
    wsMaxRetries = 8,
    wsBaseRetryDelay = 1000,
    wsMaxRetryDelay = 30000,
  } = opts;

  const [agents, setAgents] = useState<Agent[]>(INITIAL_AGENTS);
  const [stats, setStats] = useState(INITIAL_STATS);
  const [connected, setConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<number | null>(null);

  const wsRef = useRef<WebSocket | null>(null);
  const wsRetryRef = useRef(0);
  const wsReconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wsManuallyClosedRef = useRef(false);

  const pollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pollFailRef = useRef(0);

  const mockTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

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
    INITIAL_AGENTS.forEach((a) => {
      if (Math.random() > 0.7) {
        const delta = Math.floor(Math.random() * 7) - 2;
        const u: AgentUpdate & { _delta?: number } = {
          id: a.id,
          status:
            Math.random() > 0.85
              ? STATUSES[Math.floor(Math.random() * STATUSES.length)]
              : undefined,
        };
        u._delta = delta;
        updates.push(u);
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
    // ---- cleanup all prior ----
    const cleanup = () => {
      if (mockTimerRef.current) clearInterval(mockTimerRef.current);
      mockTimerRef.current = null;
      if (pollTimerRef.current) clearTimeout(pollTimerRef.current);
      pollTimerRef.current = null;
      if (wsReconnectTimerRef.current) clearTimeout(wsReconnectTimerRef.current);
      wsReconnectTimerRef.current = null;
      if (wsRef.current) {
        wsManuallyClosedRef.current = true;
        wsRef.current.close();
        wsRef.current = null;
      }
    };

    cleanup();
    wsManuallyClosedRef.current = false;
    pollFailRef.current = 0;
    wsRetryRef.current = 0;

    // ---------- MOCK ----------
    if (mode === "mock") {
      setConnected(true);
      mockTimerRef.current = setInterval(() => {
        applyMockPayload(generateMockTick());
      }, 2000);
      return () => {
        cleanup();
        setConnected(false);
      };
    }

    // ---------- POLLING with exponential backoff + timeout ----------
    if (mode === "polling" && pollUrl) {
      setConnected(true);

      const computeDelay = () => {
        if (pollFailRef.current === 0) return pollInterval;
        // 指数退避: interval * 2^(fails-1)，封顶
        const backoff = pollInterval * Math.pow(2, pollFailRef.current - 1);
        return Math.min(backoff, pollMaxInterval);
      };

      const schedule = () => {
        if (pollTimerRef.current) clearTimeout(pollTimerRef.current);
        pollTimerRef.current = setTimeout(fetchOnce, computeDelay());
      };

      const fetchOnce = async () => {
        const ctrl = new AbortController();
        const to = setTimeout(() => ctrl.abort(), pollTimeout);
        try {
          const res = await fetch(pollUrl, { signal: ctrl.signal });
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const data: RealtimePayload = await res.json();
          // 成功：重置失败计数，恢复默认间隔
          if (pollFailRef.current > 0) {
            console.info("[warroom] poll recovered, resume default interval");
          }
          pollFailRef.current = 0;
          setConnected(true);
          applyPayload(data);
        } catch (e) {
          pollFailRef.current += 1;
          setConnected(false);
          console.warn(
            `[warroom] poll failed (#${pollFailRef.current}), next in ${computeDelay()}ms`,
            e
          );
        } finally {
          clearTimeout(to);
          schedule();
        }
      };

      fetchOnce();
      return () => {
        cleanup();
        setConnected(false);
      };
    }

    // ---------- WEBSOCKET with auto-reconnect + exponential backoff ----------
    if (mode === "websocket" && wsUrl) {
      const connect = () => {
        try {
          const ws = new WebSocket(wsUrl);
          wsRef.current = ws;

          ws.onopen = () => {
            wsRetryRef.current = 0;
            setConnected(true);
            console.info("[warroom] ws connected");
          };
          ws.onmessage = (ev) => {
            try {
              const data: RealtimePayload = JSON.parse(ev.data);
              applyPayload(data);
            } catch (e) {
              console.error("[warroom] ws parse failed", e);
            }
          };
          ws.onerror = (e) => console.error("[warroom] ws error", e);
          ws.onclose = () => {
            setConnected(false);
            wsRef.current = null;
            if (wsManuallyClosedRef.current) return;
            if (wsRetryRef.current >= wsMaxRetries) {
              console.error(
                `[warroom] ws reached max retries (${wsMaxRetries}), giving up`
              );
              return;
            }
            const delay = Math.min(
              wsBaseRetryDelay * Math.pow(2, wsRetryRef.current),
              wsMaxRetryDelay
            );
            wsRetryRef.current += 1;
            console.warn(
              `[warroom] ws disconnected, retry #${wsRetryRef.current} in ${delay}ms`
            );
            wsReconnectTimerRef.current = setTimeout(connect, delay);
          };
        } catch (e) {
          console.error("[warroom] ws init failed", e);
        }
      };

      connect();
      return () => {
        cleanup();
        setConnected(false);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, pollUrl, pollInterval, pollTimeout, pollMaxInterval, wsUrl, wsMaxRetries, wsBaseRetryDelay, wsMaxRetryDelay]);

  return { agents, stats, connected, lastUpdate };
}
