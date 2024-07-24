import * as React from "react";
import TeX from "@matejmazur/react-katex";

import {
  Mafs,
  Plot,
  Point,
  Coordinates,
  Transform,
  Polygon,
  Text,
  useMovablePoint,
  useStopwatch,
  Line,
  Theme,
  vec,
  Vector,
  UseMovablePoint,
} from "mafs";
import { easeInOutCubic } from "js-easing-functions";
import { sumBy, range } from "lodash";
import Latex from "react-latex-next";

import "../assets/mafs.core.css";
// TODO: review latex compatability issues with safari. Safari a bitch
import "katex/dist/katex.min.css";

import { SerialContext } from "../app";
import { PortalActionButtons } from "../lib/utils";
import _ from "lodash";

// Just a point on the graph
export function CartesianPlane() {
  const point = useMovablePoint([1, 1], { color: "#1EA3E3" });

  const rawData = React.useContext(SerialContext);
  console.log(rawData);

  return (
    <Mafs height={350} viewBox={{ y: [-5, 5] }}>
      <Coordinates.Cartesian />
      <Text size={20} x={point.x} y={point.y} attach="e" attachDistance={15}>
        ({point.x.toFixed(2)}, {point.y.toFixed(2)})
      </Text>
      {point.element}
    </Mafs>
  );
}

export function LineThroughPoints() {
  const point1 = useMovablePoint([-2, -1], { color: "#1EA3E3" });
  const point2 = useMovablePoint([2, 1], { color: "#1EA3E3" });

  return (
	<>
	<Latex>${findLineEquation(point1, point2)}$</Latex>
    <Mafs height={350} viewBox={{ y: [-5, 5] }}>
      <Coordinates.Cartesian />
      <Line.ThroughPoints point1={point1.point} point2={point2.point} />
      {point1.element}
      {point2.element}
    </Mafs>
	</>
  );
}


// MAYBE: refine prop types
export function TransformingParabolas(props: any) {
  const sep = useMovablePoint([1, 0], { color: "#1EA3E3" });
  let { formulaContainer } = props;
  console.log(formulaContainer);

  const fn = (x: number) => (x - sep.x) ** 2 + sep.y;
  const axisOfSymmetry = (x: number) => sep.x;

  let pointsArgument = 2;

  const points = range(
    -pointsArgument * pointsArgument,
    (pointsArgument + 0.5) * pointsArgument,
    pointsArgument
  );

  let formulaLatexString = 
    "f(x)=" +
    (Math.round(Math.abs(sep.x)) > 0 ? `(x + ${Math.round(sep.x)})^2` : "x^2") +
    (Math.round(Math.abs(sep.y)) > 0 ? "+" + Math.round(sep.y) : "");

  return (
    <>
      <Latex>${formulaLatexString}$</Latex>
      <Mafs zoom={false} height={350} viewBox={{ x: [-6, 6], y: [0, 5] }}>
        {/* Tried using the provided LaTeX component (from Mafs) but it must render inside the graph which is too limiting */}
        {/* <LaTeX at={[-4, 2]} tex={`f(x)=${sep.x > 0 ? "(x^2+" + Math.round(sep.x)+")" : "x^2"}+1`} /> */}
        <Coordinates.Cartesian
          xAxis={{ lines: false }}
          yAxis={{ lines: false }}
        />

        <Plot.OfX y={fn} opacity={0.25} />
        <Plot.OfY x={axisOfSymmetry} style="dashed" opacity={0.25} />
        {/* {points.map((x, index) => (
				<Point x={x} y={fn(x)} key={index} />
			))} */}
        {sep.element}
      </Mafs>
    </>
  );
}

export function FancyParabola() {
  const a = useMovablePoint([-1, 0], {
    constrain: "horizontal",
    color: "#1EA3E3",
  });
  const b = useMovablePoint([1, 0], {
    constrain: "horizontal",
    color: "#1EA3E3",
  });

  const k = useMovablePoint([0, -1], {
    constrain: "vertical",
    color: "#1EA3E3",
  });

  const mid = (a.x + b.x) / 2;
  const fn = (x: number) => (x - a.x) * (x - b.x);

  return (
    <>
      <Latex>${findQuadraticEquation(a.x, b.x, k)}$</Latex>
      <Mafs height={350}>
        <Coordinates.Cartesian subdivisions={2} />

        <Plot.OfX y={(x) => (k.y * fn(x)) / fn(mid)} />
        {a.element}
        {b.element}
        <Transform translate={[(a.x + b.x) / 2, 0]}>{k.element}</Transform>
      </Mafs>
    </>
  );
}

// ----------- BezierCurves -----------

export function BezierCurves() {
  function xyFromBernsteinPolynomial(
    p1: vec.Vector2,
    c1: vec.Vector2,
    c2: vec.Vector2,
    p2: vec.Vector2,
    t: number
  ) {
    return [
      vec.scale(p1, -(t ** 3) + 3 * t ** 2 - 3 * t + 1),
      vec.scale(c1, 3 * t ** 3 - 6 * t ** 2 + 3 * t),
      vec.scale(c2, -3 * t ** 3 + 3 * t ** 2),
      vec.scale(p2, t ** 3),
    ].reduce(vec.add, [0, 0]);
  }

  function inPairs<T>(arr: T[]) {
    const pairs: [T, T][] = [];
    for (let i = 0; i < arr.length - 1; i++) {
      pairs.push([arr[i], arr[i + 1]]);
    }

    return pairs;
  }

  const [t, setT] = React.useState(0.5);
  const opacity = 1 - (2 * t - 1) ** 6;

  const p1 = useMovablePoint([-5, 2], { color: "#1EA3E3" });
  const p2 = useMovablePoint([5, -2], { color: "#1EA3E3" });

  const c1 = useMovablePoint([-2, -3], { color: "#1EA3E3" });
  const c2 = useMovablePoint([2, 3], { color: "#1EA3E3" });

  const lerp1 = vec.lerp(p1.point, c1.point, t);
  const lerp2 = vec.lerp(c1.point, c2.point, t);
  const lerp3 = vec.lerp(c2.point, p2.point, t);

  const lerp12 = vec.lerp(lerp1, lerp2, t);
  const lerp23 = vec.lerp(lerp2, lerp3, t);

  const lerpBezier = vec.lerp(lerp12, lerp23, t);

  const duration = 2;
  const { time, start } = useStopwatch({
    endTime: duration,
  });
  React.useEffect(() => {
    setTimeout(() => start(), 500);
  }, [start]);
  React.useEffect(() => {
    setT(easeInOutCubic(time, 0, 0.75, duration));
  }, [time]);

  function drawLineSegments(
    pointPath: vec.Vector2[],
    color: string,
    customOpacity = opacity * 0.5
  ) {
    return inPairs(pointPath).map(([p1, p2], index) => (
      <Line.Segment
        key={index}
        point1={p1}
        point2={p2}
        opacity={customOpacity}
        color={color}
      />
    ));
  }

  function drawPoints(points: vec.Vector2[], color: string) {
    return points.map((point, index) => (
      <Point
        key={index}
        x={point[0]}
        y={point[1]}
        color={color}
        opacity={opacity}
      />
    ));
  }

  return (
    <>
      <Mafs height={350} viewBox={{ x: [-5, 5], y: [-4, 4] }}>
        <Coordinates.Cartesian
          xAxis={{ labels: false, axis: false }}
          yAxis={{ labels: false, axis: false }}
        />

        {/* Control lines */}
        {drawLineSegments(
          [p1.point, c1.point, c2.point, p2.point],
          "#1EA3E3",
          0.5
        )}

        {/* First-order lerps */}
        {drawLineSegments([lerp1, lerp2, lerp3], Theme.red)}
        {drawPoints([lerp1, lerp2, lerp3], Theme.red)}

        {/* Second-order lerps */}
        {drawLineSegments([lerp12, lerp23], Theme.yellow)}
        {drawPoints([lerp12, lerp23], Theme.yellow)}

        {/* Quadratic bezier lerp  */}
        <Plot.Parametric
          t={[0, t]}
          weight={3}
          xy={(t) =>
            xyFromBernsteinPolynomial(p1.point, c1.point, c2.point, p2.point, t)
          }
        />
        {/* Show remaining bezier with dashed line  */}
        <Plot.Parametric
          // Iterate backwards so that dashes don't move
          t={[1, t]}
          weight={3}
          opacity={0.5}
          style="dashed"
          xy={(t) =>
            xyFromBernsteinPolynomial(p1.point, c1.point, c2.point, p2.point, t)
          }
        />

        {drawPoints([lerpBezier], Theme.foreground)}

        {p1.element}
        {p2.element}
        {c1.element}
        {c2.element}
      </Mafs>
      <PortalActionButtons>
        <span className="font-display">t =</span>{" "}
        <input
          type="range"
          min={0}
          max={1}
          step={0.005}
          value={t}
          onChange={(event) => setT(+event.target.value)}
        />
      </PortalActionButtons>
      {/* These classnames are part of the Mafs docs website—they won't work for you. */}
    </>
  );
}

export function RiemannSum() {
  interface Partition {
    polygon: [number, number][];
    area: number;
  }
  const maxNumPartitions = 200;

  // Inputs
  const [numPartitions, setNumPartitions] = React.useState(40);
  const lift = useMovablePoint([0, -1], {
    constrain: "vertical",
    color: "#1EA3E3",
  });
  const a = useMovablePoint([1, 0], {
    constrain: "horizontal",
    color: "#1EA3E3",
  });
  const b = useMovablePoint([11, 0], {
    constrain: "horizontal",
    color: "#1EA3E3",
  });

  // The function
  const wave = (x: number) => Math.sin(3 * x) + x ** 2 / 20 - 2 + lift.y + 2;
  const integral = (x: number) =>
    (1 / 60) * (x ** 3 - 20 * Math.cos(3 * x)) + lift.y * x;

  // Outputs
  const exactArea = integral(b.x) - integral(a.x);
  const dx = (b.x - a.x) / numPartitions;
  const partitions: Partition[] = range(a.x, b.x - dx / 2, dx).map((x) => {
    const yMid = wave(x + dx / 2);

    return {
      polygon: [
        [x, 0],
        [x, yMid],
        [x + dx, yMid],
        [x + dx, 0],
      ],
      area: dx * yMid,
    };
  });

  const areaApprox = sumBy(partitions, "area");

  return (
    <>
      <Mafs height={350} viewBox={{ x: [1, 2], y: [-3, 10] }}>
        <Coordinates.Cartesian
          subdivisions={2}
          xAxis={{
            labels(value) {
              if (value % 2 == 0) {
                return value;
              }
            },
          }}
          yAxis={{
            labels(value) {
              if (value % 2 == 0) {
                return value;
              }
            },
          }}
        />

        <Plot.OfX y={wave} color={Theme.blue} />

        {partitions.map((partition, index) => (
          <Polygon
            key={index}
            points={partition.polygon}
            fillOpacity={numPartitions / maxNumPartitions}
            color={
              partition.area >= 0 ? "hsl(112, 100%, 47%)" : "hsl(0, 100%, 47%)"
            }
          />
        ))}

        <Text attach="e" x={1.2} y={8.5} size={20}>
          Midpoint Riemann sum:
        </Text>

        <Text attach="e" x={1.2} y={7.5} size={30}>
          {areaApprox.toFixed(4)}
        </Text>

        <Text attach="e" x={1.2} y={6.5} size={20}>
          True area:
        </Text>

        <Text attach="e" x={1.2} y={5.5} size={30}>
          {exactArea.toFixed(4)}
        </Text>

        {lift.element}
        {a.element}
        {b.element}
      </Mafs>

      <PortalActionButtons>
        Partitions:{" "}
        <input
          type="range"
          min={20}
          max={200}
          value={numPartitions}
          onChange={(event) => setNumPartitions(+event.target.value)}
        />
      </PortalActionButtons>
    </>
  );
}

export function Vectors() {
  const tip = useMovablePoint([0.4, 0.6], { color: "#1EA3E3" });

  const vec1 = tip.point;
  const angle = Math.atan2(tip.y, tip.x);
  const vec2 = vec.add(vec1, vec.rotate(vec1, angle));
  const vec3 = vec.add(vec1, vec.rotate(vec2, -2 * angle));

  return (
    <Mafs height={350} viewBox={{ x: [-3, 3], y: [-2, 2] }}>
      <Coordinates.Cartesian />
      <Vector tip={vec1} />
      <Vector tail={vec1} tip={vec2} />
      <Vector tail={vec2} tip={vec3} />
      <Vector tip={vec3} color="#1EA3E3" />

      {tip.element}
    </Mafs>
  );
}

// Utility functions

function findQuadraticEquation(
  x1: number,
  x2: number,
  midpoint: UseMovablePoint
) {
  const xm = (x1 + x2) / 2;
  const ym = midpoint.y;
  const a = ym / ((xm - x1) * (xm - x2));
  const b = -a * (x1 + x2);
  const c = a * x1 * x2;
  const latexEquation = `y = ${a.toFixed(2)}x^2 + (${b.toFixed(2)})x + (${c.toFixed(2)})`;

  return latexEquation;
}



function findLineEquation(point1, point2) {
    const { x: x1, y: y1 } = point1;
    const { x: x2, y: y2 } = point2;

    // Calculate the slope (m)
    const m = (y2 - y1) / (x2 - x1);

    // Calculate the y-intercept (b)
    const b = y1 - m * x1;

    // Return the LaTeX formatted equation
    const latexEquation = `y = ${m.toFixed(2)}x + (${b.toFixed(2)})`;
    return latexEquation;
}