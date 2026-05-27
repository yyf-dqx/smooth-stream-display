// 动态连接线 - VCSO 居中，向所有数字员工辐射；同时绘制员工之间的协作关系
// 路径终点沿用 getRingPosition 计算，保证与卡片位置完全对齐
import { Agent, AGENT_RELATIONS, CATEGORY_META, getRingPosition } from "@/data/warroom";

interface Props {
  agents: Agent[];
}

const CENTER = { x: 50, y: 50 };

/** 为关系网中每条连线分配一个唯一颜色（基于源 agent 的 category） */
function relationColor(fromId: string, agents: Agent[]) {
  const a = agents.find((x) => x.id === fromId);
  if (!a) return "188 95% 55%";
  return CATEGORY_META[a.category].hsl;
}

const ConnectionLines = ({ agents }: Props) => {
  const total = agents.length;

  // 1) 中心 → 每个员工的辐射连线（VCSO 下达指令）
  const spokes = agents.map((a) => {
    const p = getRingPosition(a.order, total);
    return {
      id: `spoke-${a.id}`,
      d: `M${CENTER.x},${CENTER.y} L${p.x.toFixed(2)},${p.y.toFixed(2)}`,
      hsl: CATEGORY_META[a.category].hsl,
      dur: 3 + (a.order % 4) * 0.4,
      begin: (a.order * 0.18).toFixed(2),
    };
  });

  // 2) 员工之间的协作关系（按上传的关系图）
  const relations = AGENT_RELATIONS.map(([from, to], idx) => {
    const af = agents.find((x) => x.id === from);
    const at = agents.find((x) => x.id === to);
    if (!af || !at) return null;
    const p1 = getRingPosition(af.order, total);
    const p2 = getRingPosition(at.order, total);
    // 用经过圆心方向偏移的控制点画弧线，避免直线穿过 VCSO
    const mx = (p1.x + p2.x) / 2;
    const my = (p1.y + p2.y) / 2;
    const dx = mx - CENTER.x;
    const dy = my - CENTER.y;
    const len = Math.max(Math.hypot(dx, dy), 0.001);
    // 控制点向外推 8 个单位形成弧度
    const cx = mx + (dx / len) * 8;
    const cy = my + (dy / len) * 8;
    return {
      id: `rel-${idx}`,
      d: `M${p1.x.toFixed(2)},${p1.y.toFixed(2)} Q${cx.toFixed(2)},${cy.toFixed(2)} ${p2.x.toFixed(2)},${p2.y.toFixed(2)}`,
      hsl: relationColor(from, agents),
      dur: 3.5 + (idx % 3) * 0.5,
      begin: (idx * 0.25).toFixed(2),
    };
  }).filter(Boolean) as Array<{ id: string; d: string; hsl: string; dur: number; begin: string }>;

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      style={{ zIndex: 5 }}
      aria-hidden="true"
    >
      {/* 中心装饰圆环 */}
      <circle cx={CENTER.x} cy={CENTER.y} r={6} fill="none" stroke="hsl(48 96% 60% / 0.25)" strokeWidth={0.12} />
      <circle cx={CENTER.x} cy={CENTER.y} r={38} fill="none" stroke="hsl(188 95% 55% / 0.08)" strokeWidth={0.1} strokeDasharray="0.6 0.8" />

      {/* VCSO → 员工 的辐射线 */}
      {spokes.map((c) => (
        <g key={c.id}>
          <path
            id={c.id}
            d={c.d}
            fill="none"
            stroke={`hsl(${c.hsl})`}
            strokeWidth={0.14}
            opacity={0.32}
          />
          <circle r={0.55} fill={`hsl(${c.hsl})`} opacity={0.9}>
            <animateMotion dur={`${c.dur}s`} repeatCount="indefinite" begin={`${c.begin}s`}>
              <mpath href={`#${c.id}`} />
            </animateMotion>
          </circle>
          <circle r={0.35} fill={`hsl(${c.hsl})`} opacity={0.55}>
            <animateMotion dur={`${c.dur + 0.6}s`} repeatCount="indefinite" begin={`${parseFloat(c.begin) + 1.2}s`}>
              <mpath href={`#${c.id}`} />
            </animateMotion>
          </circle>
        </g>
      ))}

      {/* 员工之间的协作关系连线 */}
      {relations.map((c) => (
        <g key={c.id}>
          <path
            id={c.id}
            d={c.d}
            fill="none"
            stroke={`hsl(${c.hsl})`}
            strokeWidth={0.18}
            strokeDasharray="0.7 0.5"
            opacity={0.55}
          />
          <circle r={0.5} fill={`hsl(${c.hsl})`} opacity={0.95}>
            <animateMotion dur={`${c.dur}s`} repeatCount="indefinite" begin={`${c.begin}s`}>
              <mpath href={`#${c.id}`} />
            </animateMotion>
          </circle>
        </g>
      ))}
    </svg>
  );
};

export default ConnectionLines;
