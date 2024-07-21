import { useState, useEffect } from "react";

import { TransformingParabolas, FancyParabola, BezierCurves, RiemannSum, Vectors } from "./lessons/math";
import { ProjectileMotion } from "./lib/physics";

interface lessonType {
	name: string;
	thumbnail: string; // url string
	component: JSX.Element | null;
}

const lessons: lessonType[] = [
	{
		name: "Projectile Motion",
		thumbnail: "...",
		component: <ProjectileMotion />,
	},
	{
		name: "Transforming Parabolas",
		thumbnail: "..",
		component: <TransformingParabolas />,
	},
	{
		name: "Fancy Parabola",
		thumbnail: "..",
		component: <FancyParabola />,
	},
	{
		name: "BezierCurves",
		thumbnail: "...",
		component: <BezierCurves />,
	},
	{
		name: "Riemann Sum",
		thumbnail: "...",
		component: <RiemannSum />,
	},
	{
		name: "Vector Addition",
		thumbnail: "...",
		component: <Vectors />,
	},
];

export default function () {
	let [currentLesson, setCurrentLesson] = useState<number>(0);
	return (
		<div className="flex flex-col gap-5 h-screen max-h-screen">
			<div className="flex justify-center overflow-x-hidden gap-5 mt-5">
				<LessonCarousel currentLesson={currentLesson} setCurrentLesson={setCurrentLesson} />
			</div>
			<div className="flex-1 border bg-zinc-900 border-zinc-800 rounded p-3 m-5">{lessons[currentLesson].component}</div>
			<div className="flex mx-5 mb-5" id="actionButtons">
				{/* this is empty but action component specific action buttons will be portaled (https://react.dev/reference/react-dom/createPortal) here. see client/src/lib/utils.tsx:3  */}
			</div>
		</div>
	);
}

import useEmblaCarousel from "embla-carousel-react";

export function LessonCarousel(props: any) {
	const { currentLesson, setCurrentLesson } = props;
	const [emblaRef, emblaApi] = useEmblaCarousel();

	useEffect(() => {
		if (emblaApi) {
			console.log(emblaApi.scrollNext()); // Access API
		}
	}, [emblaApi]);

	return (
		<div className="overflow-hidden w-full px-5" ref={emblaRef}>
			<div className="flex gap-5 w-full px-5">
				{lessons.map((lesson, index) => {
					if (index == currentLesson) {
						return (
							<div key={index} className="w-1/3 border-primary-400 cursor-pointer grid place-content-center flex-shrink-0 bg-primary-950 h-20 rounded border-b-4">
								<p className="text-lg">{lesson.name}</p>
							</div>
						);
					} else {
						return (
							<div
								onClick={() => {
									setCurrentLesson(index);
									emblaApi?.scrollTo(index);
								}}
								key={index}
								className="w-1/3 border-zinc-400 cursor-pointer grid place-content-center flex-shrink-0 bg-zinc-800 h-20 rounded border-b-4"
							>
								<p className="text-lg">{lesson.name}</p>
							</div>
						);
					}
				})}
			</div>
		</div>
	);
}
