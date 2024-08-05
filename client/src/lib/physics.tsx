import * as React from "react";
import { Mafs, useStopwatch, Point, MovablePoint, Plot, Vector, Polygon } from "mafs";

import { SerialContext } from "../app";
import { PortalActionButtons } from "./utils";

export function ProjectileMotion() {
	const rawData = React.useContext(SerialContext);
	const [previousValue, setPreviousValue] = React.useState({ x: 0, y: 0 });
  
	// mappings
	// x, y -> (x1,y1) initial velocity aka position of movable point
	// z -> gravity (g)
  // b1 -> start
  // b2 -> stop
  
	// Using plain variables is esiest and most perfomant way,
	// But to allow the point to move on mouse drag, useState is necessary
	// let x1 = parseFloat(((rawData.x / 100 * 8) - 3).toFixed(3));
	// let y1 = parseFloat(((rawData.y / 100 * 4) -2).toFixed(3));
  
	let [x1, setX1] = React.useState(-1);
	let [y1, setY1] = React.useState(1.5);
  
	const xSpan = 1.75;
	const ySpan = 1.75;
	// const initialVelocity = useMovablePoint([0.5, 1.5], { color: "#1EA3E3" });
	const initialVelocity = { x: x1, y: y1 };
  
	const vectorScale = 4;
  
	const [g, setG] = React.useState(9.8);
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
  
	React.useEffect(() => {
    if (previousValue.x != rawData.x || previousValue.y != rawData.y) {
      setX1(parseFloat(((rawData.x / 100) * 18 - 8).toFixed(3)));
      setY1(parseFloat(((rawData.y / 100) * 4).toFixed(3)));
      setG(parseFloat((rawData.z > 0 ? rawData.z / 100 : 0.981 * 10).toFixed(3)));

      setPreviousValue({ x: rawData.x, y: rawData.y });
    }
	}, [rawData]);

	React.useEffect(() => {
		if (rawData.b1) {
			// console.log("started");
			start();
		}

		if (rawData.b2) {
			// console.log("ended");
			stop();
		}
	}, [rawData.b1, rawData.b2]);

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
				{/* <Coordinates.Cartesian /> */}

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

				<text x={0} y={50} fontSize={20} className="transform-to-center" fill="white">
					g = {g}
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

				<MovablePoint
					point={[x1, y1]}
					color="#1EA3E3"
					onMove={(point: [number, number]) => {
						setX1(parseFloat(point[0].toFixed(3)));
						setY1(parseFloat(point[1].toFixed(3)));
					}}
				/>			</Mafs>

			{/* These classnames are part of the Mafs docs website—they won't work for you. */}
			<PortalActionButtons>
				<div className="p-4 bg-zinc-800 border-t border-primary-400 space-x-4 rounded-sm">
					<button className=" bg-zinc-400 text-zinc-900 font-bold px-4 py-1 rounded-sm " onClick={start} disabled={yVelocity <= 0}>
						Start
					</button>
					<button className="bg-zinc-400 text-zinc-900 font-bold  px-4 py-1 rounded-sm" onClick={stop}>
						Reset
					</button>

          <button
            className="bg-zinc-400 text-zinc-900 font-bold  px-4 py-1 rounded-sm"
            onClick={() => setShowPath(!showPath)} 
          >
            Path
          </button>
				</div>
				<div className="flex-1 flex-col justify-center max-w-xs">
					<label htmlFor="default-range" className="block mb-0.5 text-sm font-medium text-zinc-900 dark:text-white">
						Gavity
					</label>
					<input
						id="default-range"
						type="range"
						min={0.1}
						step={0.5}
						value={g}
						onChange={(e) => {
							setG(parseFloat(e.target.value));
						}}
						max={10}
						className="w-full h-2 bg-zinc-200 rounded-lg appearance-none cursor-pointer dark:bg-zinc-700"
					/>
				</div>
			</PortalActionButtons>
		</>
	);
}
