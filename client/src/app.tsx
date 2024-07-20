import MathLesson from "./lessons/math";

export default function () {
	const lessons = [<MathLesson />];

	return (
		<div>
			<h1>React App</h1>
			<div className="p-10">
				<div className="border border-primary-800 rounded">{lessons[0]}</div>
			</div>
		</div>
	);
}
