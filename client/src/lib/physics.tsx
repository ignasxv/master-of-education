import * as React from "react";
import { createPortal } from "react-dom";

import {
  Mafs,
  useStopwatch,
  Point,
  useMovablePoint,
  Plot,
  Text,
  Vector,
  Polygon,
} from "mafs";

import { PortalActionButtons } from "./utils";

export function ProjectileMotion() {
  const xSpan = 1.75;
  const ySpan = 1.75;
  const initialVelocity = useMovablePoint([0.5, 1.5], { color: "#1EA3E3" });

  const vectorScale = 4;

  const g = 9.8;
  const xVelocity = initialVelocity.x * vectorScale;
  const yVelocity = initialVelocity.y * vectorScale;
  const velocityAngle = Math.atan(yVelocity / xVelocity);
  const velocityMag = Math.sqrt(xVelocity ** 2 + yVelocity ** 2);
  const timeOfFlight = Math.abs(2 * velocityMag * Math.sin(velocityAngle)) / g;

  function positionAtTime(t: number): [number, number] {
    return [xVelocity * t, yVelocity * t - 0.5 * g * t ** 2];
  }
  const [restingX, restingY] = positionAtTime(timeOfFlight);

  const {
    time: t,
    start,
    stop,
  } = useStopwatch({
    endTime: timeOfFlight,
  });

  React.useEffect(() => {
    stop();
    // Reset the ball's whenever the resting position changes
  }, [restingX, restingY, stop]);

  const [showPath, setShowPath] = React.useState(false);

  return (
    <>
      <Mafs
        pan={false}
        height={300}
        viewBox={{
          x: [1 - xSpan, 1 + xSpan],
          y: [1 - ySpan, 1 + ySpan],
        }}
      >
        <Polygon
          points={[
            [-100, 0],
            [100, 0],
            [100, -100],
            [-100, -100],
          ]}
          color="#1EA3E3"
        />

        <Vector tip={[xVelocity / vectorScale, yVelocity / vectorScale]} />

        {yVelocity > 0 && (
          <>
            {showPath && (
              <Plot.Parametric
                xy={positionAtTime}
                t={[0, timeOfFlight]}
                opacity={0.4}
                style="dashed"
              />
            )}
            <Point x={restingX} y={restingY} opacity={0.5} />
          </>
        )}

        <Point x={positionAtTime(t)[0]} y={positionAtTime(t)[1]} />
        <text
          x={0}
          y={25}
          fontSize={20}
          className="transform-to-center"
          fill="white"
        >
          t = {t.toFixed(2)}/{yVelocity > 0 ? timeOfFlight.toFixed(2) : "—"}{" "}
          seconds
        </text>

        <text
          x={0}
          y={50}
          fontSize={20}
          className="transform-to-center"
          fill="white"
        >
          g = {g}
        </text>

        <text
          x={0}
          y={75}
          fontSize={20}
          className="transform-to-center"
          fill="white"
        >
          Initial Velocity = {velocityMag.toFixed(2)}
        </text>

        {initialVelocity.element}
      </Mafs>

      {/* These classnames are part of the Mafs docs website—they won't work for you. */}
      <PortalActionButtons>
        <div className="p-4 bg-zinc-800 border-t border-primary-400 space-x-4 rounded-sm">
          <button
            className=" bg-zinc-400 text-zinc-900 font-bold px-4 py-1 rounded-sm "
            onClick={start}
            disabled={yVelocity <= 0}
          >
            Start
          </button>
          <button
            className="bg-zinc-400 text-zinc-900 font-bold  px-4 py-1 rounded-sm"
            onClick={stop}
          >
            Reset
          </button>

          <button
            className="bg-zinc-400 text-zinc-900 font-bold  px-4 py-1 rounded-sm"
            onClick={() => setShowPath(!showPath)} 
          >
            Path
          </button>
        </div>
      </PortalActionButtons>
    </>
  );
}
