// 动态连接线 - VCSO 居中辐射 + 员工协作弧线
// 支持 hover 高亮：传入 hoveredId 时，与之相关的连线高亮、其它淡出
import { Agent, AGENT_RELATIONS, CATEGORY_META, getRingPosition } from "@/data/warroom";

interface Props {
  agents: Agent[];
  hoveredId?: string | null;
}

const CENTER = { x: 50, y: 50 };

const ConnectionLines = ({ agents, hoveredId }: Props) => {
  const total = agents.length;
  const isHovering = !!hoveredId;

  // 1) 中心 → 员工 辐射连线
  const spokes = agents.map((a) => {
    const p = getRingPosition(a.order, total);
    return {
      id: `spoke-${a.id}`,
      agentId: a.id,
      d: `M${CENTER.x},${CENTER.y} L${p.x.toFixed(2)},${p.y.toFixed(2)}`,
      hsl: CATEGORY_META[a.category].hsl,
      dur: 3 + (a.order % 4) * 0.4,
      begin: (a.order * 0.18).toFixed(2),
    };
  });

  // 2) 员工之间的协作关系
  const relations = AGENT_RELATIONS.map(([from, to], idx) => {
    const af = agents.find((x) => x.id === from);
    const at = agents.find((x) => x.id === to);
    if (!af || !at) return null;
    const p1 = getRingPosition(af.order, total);
    const p2 = getRingPosition(at.order, total);
    const mx = (p1.x + p2.x) / 2;
    const my = (p1.y + p2.y) / 2;
    const dx = mx - CENTER.x;
    const dy = my - CENTER.y;
    const len = Math.max(Math.hypot(dx, dy), 0.001);
    const cx = mx + (dx / len) * 8;
    const cy = my + (dy / len) * 8;
    return {
      id: `rel-${idx}`,
      from,
      to,
      d: `M${p1.x.toFixed(2)},${p1.y.toFixed(2)} Q${cx.toFixed(2)},${cy.toFixed(2)} ${p2.x.toFixed(2)},${p2.y.toFixed(2)}`,
      hsl: CATEGORY_META[af.category].hsl,
      dur: 3.5 + (idx % 3) * 0.5,
      begin: (idx * 0.25).toFixed(2),
    };
  }).filter(Boolean) as Array<{
    id: string; from: string; to: string; d: string; hsl: string; dur: number; begin: string;
  }>;

  /** 判断一个 agent 是否与当前 hover 的 agent 相关（直接相连或 hover 自身） */
  const isRelatedAgent = (id: string) => {
    if (!hoveredId) return false;
    if (id === hoveredId) return true;
    return AGENT_RELATIONS.some(
      ([a, b]) =>
        (a === hoveredId && b === id) || (b === hoveredId && a === id)
    );
  };

  const spokeOpacity = (agentId: string) => {
    if (!isHovering) return 0.32;
    return agentId === hoveredId ? 0.95 : 0.08;
  };

  const relationOpacity = (from: string, to: string) => {
    if (!isHovering) return 0.55;
    return from === hoveredId || to === hoveredId ? 1 : 0.05;
  };

  const relationWidth = (from: string, to: string) => {
    if (!isHovering) return 0.18;
    return from === hoveredId || to === hoveredId ? 0.35 : 0.12;
  };

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      style={{ zIndex: 5 }}
      aria-hidden="true"
    >
      <defs>
        {/* 关系线箭头 marker（每种关系颜色都用同一个，颜色由 stroke 决定） */}
        <marker
          id="rel-arrow"
          viewBox="0 0 6 6"
          refX="5"
          refY="3"
          markerWidth="3"
          markerHeight="3"
          orient="auto-start-reverse"
        >
          <path d="M0,0 L6,3 L0,6 Z" fill="currentColor" />
        </marker>
      </defs>

      {/* 中心装饰圆环 */}
      <circle cx={CENTER.x} cy={CENTER.y} r={6} fill="none" stroke="hsl(48 96% 60% / 0.25)" strokeWidth={0.12} />
      <circle cx={CENTER.x} cy={CENTER.y} r={38} fill="none" stroke="hsl(188 95% 55% / 0.08)" strokeWidth={0.1} strokeDasharray="0.6 0.8" />

      {/* 辐射线 */}
      {spokes.map((c) => (
        <g key={c.id} style={{ transition: "opacity 300ms" }}>
          <path
            id={c.id}
            d={c.d}
            fill="none"
            stroke={`hsl(${c.hsl})`}
            strokeWidth={isHovering && c.agentId === hoveredId ? 0.3 : 0.14}
            opacity={spokeOpacity(c.agentId)}
            style={{ transition: "opacity 300ms, stroke-width 300ms" }}
          />
          <circle r={0.55} fill={`hsl(${c.hsl})`} opacity={spokeOpacity(c.agentId) + 0.1}>
            <animateMotion dur={`${c.dur}s`} repeatCount="indefinite" begin={`${c.begin}s`}>
              <mpath href={`#${c.id}`} />
            </animateMotion>
          </circle>
          <circle r={0.35} fill={`hsl(${c.hsl})`} opacity={spokeOpacity(c.agentId) * 0.6}>
            <animateMotion dur={`${c.dur + 0.6}s`} repeatCount="indefinite" begin={`${parseFloat(c.begin) + 1.2}s`}>
              <mpath href={`#${c.id}`} />
            </animateMotion>
          </circle>
        </g>
      ))}

      {/* 协作关系弧线 + 方向箭头 */}
      {relations.map((c) => {
        const active = c.from === hoveredId || c.to === hoveredId;
        const color = `hsl(${c.hsl})`;
        return (
          <g key={c.id} style={{ color, transition: "opacity 300ms" }}>
            <path
              id={c.id}
              d={c.d}
              fill="none"
              stroke={color}
              strokeWidth={relationWidth(c.from, c.to)}
              strokeDasharray={active ? "none" : "0.7 0.5"}
              opacity={relationOpacity(c.from, c.to)}
              markerEnd="url(#rel-arrow)"
              style={{ transition: "opacity 300ms, stroke-width 300ms" }}
            />
            <circle r={active ? 0.7 : 0.5} fill={color} opacity={Math.min(1, relationOpacity(c.from, c.to) + 0.1)}>
              <animateMotion dur={`${active ? c.dur * 0.6 : c.dur}s`} repeatCount="indefinite" begin={`${c.begin}s`}>
                <mpath href={`#${c.id}`} />
              </animateMotion>
            </circle>
            {active && (
              <circle r={1.1} fill={color} opacity={0.4}>
                <animateMotion dur={`${c.dur * 0.6}s`} repeatCount="indefinite" begin={`${c.begin}s`}>
                  <mpath href={`#${c.id}`} />
                </animateMotion>
              </circle>
            )}
          </g>
        );
      })}

      {/* 暴露给外部的工具方法：哪些 agent 与 hovered 相关（无操作，仅占位说明） */}
      {isHovering &&
        agents
          .filter((a) => isRelatedAgent(a.id))
          .map((a) => {
            const p = getRingPosition(a.order, total);
            return (
              <circle
                key={`halo-${a.id}`}
                cx={p.x}
                cy={p.y}
                r={a.id === hoveredId ? 5 : 4}
                fill="none"
                stroke={`hsl(${CATEGORY_META[a.category].hsl})`}
                strokeWidth={0.2}
                opacity={0.7}
              >
                <animate attributeName="r" values={`${a.id === hoveredId ? 4.5 : 3.5};${a.id === hoveredId ? 6 : 5};${a.id === hoveredId ? 4.5 : 3.5}`} dur="1.6s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.8;0.3;0.8" dur="1.6s" repeatCount="indefinite" />
              </circle>
            );
          })}
    </svg>
  );
};

export default ConnectionLines;
