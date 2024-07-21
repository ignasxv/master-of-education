import MathLesson from "./lessons/math";

export default function () {
	const lessons = [<MathLesson />];

	return (
		<div className="p-5 flex flex-col gap-5">
            <div className="flex">
                {Array(6).forEach((_, i) =>{
                    return <div className="bg-zinc-900 aspect-video flex-1 rounded border border-zinc-800"/>
                })}
            </div>
			<div className="p-">
				<div className="border bg-zinc-900 border-zinc-800 rounded p-3">
                    {lessons[0]}
                    </div>
			</div>
		</div>
	);
}
