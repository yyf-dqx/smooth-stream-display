import { VCSO_STATS } from "@/data/warroom";

interface Props {
  stats?: typeof VCSO_STATS;
}

export default function VCSOCard({ stats = VCSO_STATS }: Props) {
  const s = stats;
  return (
    <div className="vcso-card p-5 flex flex-col items-center text-center h-full">
      <div
        className="w-20 h-20 rounded-full flex items-center justify-center mb-3 ring-glow"
        style={{
          color: "hsl(48 96% 60%)",
          border: "2px solid hsl(48 96% 60%)",
          background:
            "radial-gradient(circle, hsl(48 96% 60% / 0.18), transparent 70%)",
        }}
      >
        <span className="text-2xl">⚡</span>
      </div>

      <div className="text-2xl font-bold tracking-widest" style={{ color: "hsl(48 96% 60%)" }}>
        VCSO
      </div>
      <div className="text-xs text-muted-foreground mt-1">数字首席安全运营官</div>

      <div className="mt-2 flex items-center gap-1.5 text-xs" style={{ color: "hsl(48 96% 60%)" }}>
        <span className="w-1.5 h-1.5 rounded-full pulse-dot" style={{ backgroundColor: "hsl(48 96% 60%)" }} />
        指挥中
      </div>

      <div className="grid grid-cols-2 gap-2 mt-5 w-full">
        <Stat value={`${s.online}专家`} label="在线" color="142 76% 55%" />
        <Stat value={`${s.health}%`}   label="系统健康" color="142 76% 55%" />
        <Stat value={`${s.queue}`}     label="任务队列" color="48 96% 60%" />
        <Stat value={`${s.latency}ms`} label="响应"     color="48 96% 60%" />
      </div>

      <div className="mt-auto pt-4 text-[10px] text-muted-foreground tracking-widest">
        {s.version}
      </div>
    </div>
  );
}

function Stat({ value, label, color }: { value: string; label: string; color: string }) {
  return (
    <div className="rounded-md py-2 bg-muted/40 border border-border/60 transition-colors">
      <div className="text-base font-semibold tabular-nums" style={{ color: `hsl(${color})` }}>
        {value}
      </div>
      <div className="text-[10px] text-muted-foreground mt-0.5">{label}</div>
    </div>
  );
}
