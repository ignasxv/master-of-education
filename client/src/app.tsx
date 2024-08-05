import { useState, useEffect, createContext } from "react";
import * as io from "socket.io-client";
import useEmblaCarousel from "embla-carousel-react";

import { CartesianPlane, LineThroughPoints, FancyParabola, BezierCurves, RiemannSum } from "./lessons/math";
import { ProjectileMotion } from "./lib/physics";

const socket = io.connect("http://localhost:3001");
export const SerialContext = createContext({ x: 0, y: 0, z: 0, a: 1, b: 1, c: 0, b1: false, b2: false, b3: false, b4: false });

interface lessonType {
	name: string;
	thumbnail: string; // url string
	component: JSX.Element | null;
}

const lessons: lessonType[] = [
	{
		name: "The Cartesian Plane",
		thumbnail: "...",
		component: <CartesianPlane />,
	},
	{
		name: "Line Through Points",
		thumbnail: "...",
		component: <LineThroughPoints />,
	},
	//   {
	//     name: "Function Transformation",
	//     thumbnail: "...",
	//     component: <TransformingParabolas />,
	//   },
	{
		name: "Fancy Parabola",
		thumbnail: "..",
		component: <FancyParabola />,
	},
	{
		name: "Projectile Motion",
		thumbnail: "...",
		component: <ProjectileMotion />,
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
	// {
	// 	name: "Vector Addition",
	// 	thumbnail: "...",
	// 	component: <Vectors />,
	// },
];

export default function () {
	let [currentLesson, setCurrentLesson] = useState<number>(0);
	let [rawData, setRawData] = useState<any>({ x: 0, y: 0, z: 0, a: 0, b: 0, c: 0, b1: false, b2: false, b3: false, b4: false });

	const [carouselQue, setQue] = useState<string | null>(null);

	const [emblaRef, emblaApi] = useEmblaCarousel();

	useEffect(() => {
		socket.on("serial_data", (data) => {
			setRawData(JSON.parse(data));
			// console.log({b4:JSON.parse(data)});

			if (JSON.parse(data).b3) {
				setQue("prev");
			}
			if (JSON.parse(data).b4) {
				setQue("next");
			}
		});

		// return () => {};
	}, [socket]);

	useEffect(() => {
		console.log("que triggered");

		if (emblaApi && carouselQue != null) {
			console.log("api is defined");

			if (carouselQue == "prev") {
				console.log("prev");
				if (emblaApi.canScrollPrev()) {
					setCurrentLesson(currentLesson - 1);
					emblaApi.scrollPrev();
				} else {
					setCurrentLesson(lessons.length - 1);
					emblaApi.scrollTo(lessons.length - 1);
				}
				setQue(null);
			}
			if (carouselQue == "next") {
				console.log("next");

				if (emblaApi.canScrollNext()) {
					setCurrentLesson(currentLesson + 1);
					emblaApi.scrollNext();
				} else {
					setCurrentLesson(0);
					emblaApi.scrollTo(0);
				}
				setQue(null);
			}
		}
	}, [emblaApi, carouselQue]);
	return (
		<div className="flex flex-col gap-5 h-screen max-h-screen">
			<div className="flex justify-center overflow-x-hidden gap-5 mt-5">
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
			</div>
			<SerialContext.Provider value={rawData}>
				<div className="flex-1 border bg-zinc-900 border-zinc-800 rounded p-3 m-5">{lessons[currentLesson].component}</div>
				<div className="flex w-auto gap-4 mx-5 mb-5" id="actionButtons">
					{/* this is empty but action component specific action buttons will be portaled (https://react.dev/reference/react-dom/createPortal) here. see client/src/lib/utils.tsx:3  */}
				</div>
			</SerialContext.Provider>
		</div>
	);
}
