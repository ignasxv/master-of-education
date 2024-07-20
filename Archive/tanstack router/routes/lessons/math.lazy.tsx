import { useRef } from "react";
import { createPortal } from "react-dom";

import { createLazyFileRoute } from "@tanstack/react-router";
import { Mafs, Plot, Point, Coordinates, useMovablePoint } from "mafs";
import range from "lodash/range";
import Latex from "react-latex-next";

import "../../assets/mafs.core.css";

// TODO: review latex compatability issues with safari. Safari a bitch
import "katex/dist/katex.min.css";

export const Route = createLazyFileRoute("/lessons/math")({
	component: MathLesson,
});

// MAYBE: refine prop types
function PointsAlongFunction(props: any) {
	const sep = useMovablePoint([1, 0]);
	let { formulaContainer } = props;
	console.log(formulaContainer);

	const fn = (x: number) => (x - sep.x) ** 2 + sep.y;
	const axisOfSymmetry = (x: number) => sep.x;

	const n = 10;

	let pointsArgument = 2;

	const points = range(-pointsArgument * pointsArgument, (pointsArgument + 0.5) * pointsArgument, pointsArgument);

	let formulaLatexString = "f(x)=" + (Math.round(Math.abs(sep.x)) > 0 ? `(x^2 + ${Math.round(sep.x)})` : "x^2") + (Math.round(Math.abs(sep.y)) > 0 ? "+" + Math.round(sep.y) : "");

	return (
		<>
			<Latex>${formulaLatexString}$</Latex>
			<Mafs zoom={false} viewBox={{ x: [-6, 6], y: [0, 5] }}>
				{/* Tried using the provided LaTeX component (from Mafs) but it must render inside the graph which is too limiting */}
				{/* <LaTeX at={[-4, 2]} tex={`f(x)=${sep.x > 0 ? "(x^2+" + Math.round(sep.x)+")" : "x^2"}+1`} /> */}
				<Coordinates.Cartesian xAxis={{ lines: false }} yAxis={{ lines: false }} />

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

function MathLesson() {
	const formulaContainer = useRef(null);
	return (
		<main className="p-10">
			<div className="flex flex-col gap-4 w-96" ref={formulaContainer}>
				<PointsAlongFunction formulaContainer={formulaContainer} />
			</div>
		</main>
	);
}
