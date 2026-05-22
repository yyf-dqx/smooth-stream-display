import WarroomHeader from "@/components/warroom/WarroomHeader";
import VCSOCard from "@/components/warroom/VCSOCard";
import AgentCard from "@/components/warroom/AgentCard";
import CategoryLegend from "@/components/warroom/CategoryLegend";
import ConnectionLines from "@/components/warroom/ConnectionLines";
import { useWarroomRealtime } from "@/hooks/useWarroomRealtime";

const Index = () => {
  // 切换到真实接口：
  //   useWarroomRealtime({ mode: "polling",   pollUrl: "/api/warroom/snapshot", pollInterval: 3000 })
  //   useWarroomRealtime({ mode: "websocket", wsUrl: "wss://your-host/ws/warroom" })
  const { agents, stats, connected, lastUpdate } = useWarroomRealtime({
    mode: "mock",
  });

  return (
    <div className="warroom-bg min-h-screen flex flex-col">
      <WarroomHeader
        online={stats.online}
        tasksPerHour={8294}
        systemHealthy={stats.health >= 85}
        connected={connected}
        lastUpdate={lastUpdate}
      />

      <main className="flex-1 px-6 py-6">
        <div
          className="grid gap-4 max-w-[1400px] mx-auto"
          style={{
            gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
            gridTemplateRows: "repeat(4, minmax(210px, auto))",
          }}
        >
          <div style={{ gridColumn: 3, gridRow: "2 / span 2" }}>
            <VCSOCard stats={stats} />
          </div>

          {agents.map((agent) => (
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
