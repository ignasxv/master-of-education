import { createPortal } from "react-dom";

interface propsType {
	children: React.ReactNode;
}

interface pointType {
	x: number;
	y: number;
}

export function PortalActionButtons(props: propsType) {
	/**
	 * @component
	 * Render a button in the action buttons container. Teleports the child elements passed into it into client/src/app.tsx@#actionButtons
	 * @example
	 * // Render a button in the action buttons container
	 * <PortalActionButtons>Button</PortalActionButtons>
	 */
	const { children } = props;
	return <>{document.getElementById("actionButtons") ? createPortal(<>{children}</>, document.getElementById("actionButtons") as HTMLElement) : null}</>;
}

export function findQuadraticEquation(x1: number, x2: number, midpoint: { y: number }) {
	const xm = (x1 + x2) / 2;
	const ym = midpoint.y;
	const a = ym / ((xm - x1) * (xm - x2));
	const b = -a * (x1 + x2);
	const c = a * x1 * x2;
	const latexEquation = `y = ${a.toFixed(2)}x^2 + (${b.toFixed(2)})x + (${c.toFixed(2)})`;

	return latexEquation;
}

export function findLineEquation(point1: pointType, point2: pointType) {
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
