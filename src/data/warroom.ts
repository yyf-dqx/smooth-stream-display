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
  joinDate: string;    // "0530入职" | "已入职"
  /** position in 5-col x 4-row grid (col 1-5, row 1-4). Center cell (3, 2-3) reserved for VCSO */
  col: number;
  row: number;
  rowSpan?: number;
}

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

// Mocked roster — 13 agents in a 5x4 constellation around the central VCSO.
export const AGENTS: Agent[] = [
  { id: "SODE001", name: "语义接入助手", role: "解析工程师", task: "数据接入", category: "data-ingest",     progress: 85, status: "online", joinDate: "0530入职", col: 1, row: 1 },
  { id: "SODE002", name: "元数据治理官", role: "治理工程师", task: "数据治理", category: "data-governance", progress: 72, status: "online", joinDate: "0630入职", col: 2, row: 1 },
  { id: "SODE003", name: "策略自治专家", role: "策略工程师", task: "分诊降噪", category: "triage",          progress: 68, status: "online", joinDate: "0830入职", col: 4, row: 1 },
  { id: "SODE004", name: "安全运营L1",   role: "运营专员",   task: "一线运营", category: "ops-l1",          progress: 98, status: "joined", joinDate: "已入职",   col: 5, row: 1 },

  { id: "SODE005", name: "调查编排专家", role: "调查工程师", task: "调查研判", category: "investigation",   progress: 55, status: "online", joinDate: "0730入职", col: 1, row: 2 },
  { id: "SODE006", name: "研判分析专家", role: "研判工程师", task: "调查研判", category: "investigation",   progress: 48, status: "busy",   joinDate: "0930入职", col: 2, row: 2 },
  { id: "SODE008", name: "代码审计专家", role: "审计工程师", task: "漏洞挖掘", category: "vuln-mining",     progress: 78, status: "online", joinDate: "0930入职", col: 4, row: 2 },
  { id: "SODE009", name: "漏洞研判专家", role: "漏洞工程师", task: "漏洞验证", category: "vuln-validation", progress: 82, status: "joined", joinDate: "已入职",   col: 5, row: 2 },

  { id: "SODE007", name: "响应联动专家", role: "响应工程师", task: "响应执行", category: "response",        progress: 65, status: "warn",   joinDate: "1030入职", col: 2, row: 3 },
  { id: "SODE012", name: "运营有效性验证专家", role: "验证工程师", task: "运营决策", category: "ops-decision", progress: 58, status: "joined", joinDate: "已入职",   col: 4, row: 3 },

  { id: "SODE013", name: "智能体安全评估专家", role: "AI评估工程师", task: "AI安全治理", category: "ai-security", progress: 88, status: "joined", joinDate: "已入职",   col: 2, row: 4 },
  { id: "SODE010", name: "资产确权助手", role: "资产工程师", task: "资产运营", category: "asset-ops",       progress: 70, status: "online", joinDate: "0730入职", col: 4, row: 4 },
  { id: "SODE014", name: "智能安全防护专家", role: "AI防护工程师", task: "AI安全治理", category: "ai-security", progress: 92, status: "joined", joinDate: "已入职",   col: 5, row: 4 },
];

export const VCSO_STATS = {
  online: 14,
  health: 95,
  queue: 186,
  latency: 12,
  version: "BUS v4.0",
};
