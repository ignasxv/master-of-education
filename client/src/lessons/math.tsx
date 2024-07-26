import * as React from "react";

import { Mafs, Plot, Point, Coordinates, Transform, Polygon, Text, useMovablePoint, MovablePoint, useStopwatch, Line, Theme, vec, Vector } from "mafs";
import { easeInOutCubic } from "js-easing-functions";
import { sumBy, range } from "lodash";
import LaTeX from "@matejmazur/react-katex";

import "../assets/mafs.core.css";
// TODO: review latex compatability issues with safari. Safari a bitch
import "katex/dist/katex.min.css";

import { SerialContext } from "../app";
import { PortalActionButtons, findLineEquation, findQuadraticEquation } from "../lib/utils";

function handleTab(maxIndex: number, tabIndex: number, setTabIndex: (tabIndex: number) => void) {
	const movablePointsDOMElements = document.getElementsByClassName("mafs-movable-point");
	let targetPoint = movablePointsDOMElements[tabIndex] as HTMLElement;
	targetPoint?.focus();
	console.log(targetPoint);

	if (tabIndex == maxIndex) {
		setTabIndex(0);
	} else {
		setTabIndex(tabIndex + 1);
	}
}

export function CartesianPlane() {
	const rawData = React.useContext(SerialContext);

	// Using plain variables is esiest and most perfomant way,
	// But to allow the point to move on mouse drag, useState is necessary
	// let x1 = parseFloat(((rawData.x / 100 * 8) - 3).toFixed(3));
	// let y1 = parseFloat(((rawData.y / 100 * 4) -2).toFixed(3));

	let [x1, setX1] = React.useState(0);
	let [y1, setY1] = React.useState(0);

	React.useEffect(() => {
		setX1(parseFloat(((rawData.x / 100) * 8 - 3).toFixed(3)));
		setY1(parseFloat(((rawData.y / 100) * 4 - 2).toFixed(3)));
	}, [rawData]);

	return (
		<Mafs height={350} viewBox={{ y: [-2, 2], x: [-3, 5] }}>
			<Coordinates.Cartesian />
			<MovablePoint
				color="#1EA3E3"
				point={[x1, y1]}
				onMove={(point) => {
					setX1(parseFloat(point[0].toFixed(3)));
					setY1(parseFloat(point[1].toFixed(3)));
				}}
			/>
			<Text x={x1} y={y1} attach="w" attachDistance={15}>
				({x1}, {y1})
			</Text>
		</Mafs>
	);
}

export function LineThroughPoints() {
	const rawData = React.useContext(SerialContext);
	const [previousValue, setPreviousValue] = React.useState({ x: 0, y: 0 });

	// mappings
	// x, y -> (x1,y1) position of the selected movable point
	// b1 -> Tab
	// b2 -> Select - not working yet

	//refs
	const [tabIndex, setTabIndex] = React.useState(0);

	// Using plain variables is esiest and most perfomant way,
	// But to allow the point to move on mouse drag, useState is necessary
	// let x1 = parseFloat(((rawData.x / 100 * 8) - 3).toFixed(3));
	// let y1 = parseFloat(((rawData.y / 100 * 4) -2).toFixed(3));

	let [x1, setX1] = React.useState(-2);
	let [y1, setY1] = React.useState(-1);

	let [x2, setX2] = React.useState(2);
	let [y2, setY2] = React.useState(1);
	React.useEffect(() => {
		if (previousValue.x != rawData.x || previousValue.y != rawData.y) {
			if (tabIndex == 0) {
				setX1(parseFloat(((rawData.x / 100) * 20 - 10).toFixed(3)));
				setY1(parseFloat(((rawData.y / 100) * 2 - 1).toFixed(3)));
			} else if (tabIndex == 1) {
				setX2(parseFloat(((rawData.x / 100) * 20 - 10).toFixed(3)));
				setY2(parseFloat(((rawData.y / 100) * 2 - 1).toFixed(3)));
			}

			setPreviousValue({ x: rawData.x, y: rawData.y });
		}
		if (rawData.b1) {
			console.log("Tab");
			handleTab(1, tabIndex, setTabIndex);
		}
	}, [rawData]);

	React.useEffect(() => {
		handleTab(0, 0, setTabIndex);
	}, []);

	return (
		<>
			<LaTeX>{findLineEquation({ x: x1, y: y1 }, { x: x2, y: y2 })}</LaTeX>
			<Mafs height={350} viewBox={{ x: [-5, 5], y: [-3, 3] }}>
				<Coordinates.Cartesian />
				<Line.ThroughPoints point1={[x1, y1]} point2={[x2, y2]} />
				<MovablePoint
					color="#1EA3E3"
					point={[x1, y1]}
					onMove={(point: [number, number]) => {
						setX1(point[0]);
						setY1(point[1]);
					}}
				/>
				<MovablePoint
					color="#1EA3E3"
					point={[x2, y2]}
					onMove={(point: [number, number]) => {
						setX2(point[0]);
						setY2(point[1]);
					}}
				/>
			</Mafs>
		</>
	);
}

// MAYBE: refine prop types
// export function TransformingParabolas(props: any) {
// 	const sep = useMovablePoint([1, 0], { color: "#1EA3E3" });
// 	let { formulaContainer } = props;
// 	console.log(formulaContainer);

// 	const fn = (x: number) => (x - sep.x) ** 2 + sep.y;
// 	const axisOfSymmetry = (x: number) => sep.x;

// 	const n = 10;

// 	let pointsArgument = 2;

// 	const points = range(-pointsArgument * pointsArgument, (pointsArgument + 0.5) * pointsArgument, pointsArgument);

// 	let formulaLatexString = "f(x)=" + (Math.round(Math.abs(sep.x)) > 0 ? `(x + ${Math.round(sep.x)})^2` : "x^2") + (Math.round(Math.abs(sep.y)) > 0 ? "+" + Math.round(sep.y) : "");

// 	return (
// 		<>
// 			<Latex>${formulaLatexString}$</Latex>
// 			<Mafs zoom={false} height={350} viewBox={{ x: [-6, 6], y: [0, 5] }}>
// 				{/* Tried using the provided LaTeX component (from Mafs) but it must render inside the graph which is too limiting */}
// 				{/* <LaTeX at={[-4, 2]} tex={`f(x)=${sep.x > 0 ? "(x^2+" + Math.round(sep.x)+")" : "x^2"}+1`} /> */}
// 				<Coordinates.Cartesian xAxis={{ lines: false }} yAxis={{ lines: false }} />

// 				<Plot.OfX y={fn} opacity={0.25} />
// 				<Plot.OfY x={axisOfSymmetry} style="dashed" opacity={0.25} />
// 				{/* {points.map((x, index) => (
// 				<Point x={x} y={fn(x)} key={index} />
// 			))} */}
// 				{sep.element}
// 			</Mafs>
// 		</>
// 	);
// }

export function FancyParabola() {
	const rawData = React.useContext(SerialContext);
	const [previousValue, setPreviousValue] = React.useState({ x: 0, y: 0 });

	const [tabIndex, setTabIndex] = React.useState(0);

	let [x1, setX1] = React.useState(-1);

	let [x2, setX2] = React.useState(1);

	let [y3, setY3] = React.useState(-1);

	React.useEffect(() => {
		if (previousValue.x != rawData.x || previousValue.y != rawData.y) {
			if (tabIndex == 0) {
				setX1(parseFloat(((rawData.x / 100) * 20 - 10).toFixed(3)));
			} else if (tabIndex == 1) {
				setX2(parseFloat(((rawData.x / 100) * 20 - 10).toFixed(3)));
			} else if (tabIndex == 2) {
				setY3(parseFloat(((rawData.y / 100) * 6 - 3).toFixed(3)));
			}

			setPreviousValue({ x: rawData.x, y: rawData.y });
		}
		if (rawData.b1) {
			console.log("Tab");
			handleTab(2, tabIndex, setTabIndex);
		}
	}, [rawData]);

	React.useEffect(() => {
		handleTab(0, 0, setTabIndex);
	}, []);

	// const a = useMovablePoint([-1, 0], {
	// 	constrain: "horizontal",
	// 	color: "#1EA3E3",
	// });
	// const b = useMovablePoint([1, 0], {
	// 	constrain: "horizontal",
	// 	color: "#1EA3E3",
	// });

	// const k = useMovablePoint([0, -1], {
	// 	constrain: "vertical",
	// 	color: "#1EA3E3",
	// });

	const mid = (x1 + x2) / 2;
	const fn = (x: number) => (x - x1) * (x - x2);

	return (
		<>
			<LaTeX>{findQuadraticEquation(x1, x2, { y: y3 })}</LaTeX>
			<Mafs height={350}>
				<Coordinates.Cartesian subdivisions={2} />

				<Plot.OfX y={(x) => (y3 * fn(x)) / fn(mid)} />
				<MovablePoint
					point={[x1, 0]}
					color="#1EA3E3"
					onMove={(point) => {
						setX1(point[0]);
					}}
				/>
				<MovablePoint
					point={[x2, 0]}
					color="#1EA3E3"
					onMove={(point) => {
						setX2(point[0]);
					}}
				/>
				<Transform translate={[(x1 + x2) / 2, 0]}>
					<MovablePoint
						point={[0, y3]}
						color="#1EA3E3"
						onMove={(point) => {
							setY3(point[1]);
						}}
					/>
				</Transform>
			</Mafs>
		</>
	);
}

// ----------- BezierCurves -----------

export function BezierCurves() {
	const rawData = React.useContext(SerialContext);
	const [previousValue, setPreviousValue] = React.useState({ x: 0, y: 0 });

	const [tabIndex, setTabIndex] = React.useState(0);

	let [x1, setX1] = React.useState(-5);
	let [y1, setY1] = React.useState(2);

	let [x2, setX2] = React.useState(5);
	let [y2, setY2] = React.useState(-2);

	let [x3, setX3] = React.useState(-2);
	let [y3, setY3] = React.useState(-3);

	let [x4, setX4] = React.useState(2);
	let [y4, setY4] = React.useState(3);

	//mappings

	React.useEffect(() => {
		if (previousValue.x != rawData.x || previousValue.y != rawData.y) {
			if (tabIndex == 0) {
				rawData.x ? setX1(parseFloat(((rawData.x / 100) * 30 - 15).toFixed(3))) : null;
				rawData.y ? setY1(parseFloat(((rawData.y / 100) * 8 - 4).toFixed(3))) : null;
			} else if (tabIndex == 1) {
				rawData.x ? setX2(parseFloat(((rawData.x / 100) * 30 - 15).toFixed(3))) : null;
				rawData.y ? setY2(parseFloat(((rawData.y / 100) * 8 - 4).toFixed(3))) : null;
			} else if (tabIndex == 2) {
				rawData.x ? setX3(parseFloat(((rawData.x / 100) * 30 - 15).toFixed(3))) : null;
				rawData.y ? setY3(parseFloat(((rawData.y / 100) * 8 - 4).toFixed(3))) : null;
			} else if (tabIndex == 3) {
				rawData.x ? setX4(parseFloat(((rawData.x / 100) * 30 - 15).toFixed(3))) : null;
				rawData.y ? setY4(parseFloat(((rawData.y / 100) * 8 - 4).toFixed(3))) : null;
			}

			setPreviousValue({ x: rawData.x, y: rawData.y });
		}
		if (rawData.b1) {
			console.log("Tab");
			handleTab(3, tabIndex, setTabIndex);
		}
	}, [rawData]);

	React.useEffect(() => {
		handleTab(0, 0, setTabIndex);
	}, []);

	function xyFromBernsteinPolynomial(p1: vec.Vector2, c1: vec.Vector2, c2: vec.Vector2, p2: vec.Vector2, t: number) {
		return [vec.scale(p1, -(t ** 3) + 3 * t ** 2 - 3 * t + 1), vec.scale(c1, 3 * t ** 3 - 6 * t ** 2 + 3 * t), vec.scale(c2, -3 * t ** 3 + 3 * t ** 2), vec.scale(p2, t ** 3)].reduce(vec.add, [0, 0]);
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

	// const p1 = useMovablePoint([-5, 2], { color: "#1EA3E3" });
	// const p2 = useMovablePoint([5, -2], { color: "#1EA3E3" });

	// const c1 = useMovablePoint([-2, -3], { color: "#1EA3E3" });
	// const c2 = useMovablePoint([2, 3], { color: "#1EA3E3" });

	const lerp1 = vec.lerp([x1, y1], [x3, y3], t);
	const lerp2 = vec.lerp([x3, y3], [x4, y4], t);
	const lerp3 = vec.lerp([x4, y4], [x2, y2], t);

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

	function drawLineSegments(pointPath: vec.Vector2[], color: string, customOpacity = opacity * 0.5) {
		return inPairs(pointPath).map(([p1, p2], index) => <Line.Segment key={index} point1={p1} point2={p2} opacity={customOpacity} color={color} />);
	}

	function drawPoints(points: vec.Vector2[], color: string) {
		return points.map((point, index) => <Point key={index} x={point[0]} y={point[1]} color={color} opacity={opacity} />);
	}

	return (
		<>
			<Mafs height={350} viewBox={{ x: [-5, 5], y: [-4, 4] }}>
				<Coordinates.Cartesian xAxis={{ labels: false, axis: false }} yAxis={{ labels: false, axis: false }} />

				{/* Control lines */}
				{drawLineSegments(
					[
						[x1, y1],
						[x3, y3],
						[x4, y4],
						[x2, y2],
					],
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
				<Plot.Parametric t={[0, t]} weight={3} xy={(t) => xyFromBernsteinPolynomial([x1, y1], [x3, y3], [x4, y4], [x2, y2], t)} />
				{/* Show remaining bezier with dashed line  */}
				<Plot.Parametric
					// Iterate backwards so that dashes don't move
					t={[1, t]}
					weight={3}
					opacity={0.5}
					style="dashed"
					xy={(t) => xyFromBernsteinPolynomial([x1, y1], [x3, y3], [x4, y4], [x2, y2], t)}
				/>

				{drawPoints([lerpBezier], Theme.foreground)}

				<MovablePoint
					color="#1EA3E3"
					point={[x1, y1]}
					onMove={(point) => {
						setX1(point[0]);
						setY1(point[1]);
					}}
				/>
				<MovablePoint
					color="#1EA3E3"
					point={[x2, y2]}
					onMove={(point) => {
						setX2(point[0]);
						setY2(point[1]);
					}}
				/>
				<MovablePoint
					color="#1EA3E3"
					point={[x3, y3]}
					onMove={(point) => {
						setX3(point[0]);
						setY3(point[1]);
					}}
				/>
				<MovablePoint
					color="#1EA3E3"
					point={[x4, y4]}
					onMove={(point) => {
						setX4(point[0]);
						setY4(point[1]);
					}}
				/>
			</Mafs>
			<PortalActionButtons>
				<span className="font-display">t =</span> <input type="range" min={0} max={1} step={0.005} value={t} onChange={(event) => setT(+event.target.value)} />
			</PortalActionButtons>
			{/* These classnames are part of the Mafs docs website—they won't work for you. */}
		</>
	);
}

export function RiemannSum() {
	const rawData = React.useContext(SerialContext);
	const [previousValue, setPreviousValue] = React.useState({ x: 0, y: 0 });

	const [tabIndex, setTabIndex] = React.useState(0);

	// mappings Z -> number of partitions

	let [lift, setLifyY1] = React.useState(-1);

	let [x2, setX2] = React.useState(1);

	let [x3, setX3] = React.useState(11);

	const [numPartitions, setNumPartitions] = React.useState(40);

	const maxNumPartitions = 200;

	React.useEffect(() => {
		if (previousValue.x != rawData.x || previousValue.y != rawData.y) {
			if (tabIndex == 0) {
				rawData.y ? setLifyY1(parseFloat(((rawData.y / 100) * 10 - 3).toFixed(3))) : null;
			} else if (tabIndex == 1) {
				rawData.x ? setX2(parseFloat(((rawData.x / 100) * 48 - 24).toFixed(3))) : null;
			} else if (tabIndex == 2) {
				rawData.x ? setX3(parseFloat(((rawData.x / 100) * 48 - 24).toFixed(3))) : null;
			}

			
			setPreviousValue({ x: rawData.x, y: rawData.y });
		}
		if (rawData.b1) {
			console.log("Tab");
			handleTab(2, tabIndex, setTabIndex);
		}

		if (rawData.z) {
			setNumPartitions((rawData.z / 100) * maxNumPartitions);
		}
	}, [rawData]);

	React.useEffect(() => {
		handleTab(0, 0, setTabIndex);
	}, []);

	interface Partition {
		polygon: [number, number][];
		area: number;
	}

	// const lift = useMovablePoint([0, -1], {
	// 	constrain: "vertical",
	// 	color: "#1EA3E3",
	// });
	const a = useMovablePoint([1, 0], {
		constrain: "horizontal",
		color: "#1EA3E3",
	});
	const b = useMovablePoint([11, 0], {
		constrain: "horizontal",
		color: "#1EA3E3",
	});

	// The function
	const wave = (x: number) => Math.sin(3 * x) + x ** 2 / 20 - 2 + lift + 2;
	const integral = (x: number) => (1 / 60) * (x ** 3 - 20 * Math.cos(3 * x)) + lift * x;

	// Outputs
	const exactArea = integral(b.x) - integral(a.x);
	const dx = (b.x - a.x) / numPartitions;
	const partitions: Partition[] = range(x2, x3 - dx / 2, dx).map((x) => {
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
					<Polygon key={index} points={partition.polygon} fillOpacity={numPartitions / maxNumPartitions} color={partition.area >= 0 ? "hsl(112, 100%, 47%)" : "hsl(0, 100%, 47%)"} />
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
				<MovablePoint
					color="#1EA3E3"
					point={[0, lift]}
					onMove={(point) => {
						setLifyY1(point[1]);
					}}
				/>
				<MovablePoint
					color="#1EA3E3"
					point={[x2, 0]}
					onMove={(point) => {
						setX2(point[0]);
					}}
				/>
				<MovablePoint
					color="#1EA3E3"
					point={[x3, 0]}
					onMove={(point) => {
						setX3(point[0]);
					}}
				/>
			</Mafs>

			<PortalActionButtons>
				Partitions: <input type="range" min={20} max={200} value={numPartitions} onChange={(event) => setNumPartitions(+event.target.value)} />
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
