import { useEffect, useState } from "react";

export default function WarroomHeader() {
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
        <Stat dot="142 76% 55%" label="14 在线" />
        <Stat dot="48 96% 60%"  label="8,294 任务/时" valueColor="48 96% 60%" />
        <Stat dot="142 76% 55%" label="系统正常" />
      </div>

      <div className="ml-auto text-sm font-mono text-foreground/80 tabular-nums">
        {time}
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
      <span style={valueColor ? { color: `hsl(${valueColor})` } : undefined}>
        {label}
      </span>
    </div>
  );
}

function formatTime(d: Date) {
  const p = (n: number) => n.toString().padStart(2, "0");
  return `${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
}
