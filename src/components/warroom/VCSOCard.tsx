import { VCSO_STATS } from "@/data/warroom";

interface Props {
  stats?: typeof VCSO_STATS;
}

export default function VCSOCard({ stats = VCSO_STATS }: Props) {
  const s = stats;
  return (
    <div className="vcso-frame w-full h-full">
      <div className="vcso-frame-inner p-5 flex flex-col items-center text-center">
        {/* Commander avatar */}
        <div
          className="w-24 h-24 rounded-full flex items-center justify-center mb-3 ring-glow relative"
          style={{
            color: "hsl(217 91% 60%)",
            border: "2px solid hsl(217 91% 60%)",
            background:
              "radial-gradient(circle, hsl(217 91% 60% / 0.28), transparent 70%)",
          }}
        >
          <span className="text-3xl">⚔︎</span>
          {/* concentric base rings */}
          <span
            className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-28 h-3 rounded-full opacity-50"
            style={{
              border: "1px solid hsl(217 91% 60% / 0.55)",
              boxShadow: "0 0 12px hsl(217 91% 60% / 0.5)",
            }}
          />
        </div>

        <div className="text-3xl font-bold tracking-[0.2em] mt-2" style={{ color: "hsl(217 91% 60%)" }}>
          VCSO
        </div>
        <div className="text-[11px] text-muted-foreground mt-1">数字首席安全运营官</div>

        <div className="mt-2 flex items-center gap-1.5 text-xs" style={{ color: "hsl(48 96% 60%)" }}>
          <span className="w-1.5 h-1.5 rounded-full pulse-dot" style={{ backgroundColor: "hsl(48 96% 60%)" }} />
          指挥中
        </div>

        <div className="grid grid-cols-2 gap-2 mt-5 w-full">
          <Stat value={`${s.online}专家`} label="在线"       color="142 76% 55%" />
          <Stat value={`${s.health}%`}    label="系统健康度" color="142 76% 55%" />
          <Stat value={`${s.queue}`}      label="任务队列"   color="48 96% 60%"  />
          <Stat value={`${s.latency}ms`}  label="响应"       color="48 96% 60%"  />
        </div>

        <div className="mt-auto pt-5 text-[10px] text-muted-foreground tracking-[0.3em]">
          BUS &nbsp; V4.0
        </div>
      </div>
    </div>
  );
}

function Stat({ value, label, color }: { value: string; label: string; color: string }) {
  return (
    <div className="rounded-md py-2 bg-muted/40 border border-border/60">
      <div className="text-base font-semibold tabular-nums" style={{ color: `hsl(${color})` }}>
        {value}
      </div>
      <div className="text-[10px] text-muted-foreground mt-0.5">{label}</div>
    </div>
  );
}
