export type AgentCategory =
  | "data-ingest"
  | "data-governance"
  | "triage"
  | "ops-l1"
  | "investigation"
  | "response"
  | "vuln-mining"
  | "vuln-validation"
  | "asset-ops"
  | "ops-decision"
  | "ai-security";

export interface Agent {
  id: string;          // SODE001
  name: string;        // 语义接入助手
  role: string;        // 解析工程师
  task: string;        // 数据接入
  category: AgentCategory;
  progress: number;    // 0-100
  status: "online" | "busy" | "warn" | "joined";
  joinDate: string;
  /** clockwise order on the ring (0 = top of circle) */
  order: number;
}

/** Inter-agent relationships (besides VCSO spokes), based on the workflow diagram. */
export const AGENT_RELATIONS: Array<[string, string]> = [
  ["SODE001", "SODE002"], // 语义接入 → 元数据治理
  ["SODE002", "SODE003"], // 元数据治理 → 策略自治
  ["SODE003", "SODE005"], // 策略自治 → 调查编排
  ["SODE005", "SODE006"], // 调查编排 → 研判分析
  ["SODE006", "SODE007"], // 研判分析 → 响应联动
  ["SODE006", "SODE009"], // 研判分析 ↔ 漏洞研判
  ["SODE010", "SODE008"], // 资产确权 → 代码审计
  ["SODE008", "SODE009"], // 代码审计 → 漏洞研判
];

export const CATEGORY_META: Record<
  AgentCategory,
  { label: string; color: string; hsl: string }
> = {
  "data-ingest":     { label: "数据接入",   color: "agent-cyan",   hsl: "188 95% 55%" },
  "data-governance": { label: "数据治理",   color: "agent-cyan",   hsl: "188 80% 50%" },
  triage:            { label: "分诊降噪",   color: "agent-orange", hsl: "25 95% 60%" },
  "ops-l1":          { label: "一线运营",   color: "agent-green",  hsl: "142 76% 55%" },
  investigation:     { label: "调查研判",   color: "agent-purple", hsl: "270 85% 65%" },
  response:          { label: "响应执行",   color: "agent-red",    hsl: "0 85% 62%" },
  "vuln-mining":     { label: "漏洞挖掘",   color: "agent-green",  hsl: "142 70% 50%" },
  "vuln-validation": { label: "漏洞验证",   color: "agent-orange", hsl: "30 95% 58%" },
  "asset-ops":       { label: "资产运营",   color: "agent-cyan",   hsl: "195 85% 55%" },
  "ops-decision":    { label: "运营决策",   color: "agent-yellow", hsl: "48 96% 60%" },
  "ai-security":     { label: "AI安全治理", color: "agent-cyan",   hsl: "180 90% 55%" },
};

// Mocked roster — 13 agents arranged clockwise on a ring around the central VCSO.
// `order` (0..N-1) determines position on the ring (0 = top, clockwise).
export const AGENTS: Agent[] = [
  { id: "SODE001", name: "语义接入助手",       role: "解析工程师",   task: "数据接入",   category: "data-ingest",     progress: 85, status: "online", joinDate: "0530入职", order: 0 },
  { id: "SODE002", name: "元数据治理官",       role: "治理工程师",   task: "数据治理",   category: "data-governance", progress: 72, status: "online", joinDate: "0630入职", order: 1 },
  { id: "SODE003", name: "策略自治专家",       role: "策略工程师",   task: "分诊降噪",   category: "triage",          progress: 68, status: "online", joinDate: "0830入职", order: 2 },
  { id: "SODE013", name: "智能体安全评估专家", role: "AI评估工程师", task: "AI安全治理", category: "ai-security",     progress: 88, status: "joined", joinDate: "已入职",   order: 3 },
  { id: "SODE012", name: "运营有效性验证专家", role: "验证工程师",   task: "运营决策",   category: "ops-decision",    progress: 58, status: "joined", joinDate: "已入职",   order: 4 },
  { id: "SODE014", name: "智能安全防护专家",   role: "AI防护工程师", task: "AI安全治理", category: "ai-security",     progress: 92, status: "joined", joinDate: "已入职",   order: 5 },
  { id: "SODE009", name: "漏洞研判专家",       role: "漏洞工程师",   task: "漏洞验证",   category: "vuln-validation", progress: 82, status: "joined", joinDate: "已入职",   order: 6 },
  { id: "SODE008", name: "代码审计专家",       role: "审计工程师",   task: "漏洞挖掘",   category: "vuln-mining",     progress: 78, status: "online", joinDate: "0930入职", order: 7 },
  { id: "SODE010", name: "资产确权助手",       role: "资产工程师",   task: "资产运营",   category: "asset-ops",       progress: 70, status: "online", joinDate: "0730入职", order: 8 },
  { id: "SODE004", name: "安全运营L1",         role: "运营专员",     task: "一线运营",   category: "ops-l1",          progress: 98, status: "joined", joinDate: "已入职",   order: 9 },
  { id: "SODE007", name: "响应联动专家",       role: "响应工程师",   task: "响应执行",   category: "response",        progress: 65, status: "warn",   joinDate: "1030入职", order: 10 },
  { id: "SODE006", name: "研判分析专家",       role: "研判工程师",   task: "调查研判",   category: "investigation",   progress: 48, status: "busy",   joinDate: "0930入职", order: 11 },
  { id: "SODE005", name: "调查编排专家",       role: "调查工程师",   task: "调查研判",   category: "investigation",   progress: 55, status: "online", joinDate: "0730入职", order: 12 },
];

/** Polar position (in percent of the relative container) for an agent ring slot. */
export function getRingPosition(order: number, total: number, rx = 38, ry = 40) {
  const angle = (-90 + (order * 360) / total) * (Math.PI / 180);
  return {
    x: 50 + rx * Math.cos(angle),
    y: 50 + ry * Math.sin(angle),
    angle,
  };
}

export const VCSO_STATS = {
  online: 14,
  health: 95,
  queue: 186,
  latency: 12,
  version: "BUS v4.0",
};
