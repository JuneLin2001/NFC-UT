const PIXELS = [
  ".XX.XX.",
  "XXXXXXX",
  "XXXXXXX",
  ".XXXXX.",
  "..XXX..",
  "...X...",
];

interface HeartProps {
  className?: string;
}

const Heart: React.FC<HeartProps> = ({ className }) => {
  return (
    <svg
      viewBox="0 0 7 6"
      shapeRendering="crispEdges"
      className={className}
      aria-hidden
    >
      {PIXELS.flatMap((row, y) =>
        [...row].map((c, x) =>
          c === "X" ? (
            <rect
              key={`${x}-${y}`}
              x={x}
              y={y}
              width={1}
              height={1}
              fill="#ff0000"
            />
          ) : null,
        ),
      )}
    </svg>
  );
};

export default Heart;
