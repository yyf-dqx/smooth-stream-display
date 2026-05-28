// Connection overlay matching the design mockup.
// Arrows + colors + dashed/solid per RELATIONS, with animated flowing pulses.
import { Agent, RELATIONS, cellToPercent } from "@/data/warroom";
import { useId } from "react";

interface Props {
  agents: Agent[];
  hoveredId?: string | null;
}

const CENTER = { x: 50, y: 50 };

function pointOf(id: string, agents: Agent[]) {
  if (id === "VCSO") return CENTER;
  const a = agents.find((x) => x.id === id);
  if (!a) return CENTER;
  return cellToPercent(a.col, a.row);
}

const ConnectionLines = ({ agents, hoveredId }: Props) => {
  const uid = useId().replace(/:/g, "");

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      style={{ zIndex: 5 }}
      aria-hidden="true"
    >
      <defs>
        {/* One arrow marker per unique color used (we just inline currentColor via marker per relation) */}
        {RELATIONS.map((r, i) => (
          <marker
            key={`m-${i}`}
            id={`arr-${uid}-${i}`}
            viewBox="0 0 8 8"
            refX="6"
            refY="4"
            markerWidth="4"
            markerHeight="4"
            orient="auto-start-reverse"
          >
            <path d="M0,0 L8,4 L0,8 Z" fill={`hsl(${r.colorHsl})`} />
          </marker>
        ))}
      </defs>

      {RELATIONS.map((r, i) => {
        const p1 = pointOf(r.from, agents);
        const p2 = pointOf(r.to, agents);

        // Compute a control point: bend outward from segment midpoint
        const mx = (p1.x + p2.x) / 2;
        const my = (p1.y + p2.y) / 2;
        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        const len = Math.max(Math.hypot(dx, dy), 0.001);
        // perpendicular (left)
        const nx = -dy / len;
        const ny = dx / len;
        const bend = r.bend ?? 0;
        const cx = mx + nx * bend;
        const cy = my + ny * bend;

        const d =
          bend !== 0
            ? `M${p1.x.toFixed(2)},${p1.y.toFixed(2)} Q${cx.toFixed(2)},${cy.toFixed(2)} ${p2.x.toFixed(2)},${p2.y.toFixed(2)}`
            : `M${p1.x.toFixed(2)},${p1.y.toFixed(2)} L${p2.x.toFixed(2)},${p2.y.toFixed(2)}`;

        const color = `hsl(${r.colorHsl})`;
        const isHover =
          !!hoveredId && (r.from === hoveredId || r.to === hoveredId);
        const dim = !!hoveredId && !isHover;

        const baseOpacity = dim ? 0.12 : isHover ? 1 : 0.75;
        const strokeWidth = isHover ? 0.32 : 0.22;
        const dashArray = r.style === "dashed" ? "1.2 0.9" : undefined;

        const pathId = `p-${uid}-${i}`;

        return (
          <g key={i} style={{ transition: "opacity 240ms" }}>
            <path
              id={pathId}
              d={d}
              fill="none"
              stroke={color}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={dashArray}
              opacity={baseOpacity}
              markerEnd={`url(#arr-${uid}-${i})`}
              markerStart={r.arrow === "double" ? `url(#arr-${uid}-${i})` : undefined}
              style={{ transition: "opacity 240ms, stroke-width 240ms" }}
            />
            {/* Flowing pulse traveling along the path */}
            <circle r={isHover ? 0.55 : 0.4} fill={color} opacity={dim ? 0.15 : 0.9}>
              <animateMotion
                dur={`${2.6 + (i % 5) * 0.35}s`}
                repeatCount="indefinite"
                begin={`${(i * 0.22).toFixed(2)}s`}
              >
                <mpath href={`#${pathId}`} />
              </animateMotion>
            </circle>
          </g>
        );
      })}
    </svg>
  );
};

export default ConnectionLines;
