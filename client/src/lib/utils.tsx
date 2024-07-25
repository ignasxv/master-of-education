import { createPortal } from "react-dom";

interface propsType {
	children: React.ReactNode;
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
