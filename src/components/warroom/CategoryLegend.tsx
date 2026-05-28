import { LEGEND } from "@/data/warroom";

export default function CategoryLegend() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 py-3 text-xs text-muted-foreground">
      {LEGEND.map((m) => (
        <div key={m.label} className="flex items-center gap-1.5">
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{
              backgroundColor: `hsl(${m.hsl})`,
              boxShadow: `0 0 6px hsl(${m.hsl})`,
            }}
          />
          <span>{m.label}</span>
        </div>
      ))}
    </div>
  );
}
