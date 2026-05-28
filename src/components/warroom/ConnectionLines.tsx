// Connection overlay built on the same 5×4 grid as Index.tsx.
// Uses a 1600×900 viewBox so stroke widths and arrow markers render at
// real, non-distorted thickness regardless of container size.
import { RELATIONS } from "@/data/warroom";
import { useId } from "react";

interface Props {
  hoveredId?: string | null;
}

// 5 cols (centers 1/10, 3/10, 5/10, 7/10, 9/10) × 4 rows (centers 1/8, 3/8, 5/8, 7/8)
// Container is 1600×900 user units.
const W = 1600;
const H = 900;
const COL_X = [W * 0.1, W * 0.3, W * 0.5, W * 0.7, W * 0.9];
const ROW_Y = [H * 0.125, H * 0.375, H * 0.625, H * 0.875];

// Approximate half-size of an agent card (used to anchor arrows on card edges)
const CARD_HW = 150; // half-width
const CARD_HH = 95;  // half-height
// VCSO is taller (spans rows 2–3)
const VCSO_HW = 110;
const VCSO_HH = 200;

type Pt = { x: number; y: number; hw: number; hh: number };

function anchorOf(id: string): Pt {
  if (id === "VCSO") {
    return { x: COL_X[2], y: H * 0.5, hw: VCSO_HW, hh: VCSO_HH };
  }
  // map id → (col, row) — kept in sync with Index.tsx grid areas
  const map: Record<string, [number, number]> = {
    SODE001: [0, 0], SODE002: [1, 0], SODE003: [3, 0], SODE004: [4, 0],
    SODE005: [0, 1], SODE006: [1, 1], SODE008: [3, 1], SODE009: [4, 1],
    SODE007: [0, 2], SODE012: [4, 2],
    SODE013: [1, 3], SODE010: [2, 3], SODE014: [3, 3],
  };
  const [c, r] = map[id] ?? [2, 1];
  return { x: COL_X[c], y: ROW_Y[r], hw: CARD_HW, hh: CARD_HH };
}

/** Clip a line from p1's box edge to p2's box edge so arrows land on the border. */
function edgePoint(from: Pt, to: Pt) {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  if (dx === 0 && dy === 0) return { x: from.x, y: from.y };
  const sx = dx === 0 ? Infinity : Math.abs(from.hw / dx);
  const sy = dy === 0 ? Infinity : Math.abs(from.hh / dy);
  const t = Math.min(sx, sy);
  return { x: from.x + dx * t, y: from.y + dy * t };
}

const ConnectionLines = ({ hoveredId }: Props) => {
  const uid = useId().replace(/:/g, "");

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      style={{ zIndex: 5 }}
      aria-hidden="true"
    >
      <defs>
        {RELATIONS.map((r, i) => (
          <marker
            key={`m-${i}`}
            id={`arr-${uid}-${i}`}
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
            markerUnits="userSpaceOnUse"
          >
            <path d="M0,0 L10,5 L0,10 Z" fill={`hsl(${r.colorHsl})`} />
          </marker>
        ))}
      </defs>

      {RELATIONS.map((r, i) => {
        const A = anchorOf(r.from);
        const B = anchorOf(r.to);
        const p1 = edgePoint(A, B);
        const p2 = edgePoint(B, A);

        // Bend factor: scale provided "bend" (0..30) into user units for curve.
        const bend = (r.bend ?? 0) * 6;
        const mx = (p1.x + p2.x) / 2;
        const my = (p1.y + p2.y) / 2;
        const ddx = p2.x - p1.x;
        const ddy = p2.y - p1.y;
        const len = Math.max(Math.hypot(ddx, ddy), 1);
        // Perpendicular vector (rotated +90°)
        const nx = -ddy / len;
        const ny = ddx / len;
        const cx = mx + nx * bend;
        const cy = my + ny * bend;

        const d = bend !== 0
          ? `M${p1.x.toFixed(1)},${p1.y.toFixed(1)} Q${cx.toFixed(1)},${cy.toFixed(1)} ${p2.x.toFixed(1)},${p2.y.toFixed(1)}`
          : `M${p1.x.toFixed(1)},${p1.y.toFixed(1)} L${p2.x.toFixed(1)},${p2.y.toFixed(1)}`;

        const color = `hsl(${r.colorHsl})`;
        const isHover = !!hoveredId && (r.from === hoveredId || r.to === hoveredId);
        const dim = !!hoveredId && !isHover;

        const baseOpacity = dim ? 0.12 : isHover ? 1 : 0.85;
        const strokeWidth = isHover ? 3.5 : 2.4;
        const dashArray = r.style === "dashed" ? "9 6" : undefined;

        const pathId = `p-${uid}-${i}`;
        const markerId = `url(#arr-${uid}-${i})`;

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
              markerEnd={markerId}
              markerStart={r.arrow === "double" ? markerId : undefined}
              style={{
                transition: "opacity 240ms, stroke-width 240ms",
                filter: `drop-shadow(0 0 6px ${color})`,
              }}
            />
            {/* Travelling pulse */}
            <circle r={isHover ? 5 : 3.5} fill={color} opacity={dim ? 0.15 : 0.9}>
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

      {/* Decorative concentric base rings under VCSO (matches mockup) */}
      <g opacity="0.35" stroke="hsl(217 91% 60%)" fill="none">
        <ellipse cx={W * 0.5} cy={H * 0.58} rx={220} ry={28} strokeWidth={1.2} />
        <ellipse cx={W * 0.5} cy={H * 0.6}  rx={300} ry={36} strokeWidth={1}   strokeDasharray="4 6" />
      </g>
    </svg>
  );
};

export default ConnectionLines;
