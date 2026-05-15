import { Agent, CATEGORY_META } from "@/data/warroom";

const STATUS_HSL: Record<Agent["status"], string> = {
  online: "142 76% 50%",
  busy:   "25 95% 60%",
  warn:   "0 85% 62%",
  joined: "188 95% 55%",
};

const STATUS_LABEL: Record<Agent["status"], string> = {
  online: "在线",
  busy:   "繁忙",
  warn:   "告警",
  joined: "已就绪",
};

interface Props {
  agent: Agent;
}

export default function AgentCard({ agent }: Props) {
  const cat = CATEGORY_META[agent.category];
  const ringColor = `hsl(${cat.hsl})`;

  // progress dots (10 dots)
  const totalDots = 10;
  const filled = Math.round((agent.progress / 100) * totalDots);

  return (
    <div className="agent-card p-4 flex flex-col items-center text-center min-h-[200px]">
      {/* small connector node at top */}
      <span
        className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full"
        style={{ backgroundColor: ringColor, boxShadow: `0 0 8px ${ringColor}` }}
      />

      {/* avatar ring */}
      <div
        className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-semibold mb-2 ring-glow"
        style={{
          color: ringColor,
          border: `2px solid ${ringColor}`,
          background: `radial-gradient(circle, hsl(${cat.hsl} / 0.15), transparent 70%)`,
        }}
      >
        <span className="text-foreground/90 text-base">
          {agent.name.slice(0, 1)}
        </span>
      </div>

      <div className="text-sm font-semibold text-foreground/95 leading-tight">
        {agent.name}
      </div>
      <div className="text-[10px] text-muted-foreground tracking-wider mt-0.5">
        {agent.id}
      </div>

      <div
        className="mt-2 px-2 py-0.5 rounded text-[10px] font-medium"
        style={{
          color: ringColor,
          backgroundColor: `hsl(${cat.hsl} / 0.12)`,
          border: `1px solid hsl(${cat.hsl} / 0.4)`,
        }}
      >
        {agent.role}
      </div>

      <div className="text-[11px] text-muted-foreground mt-2">{agent.task}</div>

      {/* progress bar (smooth) with dot ticks overlay */}
      <div className="relative w-full mt-2 px-2">
        <div className="relative h-1.5 rounded-full bg-muted/60 overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 rounded-full transition-all duration-700 ease-out"
            style={{
              width: `${agent.progress}%`,
              backgroundColor: ringColor,
              boxShadow: `0 0 6px ${ringColor}`,
            }}
          />
          {/* tick separators */}
          <div className="absolute inset-0 flex justify-between px-[2px] pointer-events-none">
            {Array.from({ length: totalDots - 1 }).map((_, i) => (
              <span key={i} className="w-px h-full bg-background/60" />
            ))}
          </div>
        </div>
      </div>

      <div className="text-[11px] text-foreground/80 mt-1 tabular-nums transition-colors duration-500">
        {agent.progress}%
      </div>

      {/* status pill at bottom */}
      <div className="mt-auto pt-2 flex items-center gap-1.5 text-[10px] text-muted-foreground">
        <span
          className="w-1.5 h-1.5 rounded-full pulse-dot transition-all duration-500 ease-out"
          style={{
            backgroundColor: `hsl(${STATUS_HSL[agent.status]})`,
            boxShadow: `0 0 6px hsl(${STATUS_HSL[agent.status]})`,
          }}
        />
        <span>{agent.joinDate}</span>
        <span className="opacity-60">· {STATUS_LABEL[agent.status]}</span>
      </div>
    </div>
  );
}
