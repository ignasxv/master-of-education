import { createRootRoute, Outlet, Link } from "@tanstack/react-router";

export const Route = createRootRoute({
	component: () => (
		<>
			<div className="flex justify-end gap-2 sm:gap-5 p-5 bg-white dark:bg-zinc-900 [&>a]:text-zinc-700 dark:[&>a]:text-white ">
				<Link to="/">Home</Link>
				<Link to="/lessons/PointGrid">Point-Grid</Link>
				<Link to="/lessons/math">Math Lessons</Link>
				<Link to="/lessons/physics">Physics Lessons</Link>
			</div>
			<Outlet />
		</>
	),
});
