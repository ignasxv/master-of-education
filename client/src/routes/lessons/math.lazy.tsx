import { createLazyFileRoute } from "@tanstack/react-router";
import { Mafs, Plot, Point, Coordinates, useMovablePoint } from "mafs";
import range from "lodash/range";

import "mafs/core.css";

export const Route = createLazyFileRoute("/lessons/math")({
	component: MathLesson,
});

function PointsAlongFunction() {
	const fn = (x: number) => (x / 2) ** 2;
	const sep = useMovablePoint([1, 0], {
		constrain: "horizontal",
	});

	const n = 10;

	const points = sep.x != 0 ? range(-n * sep.x, (n + 0.5) * sep.x, sep.x) : [];

	return (
		<Mafs width={200} viewBox={{ x: [0, 0], y: [-1.3, 4.7] }}>
			<Coordinates.Cartesian />

			<Plot.OfX y={fn} opacity={0.25} />
			{points.map((x, index) => (
				<Point x={x} y={fn(x)} key={index} />
			))}
			{sep.element}
		</Mafs>
	);
}

function MathLesson() {
	return (
		<div className="flex flex-col gap-4">
			<PointsAlongFunction />
		</div>
	);
}
