export type AgentCategory =
  | "data-ingest"
  | "data-governance"
  | "triage"
  | "ops-l1"
  | "investigation-dispatch"
  | "investigation-analysis"
  | "response"
  | "vuln-mining"
  | "vuln-validation"
  | "asset-ops"
  | "ops-decision"
  | "ai-assess"
  | "ai-protect";

export interface Agent {
  id: string;
  name: string;
  role: string;
  task: string;
  taskIcon: "db" | "shield" | "flow" | "bolt" | "gear" | "chart" | "search" | "check" | "ai";
  category: AgentCategory;
  progress: number;
  status: "online" | "busy" | "warn" | "joined";
  joinDate: string;
  /** Grid cell (1-based) — 5 columns x 4 rows */
  col: number;
  row: number;
}

/** Edge styles for the relationship overlay */
export type RelationStyle = "solid" | "dashed";
export type RelationArrow = "single" | "double";

export interface Relation {
  from: string;       // agent id or "VCSO"
  to: string;
  colorHsl: string;   // hsl triplet
  style: RelationStyle;
  arrow: RelationArrow;
  /** Optional curve bend amount (positive = bend "outward") */
  bend?: number;
}

export const CATEGORY_META: Record<
  AgentCategory,
  { label: string; hsl: string }
> = {
  "data-ingest":            { label: "数据接入",   hsl: "188 95% 55%" },
  "data-governance":        { label: "数据治理",   hsl: "217 91% 60%" },
  triage:                   { label: "分诊降噪",   hsl: "25 95% 60%"  },
  "ops-l1":                 { label: "一线运营",   hsl: "142 76% 55%" },
  "investigation-dispatch": { label: "调度研判",   hsl: "270 85% 65%" },
  "investigation-analysis": { label: "调查研判",   hsl: "270 85% 65%" },
  response:                 { label: "响应执行",   hsl: "0 85% 62%"   },
  "vuln-mining":            { label: "漏洞挖掘",   hsl: "142 76% 55%" },
  "vuln-validation":        { label: "漏洞验证",   hsl: "30 95% 58%"  },
  "asset-ops":              { label: "资产运营",   hsl: "217 91% 60%" },
  "ops-decision":           { label: "运营决策",   hsl: "48 96% 60%"  },
  "ai-assess":              { label: "AI安全治理", hsl: "180 90% 55%" },
  "ai-protect":             { label: "AI安全治理", hsl: "180 90% 55%" },
};

/** Legend rendered at the bottom — order & colors match the mockup. */
export const LEGEND: Array<{ label: string; hsl: string }> = [
  { label: "数据接入",   hsl: "188 95% 55%" },
  { label: "数据治理",   hsl: "217 91% 60%" },
  { label: "分诊降噪",   hsl: "25 95% 60%"  },
  { label: "一线运营",   hsl: "142 76% 55%" },
  { label: "调度研判",   hsl: "270 85% 65%" },
  { label: "响应执行",   hsl: "0 85% 62%"   },
  { label: "漏洞挖掘",   hsl: "142 76% 55%" },
  { label: "漏洞验证",   hsl: "30 95% 58%"  },
  { label: "资产运营",   hsl: "217 91% 60%" },
  { label: "运营决策",   hsl: "48 96% 60%"  },
  { label: "AI安全治理", hsl: "180 90% 55%" },
];

// Agents arranged on a 5-column x 4-row grid, mirroring the design mockup.
export const AGENTS: Agent[] = [
  // Row 1
  { id: "SODE001", name: "语义接入助手",       role: "解析工程师",   task: "数据接入",   taskIcon: "db",     category: "data-ingest",            progress: 85, status: "online", joinDate: "0530入职", col: 1, row: 1 },
  { id: "SODE002", name: "元数据治理官",       role: "治理工程师",   task: "数据治理",   taskIcon: "db",     category: "data-governance",        progress: 72, status: "online", joinDate: "0630入职", col: 2, row: 1 },
  { id: "SODE003", name: "策略自治专家",       role: "策略工程师",   task: "分诊降噪",   taskIcon: "shield", category: "triage",                 progress: 68, status: "online", joinDate: "0830入职", col: 4, row: 1 },
  { id: "SODE004", name: "安全运营L1",         role: "运营专员",     task: "一线运营",   taskIcon: "flow",   category: "ops-l1",                 progress: 98, status: "joined", joinDate: "已入职",   col: 5, row: 1 },
  // Row 2
  { id: "SODE005", name: "调度编排专家",       role: "调度工程师",   task: "调度研判",   taskIcon: "gear",   category: "investigation-dispatch", progress: 55, status: "online", joinDate: "0730入职", col: 1, row: 2 },
  { id: "SODE006", name: "研判分析专家",       role: "研判工程师",   task: "调查研判",   taskIcon: "chart",  category: "investigation-analysis", progress: 48, status: "busy",   joinDate: "0930入职", col: 2, row: 2 },
  { id: "SODE008", name: "代码审计专家",       role: "审计工程师",   task: "漏洞挖掘",   taskIcon: "search", category: "vuln-mining",            progress: 78, status: "online", joinDate: "0930入职", col: 4, row: 2 },
  { id: "SODE009", name: "漏洞研判专家",       role: "漏洞工程师",   task: "漏洞验证",   taskIcon: "check", category: "vuln-validation",         progress: 82, status: "joined", joinDate: "已入职",   col: 5, row: 2 },
  // Row 3
  { id: "SODE007", name: "响应联动专家",       role: "响应工程师",   task: "响应执行",   taskIcon: "bolt",   category: "response",               progress: 65, status: "warn",   joinDate: "1030入职", col: 1, row: 3 },
  { id: "SODE012", name: "运营有效性验证专家", role: "验证工程师",   task: "运营改进",   taskIcon: "chart",  category: "ops-decision",           progress: 58, status: "joined", joinDate: "已入职",   col: 5, row: 3 },
  // Row 4
  { id: "SODE013", name: "智能体安全评估专家", role: "AI评估工程师", task: "AI安全治理", taskIcon: "shield", category: "ai-assess",              progress: 88, status: "joined", joinDate: "已入职",   col: 2, row: 4 },
  { id: "SODE010", name: "资产确权助手",       role: "资产工程师",   task: "资产运营",   taskIcon: "db",     category: "asset-ops",              progress: 78, status: "online", joinDate: "0730入职", col: 3, row: 4 },
  { id: "SODE014", name: "智能安全防护专家",   role: "AI防护工程师", task: "AI安全治理", taskIcon: "shield", category: "ai-protect",             progress: 92, status: "joined", joinDate: "已入职",   col: 4, row: 4 },
];

/** Inter-agent / agent–VCSO connections, mirroring the arrows on the design. */
export const RELATIONS: Relation[] = [
  // Row 1
  { from: "SODE001", to: "SODE002", colorHsl: "188 95% 55%", style: "solid",  arrow: "double" },
  { from: "SODE002", to: "SODE003", colorHsl: "217 91% 60%", style: "dashed", arrow: "single", bend: -18 }, // curves over the top
  { from: "SODE003", to: "SODE004", colorHsl: "25 95% 60%",  style: "solid",  arrow: "double" },
  // Row 2 + spokes
  { from: "SODE005", to: "SODE006", colorHsl: "270 85% 65%", style: "solid",  arrow: "double" },
  { from: "SODE006", to: "VCSO",    colorHsl: "217 91% 60%", style: "solid",  arrow: "single" },
  { from: "SODE008", to: "VCSO",    colorHsl: "142 76% 55%", style: "solid",  arrow: "single" },
  { from: "SODE008", to: "SODE009", colorHsl: "142 76% 55%", style: "solid",  arrow: "double" },
  // Row 3 — curved spokes into/out of VCSO
  { from: "SODE007", to: "VCSO",    colorHsl: "0 85% 62%",   style: "dashed", arrow: "single", bend: 6 },
  { from: "VCSO",    to: "SODE012", colorHsl: "48 96% 60%",  style: "dashed", arrow: "single", bend: 6 },
  // Row 4
  { from: "VCSO",    to: "SODE010", colorHsl: "217 91% 60%", style: "solid",  arrow: "double" },
  { from: "SODE013", to: "SODE010", colorHsl: "188 95% 55%", style: "solid",  arrow: "double" },
  { from: "SODE010", to: "SODE014", colorHsl: "188 95% 55%", style: "solid",  arrow: "double" },
];

/** Convert a grid cell to percentage coordinates inside the constellation. */
export function cellToPercent(col: number, row: number, cols = 5, rows = 4) {
  // Pad inset so cards don't touch edges
  const padX = 10;
  const padY = 12;
  const usableX = 100 - padX * 2;
  const usableY = 100 - padY * 2;
  const x = padX + ((col - 0.5) / cols) * usableX;
  const y = padY + ((row - 0.5) / rows) * usableY;
  return { x, y };
}

export const VCSO_STATS = {
  online: 14,
  health: 95,
  queue: 186,
  latency: 12,
  version: "BUS v4.0",
};

/** Kept for backwards compatibility with any older imports. */
export const AGENT_RELATIONS: Array<[string, string]> = RELATIONS
  .filter((r) => r.from !== "VCSO" && r.to !== "VCSO")
  .map((r) => [r.from, r.to]);

export function getRingPosition(order: number, total: number) {
  const a = (-90 + (order * 360) / total) * (Math.PI / 180);
  return { x: 50 + 38 * Math.cos(a), y: 50 + 40 * Math.sin(a), angle: a };
}
