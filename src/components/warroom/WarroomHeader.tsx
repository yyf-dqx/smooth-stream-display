import { useEffect, useState } from "react";

interface Props {
  online?: number;
  tasksPerHour?: number;
  systemHealthy?: boolean;
  connected?: boolean;
  lastUpdate?: number | null;
}

export default function WarroomHeader({
  online = 14,
  tasksPerHour = 8294,
  systemHealthy = true,
  connected = false,
  lastUpdate = null,
}: Props) {
  const [time, setTime] = useState(formatTime(new Date()));
  useEffect(() => {
    const t = setInterval(() => setTime(formatTime(new Date())), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <header className="relative h-14 flex items-center px-6 border-b border-border/60 bg-card/40 backdrop-blur">
      <div className="flex items-center gap-2">
        <span className="text-primary font-bold text-lg tracking-wider">赤宵</span>
        <span className="text-foreground/90 text-sm">数字员工作战室</span>
      </div>

      <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-6 text-xs">
        <Stat dot="142 76% 55%" label={`${online} 在线`} />
        <Stat dot="48 96% 60%"  label={`${tasksPerHour.toLocaleString()} 任务/时`} valueColor="48 96% 60%" />
        <Stat
          dot={systemHealthy ? "142 76% 55%" : "0 85% 62%"}
          label={systemHealthy ? "系统正常" : "系统异常"}
        />
      </div>

      <div className="ml-auto flex items-center gap-4">
        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <span
            className={`w-1.5 h-1.5 rounded-full ${connected ? "pulse-dot" : ""}`}
            style={{
              backgroundColor: connected
                ? "hsl(142 76% 55%)"
                : "hsl(215 20% 45%)",
              boxShadow: connected ? "0 0 6px hsl(142 76% 55%)" : "none",
            }}
          />
          <span>{connected ? "实时连接" : "未连接"}</span>
          {lastUpdate && (
            <span className="opacity-60 ml-1">
              {formatTime(new Date(lastUpdate))}
            </span>
          )}
        </div>
        <div className="text-sm font-mono text-foreground/80 tabular-nums">{time}</div>
      </div>
    </header>
  );
}

function Stat({ dot, label, valueColor }: { dot: string; label: string; valueColor?: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span
        className="w-1.5 h-1.5 rounded-full pulse-dot"
        style={{ backgroundColor: `hsl(${dot})`, boxShadow: `0 0 6px hsl(${dot})` }}
      />
      <span style={valueColor ? { color: `hsl(${valueColor})` } : undefined}>{label}</span>
    </div>
  );
}

function formatTime(d: Date) {
  const p = (n: number) => n.toString().padStart(2, "0");
  return `${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
}
