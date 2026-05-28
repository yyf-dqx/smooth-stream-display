import { Agent, CATEGORY_META } from "@/data/warroom";
import {
  Database, Shield, GitBranch, Zap, Settings, BarChart3, Search, CheckCircle2, Sparkles,
} from "lucide-react";

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

const TASK_ICON = {
  db: Database,
  shield: Shield,
  flow: GitBranch,
  bolt: Zap,
  gear: Settings,
  chart: BarChart3,
  search: Search,
  check: CheckCircle2,
  ai: Sparkles,
} as const;

interface Props {
  agent: Agent;
}

export default function AgentCard({ agent }: Props) {
  const cat = CATEGORY_META[agent.category];
  const ringColor = `hsl(${cat.hsl})`;
  const TaskIcon = TASK_ICON[agent.taskIcon] ?? Database;

  // Per-card float variance keyed off id (kept very subtle so cards stay aligned with lines)
  const hash = Array.from(agent.id).reduce((s, c) => s + c.charCodeAt(0), 0);
  const floatDelay = -((hash % 60) / 10);
  const floatDuration = 6.5 + (hash % 30) / 10;

  return (
    <div
      className="agent-frame agent-float w-full"
      style={
        {
          ["--frame-h" as never]: cat.hsl,
          animationDelay: `${floatDelay}s`,
          animationDuration: `${floatDuration}s`,
        } as React.CSSProperties
      }
    >
      <div className="agent-frame-inner p-3.5 flex flex-col">
        {/* Header: avatar + name + id + role */}
        <div className="flex items-start gap-3">
          <div
            className="relative w-12 h-12 rounded-full flex items-center justify-center text-sm font-semibold shrink-0 ring-glow"
            style={{
              color: ringColor,
              border: `1.5px solid ${ringColor}`,
              background: `radial-gradient(circle, hsl(${cat.hsl} / 0.25), transparent 70%)`,
            }}
          >
            <span className="text-foreground/95">{agent.name.slice(0, 1)}</span>
            {/* status pulse dot on avatar */}
            <span
              className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full pulse-dot"
              style={{
                backgroundColor: `hsl(${STATUS_HSL[agent.status]})`,
                boxShadow: `0 0 6px hsl(${STATUS_HSL[agent.status]})`,
              }}
              aria-label={STATUS_LABEL[agent.status]}
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="text-[13px] font-semibold text-foreground/95 leading-tight truncate">
              {agent.name}
            </div>
            <div className="text-[10px] text-muted-foreground tracking-wider mt-0.5">
              {agent.id}
            </div>
            <div
              className="mt-1.5 inline-block px-1.5 py-[1px] rounded text-[10px] font-medium"
              style={{
                color: ringColor,
                backgroundColor: `hsl(${cat.hsl} / 0.12)`,
                border: `1px solid hsl(${cat.hsl} / 0.5)`,
              }}
            >
              {agent.role}
            </div>
          </div>
        </div>

        {/* Task row with icon */}
        <div className="flex items-center gap-1.5 mt-3 text-[11px] text-foreground/80">
          <TaskIcon size={12} style={{ color: ringColor }} />
          <span>{agent.task}</span>
          <span className="ml-auto tabular-nums text-foreground/90 transition-colors duration-500">
            {agent.progress}%
          </span>
        </div>

        {/* Progress bar — gradient fill, smooth */}
        <div className="relative h-1.5 mt-1.5 rounded-full bg-muted/50 overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 rounded-full transition-all duration-700 ease-out"
            style={{
              width: `${agent.progress}%`,
              background: `linear-gradient(90deg, hsl(${cat.hsl} / 0.5), hsl(${cat.hsl}))`,
              boxShadow: `0 0 8px hsl(${cat.hsl} / 0.8)`,
            }}
          />
        </div>

        {/* Footer — join date */}
        <div className="mt-2.5 flex items-center gap-1.5 text-[10px] text-muted-foreground">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: ringColor }}>
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
          <span>{agent.joinDate}</span>
        </div>
      </div>
    </div>
  );
}
