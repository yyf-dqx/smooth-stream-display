import { VCSO_STATS } from "@/data/warroom";

interface Props { stats?: typeof VCSO_STATS }

export default function VCSOCard({ stats = VCSO_STATS }: Props) {
  const s = stats;
  return (
    <div className="vcso-frame w-full h-full">
      <div className="vcso-frame-inner p-4 flex flex-col items-center text-center h-full">
        {/* Commander avatar */}
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center mt-1 mb-2 ring-glow relative"
          style={{
            color: "hsl(217 91% 60%)",
            border: "2px solid hsl(217 91% 60%)",
            background:
              "radial-gradient(circle, hsl(217 91% 60% / 0.32), transparent 70%)",
          }}
        >
          <span className="text-2xl">⚔︎</span>
        </div>

        <div className="text-2xl font-bold tracking-[0.18em]" style={{ color: "hsl(217 91% 60%)" }}>
          VCOS
        </div>
        <div className="text-[10px] text-muted-foreground mt-1">数字首席安全运营官</div>

        <div className="mt-1.5 flex items-center gap-1.5 text-[11px]" style={{ color: "hsl(48 96% 60%)" }}>
          <span className="w-1.5 h-1.5 rounded-full pulse-dot" style={{ backgroundColor: "hsl(48 96% 60%)" }} />
          指挥中
        </div>

        <div className="grid grid-cols-2 gap-1.5 mt-3 w-full">
          <Stat value={`${s.online}专家`} label="在线"       color="142 76% 55%" />
          <Stat value={`${s.health}%`}    label="系统健康度" color="142 76% 55%" />
          <Stat value={`${s.queue}`}      label="任务队列"   color="48 96% 60%"  />
          <Stat value={`${s.latency}ms`}  label="响应"       color="48 96% 60%"  />
        </div>

        <div className="mt-auto pt-3 text-[10px] text-muted-foreground tracking-[0.3em]">
          BUS &nbsp; V4.0
        </div>
      </div>
    </div>
  );
}

function Stat({ value, label, color }: { value: string; label: string; color: string }) {
  return (
    <div className="rounded-md py-1.5 bg-muted/40 border border-border/60">
      <div className="text-sm font-semibold tabular-nums" style={{ color: `hsl(${color})` }}>
        {value}
      </div>
      <div className="text-[10px] text-muted-foreground mt-0.5">{label}</div>
    </div>
  );
}
