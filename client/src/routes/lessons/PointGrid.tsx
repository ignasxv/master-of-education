import { createFileRoute } from "@tanstack/react-router";
import { Mafs, Coordinates, Point } from "mafs";
import { useState } from "react";

import "mafs/core.css";
import "katex/dist/katex.min.css";

export const Route = createFileRoute("/lessons/PointGrid")({
  component: PointGridSystem,
});

function PointGridSystem() {

  const [point, setPoint] = useState( {x: 3, y: 1});

  return (
    <>
      <Mafs>
      <Coordinates.Cartesian
        xAxis={{
          lines: 0.25,
          subdivisions: 0,
          labels: (n) => ( n % 2 == 0 ? n : ""),
          
        }}
        yAxis={{
          lines: 0.25,
          subdivisions: 0,
          labels: (n) => ( n % 2 == 0 ? n : ""),
        }}
      />
        <Point x={point.x} y={point.y} />
      </Mafs>
    </>
  );
}
