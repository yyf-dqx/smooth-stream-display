// 动态连接线背景 SVG - 数字员工作战室
// 在节点之间用贝塞尔曲线 + 沿路径运动的圆点呈现"数据流"效果

type Connection = {
  id: string;
  d: string;
  color: string;
  dur1: number;
  dur2: number;
  begin: number;
};

const CONNECTIONS: Connection[] = [
  { id: "cp-0",  d: "M12,10 Q21,2 30,10",     color: "#00BFA5", dur1: 2.5, dur2: 3.0, begin: 0.0 },
  { id: "cp-1",  d: "M30,10 Q46,2 62,10",     color: "#2962FF", dur1: 3.0, dur2: 3.5, begin: 0.2 },
  { id: "cp-2",  d: "M62,10 Q71,2 80,10",     color: "#FF6D00", dur1: 3.5, dur2: 4.0, begin: 0.4 },
  { id: "cp-3",  d: "M62,10 Q37,17 12,40",    color: "#FF6D00", dur1: 2.5, dur2: 3.0, begin: 0.6 },
  { id: "cp-4",  d: "M80,10 Q63,24.5 46,55",  color: "#00C853", dur1: 3.0, dur2: 3.5, begin: 0.8 },
  { id: "cp-5",  d: "M12,40 Q21,32 30,40",    color: "#AA00FF", dur1: 3.5, dur2: 4.0, begin: 1.0 },
  { id: "cp-6",  d: "M30,40 Q30,47 30,70",    color: "#AA00FF", dur1: 2.5, dur2: 3.0, begin: 1.2 },
  { id: "cp-7",  d: "M30,70 Q38,54.5 46,55",  color: "#D50000", dur1: 3.0, dur2: 3.5, begin: 1.4 },
  { id: "cp-8",  d: "M62,40 Q71,32 80,40",    color: "#64DD17", dur1: 3.5, dur2: 4.0, begin: 1.6 },
  { id: "cp-9",  d: "M80,40 Q80,47 80,70",    color: "#FFAB00", dur1: 2.5, dur2: 3.0, begin: 1.8 },
  { id: "cp-10", d: "M80,70 Q63,54.5 46,55",  color: "#0091EA", dur1: 3.0, dur2: 3.5, begin: 2.0 },
  { id: "cp-11", d: "M46,55 Q54,54.5 62,70",  color: "#FFD600", dur1: 3.5, dur2: 4.0, begin: 2.2 },
  { id: "cp-12", d: "M46,55 Q38,63.5 30,88",  color: "#FFD600", dur1: 2.5, dur2: 3.0, begin: 2.4 },
  { id: "cp-13", d: "M30,88 Q46,80 62,88",    color: "#00B8D4", dur1: 3.0, dur2: 3.5, begin: 2.6 },
  { id: "cp-14", d: "M62,88 Q54,63.5 46,55",  color: "#00B8D4", dur1: 3.5, dur2: 4.0, begin: 2.8 },
];

const ConnectionLines = () => {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    >
      {CONNECTIONS.map((c) => (
        <g key={c.id}>
          <path
            id={c.id}
            d={c.d}
            fill="none"
            stroke={c.color}
            strokeWidth={0.15}
            opacity={0.3}
          />
          <circle r={0.6} fill={c.color} opacity={0.8}>
            <animateMotion dur={`${c.dur1}s`} repeatCount="indefinite" begin={`${c.begin}s`}>
              <mpath href={`#${c.id}`} />
            </animateMotion>
          </circle>
          <circle r={0.4} fill={c.color} opacity={0.5}>
            <animateMotion dur={`${c.dur2}s`} repeatCount="indefinite" begin={`${c.begin + 1}s`}>
              <mpath href={`#${c.id}`} />
            </animateMotion>
          </circle>
        </g>
      ))}
    </svg>
  );
};

export default ConnectionLines;
