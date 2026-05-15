import WarroomHeader from "@/components/warroom/WarroomHeader";
import VCSOCard from "@/components/warroom/VCSOCard";
import AgentCard from "@/components/warroom/AgentCard";
import CategoryLegend from "@/components/warroom/CategoryLegend";
import { AGENTS } from "@/data/warroom";

const Index = () => {
  return (
    <div className="warroom-bg min-h-screen flex flex-col">
      <WarroomHeader />

      <main className="flex-1 px-6 py-6">
        {/* Constellation grid: 5 cols x 4 rows. Center cell (col 3, rows 2-3) = VCSO */}
        <div
          className="grid gap-4 max-w-[1400px] mx-auto"
          style={{
            gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
            gridTemplateRows: "repeat(4, minmax(210px, auto))",
          }}
        >
          {/* VCSO center */}
          <div style={{ gridColumn: 3, gridRow: "2 / span 2" }}>
            <VCSOCard />
          </div>

          {AGENTS.map((agent) => (
            <div
              key={agent.id}
              style={{ gridColumn: agent.col, gridRow: agent.row }}
            >
              <AgentCard agent={agent} />
            </div>
          ))}
        </div>

        <CategoryLegend />
      </main>

      <footer className="text-center text-xs text-muted-foreground py-3 border-t border-border/40">
        © 2024 赤宵安全 | 数字员工作战室 v4.0
      </footer>
    </div>
  );
};

export default Index;
