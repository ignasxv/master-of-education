import { createRootRoute, Outlet, Link } from "@tanstack/react-router";

export const Route = createRootRoute({
	component: () => (
		<>
			<div className="flex justify-end gap-2 sm:gap-5 p-5 bg-white dark:bg-zinc-900 [&>a]:text-sky-600 dark:[&>a]:text-sky-300 ">
				<Link to="/">Home</Link>
				<Link to="/lessons/math">Math Lessons</Link>
				<Link to="/lessons/physics">Physics Lessons</Link>
			</div>
			<Outlet />
		</>
	),
});
