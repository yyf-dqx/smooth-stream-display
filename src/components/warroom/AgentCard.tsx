import { Agent, CATEGORY_META } from "@/data/warroom";
import {
  Database, Shield, GitBranch, Zap, Settings, BarChart3, Search, CheckCircle2, Sparkles, Users,
} from "lucide-react";

const STATUS_HSL: Record<Agent["status"], string> = {
  online: "142 76% 50%",
  busy:   "25 95% 60%",
  warn:   "0 85% 62%",
  joined: "188 95% 55%",
};

const TASK_ICON = {
  db: Database, shield: Shield, flow: GitBranch, bolt: Zap, gear: Settings,
  chart: BarChart3, search: Search, check: CheckCircle2, ai: Sparkles,
} as const;

interface Props { agent: Agent }

export default function AgentCard({ agent }: Props) {
  const cat = CATEGORY_META[agent.category];
  const ringColor = `hsl(${cat.hsl})`;
  const TaskIcon = TASK_ICON[agent.taskIcon] ?? Database;

  const hash = Array.from(agent.id).reduce((s, c) => s + c.charCodeAt(0), 0);
  const floatDelay = -((hash % 60) / 10);
  const floatDuration = 6.5 + (hash % 30) / 10;

  return (
    <div
      className="agent-frame agent-float w-full h-full"
      style={
        {
          ["--frame-h" as never]: cat.hsl,
          animationDelay: `${floatDelay}s`,
          animationDuration: `${floatDuration}s`,
        } as React.CSSProperties
      }
    >
      <div className="agent-frame-inner p-3 flex flex-col h-full">
        {/* Header row */}
        <div className="flex items-start gap-2.5">
          <div
            className="relative w-11 h-11 rounded-full flex items-center justify-center text-sm font-semibold shrink-0 ring-glow"
            style={{
              color: ringColor,
              border: `1.5px solid ${ringColor}`,
              background: `radial-gradient(circle, hsl(${cat.hsl} / 0.28), transparent 70%)`,
            }}
          >
            <span className="text-foreground/95">{agent.name.slice(0, 1)}</span>
            <span
              className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full pulse-dot"
              style={{
                backgroundColor: `hsl(${STATUS_HSL[agent.status]})`,
                boxShadow: `0 0 6px hsl(${STATUS_HSL[agent.status]})`,
              }}
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="text-[13px] font-semibold text-foreground/95 leading-tight truncate">
              {agent.name}
            </div>
            <div className="text-[10px] text-muted-foreground tracking-wider mt-0.5">
              {agent.id}
            </div>
          </div>
        </div>

        {/* Role pill */}
        <div
          className="mt-2 self-start px-2 py-[2px] rounded text-[10px] font-medium"
          style={{
            color: ringColor,
            backgroundColor: `hsl(${cat.hsl} / 0.12)`,
            border: `1px solid hsl(${cat.hsl} / 0.5)`,
          }}
        >
          {agent.role}
        </div>

        {/* Task + progress */}
        <div className="flex items-center gap-1.5 mt-2 text-[11px] text-foreground/85">
          <TaskIcon size={12} style={{ color: ringColor }} />
          <span className="truncate">{agent.task}</span>
          <span className="ml-auto tabular-nums text-foreground/95 transition-colors duration-500">
            {agent.progress}%
          </span>
        </div>

        <div className="relative h-1.5 mt-1.5 rounded-full bg-muted/50 overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 rounded-full transition-all duration-700 ease-out"
            style={{
              width: `${agent.progress}%`,
              background: `linear-gradient(90deg, hsl(${cat.hsl} / 0.55), hsl(${cat.hsl}))`,
              boxShadow: `0 0 8px hsl(${cat.hsl} / 0.8)`,
            }}
          />
        </div>

        {/* Footer */}
        <div className="mt-auto pt-2 flex items-center gap-1.5 text-[10px] text-muted-foreground">
          <Users size={11} style={{ color: ringColor }} />
          <span>{agent.joinDate}</span>
        </div>
      </div>
    </div>
  );
}
