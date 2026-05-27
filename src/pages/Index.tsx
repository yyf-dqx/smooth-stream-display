import { useState, useMemo } from "react";
import WarroomHeader from "@/components/warroom/WarroomHeader";
import VCSOCard from "@/components/warroom/VCSOCard";
import AgentCard from "@/components/warroom/AgentCard";
import CategoryLegend from "@/components/warroom/CategoryLegend";
import ConnectionLines from "@/components/warroom/ConnectionLines";
import { useWarroomRealtime } from "@/hooks/useWarroomRealtime";
import { getRingPosition, AGENT_RELATIONS } from "@/data/warroom";

const Index = () => {
  const { agents, stats, connected, lastUpdate } = useWarroomRealtime({
    mode: "mock",
  });

  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // 与 hovered agent 直接相关的 id 集合（含自身）
  const relatedIds = useMemo(() => {
    if (!hoveredId) return new Set<string>();
    const set = new Set<string>([hoveredId]);
    AGENT_RELATIONS.forEach(([a, b]) => {
      if (a === hoveredId) set.add(b);
      if (b === hoveredId) set.add(a);
    });
    return set;
  }, [hoveredId]);

  const total = agents.length;

  return (
    <div className="warroom-bg min-h-screen flex flex-col relative overflow-hidden">
      <div className="relative z-10 flex flex-col flex-1">
        <WarroomHeader
          online={stats.online}
          tasksPerHour={8294}
          systemHealthy={stats.health >= 85}
          connected={connected}
          lastUpdate={lastUpdate}
        />

        <main className="flex-1 px-6 py-6">
          {/* Circular constellation: VCSO at center, agents on a ring */}
          <div
            className="relative mx-auto"
            style={{
              maxWidth: 1400,
              height: "min(82vh, 900px)",
              minHeight: 720,
            }}
          >
            {/* SVG connection layer (absolute, fills container) */}
            <ConnectionLines agents={agents} />

            {/* VCSO commander — dead center */}
            <div
              className="absolute"
              style={{
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
                width: 260,
                zIndex: 20,
              }}
            >
              <VCSOCard stats={stats} />
            </div>

            {/* Agents on the ring */}
            {agents.map((agent) => {
              const { x, y } = getRingPosition(agent.order, total);
              return (
                <div
                  key={agent.id}
                  className="absolute"
                  style={{
                    left: `${x}%`,
                    top: `${y}%`,
                    transform: "translate(-50%, -50%)",
                    width: 200,
                    zIndex: 15,
                  }}
                >
                  <AgentCard agent={agent} />
                </div>
              );
            })}
          </div>

          <CategoryLegend />
        </main>

        <footer className="text-center text-xs text-muted-foreground py-3 border-t border-border/40">
          © 2024 赤宵安全 | 数字员工作战室 v4.0
        </footer>
      </div>
    </div>
  );
};

export default Index;
