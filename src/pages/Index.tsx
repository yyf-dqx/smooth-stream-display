import { useState } from "react";
import WarroomHeader from "@/components/warroom/WarroomHeader";
import VCSOCard from "@/components/warroom/VCSOCard";
import AgentCard from "@/components/warroom/AgentCard";
import CategoryLegend from "@/components/warroom/CategoryLegend";
import ConnectionLines from "@/components/warroom/ConnectionLines";
import { useWarroomRealtime } from "@/hooks/useWarroomRealtime";

/**
 * 5 columns × 4 rows grid, designed against a 1920×1080 canvas.
 * VCSO is the center commander spanning rows 2–3 / col 3.
 * Empty cells (".") leave room for connector arcs (top-center, bottom-left, bottom-right).
 */
const GRID_AREAS = `
  "a001 a002 .    a003 a004"
  "a005 a006 vcso a008 a009"
  "a007 .    vcso .    a012"
  ".    a013 a010 a014 ."
`;

const AREA_FOR: Record<string, string> = {
  SODE001: "a001", SODE002: "a002", SODE003: "a003", SODE004: "a004",
  SODE005: "a005", SODE006: "a006", SODE008: "a008", SODE009: "a009",
  SODE007: "a007", SODE012: "a012",
  SODE013: "a013", SODE010: "a010", SODE014: "a014",
};

const Index = () => {
  const { agents, stats, connected, lastUpdate } = useWarroomRealtime({ mode: "mock" });
  const [hoveredId, setHoveredId] = useState<string | null>(null);

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

        <main className="flex-1 px-4 py-4 lg:px-6 lg:py-5">
          {/* 16:9 stage that mirrors the 1920×1080 mockup */}
          <div
            className="relative mx-auto w-full"
            style={{
              maxWidth: "min(100%, calc((100vh - 160px) * 16 / 9))",
              aspectRatio: "16 / 9",
            }}
          >
            {/* SVG connection overlay sits in the exact same box */}
            <ConnectionLines hoveredId={hoveredId} />

            {/* The card grid — every card is in its own cell, no overlap */}
            <div
              className="absolute inset-0 grid gap-3"
              style={{
                gridTemplateColumns: "repeat(5, 1fr)",
                gridTemplateRows: "repeat(4, 1fr)",
                gridTemplateAreas: GRID_AREAS,
              }}
            >
              <div
                style={{ gridArea: "vcso", zIndex: 20 }}
                className="relative flex items-stretch justify-center"
              >
                <VCSOCard stats={stats} />
              </div>

              {agents.map((agent) => {
                const area = AREA_FOR[agent.id];
                if (!area) return null;
                const isHovered = hoveredId === agent.id;
                return (
                  <div
                    key={agent.id}
                    style={{
                      gridArea: area,
                      zIndex: isHovered ? 25 : 15,
                    }}
                    className="relative flex items-stretch justify-stretch transition-transform duration-300"
                    onMouseEnter={() => setHoveredId(agent.id)}
                    onMouseLeave={() => setHoveredId(null)}
                  >
                    <AgentCard agent={agent} />
                  </div>
                );
              })}
            </div>
          </div>

          <CategoryLegend />
        </main>

        <footer className="text-center text-xs text-muted-foreground py-2 border-t border-border/40">
          © 2024 赤宵安全 | 数字员工作战室 v4.0
        </footer>
      </div>
    </div>
  );
};

export default Index;
