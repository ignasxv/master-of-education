import { createLazyFileRoute } from '@tanstack/react-router'

import * as io from "socket.io-client";

import "./App.css";
import { Coordinates, Mafs, Point } from "mafs";

export const Route = createLazyFileRoute("/")({
	component: App,
});

const socket = io.connect("http://localhost:3001");

function App() {
	const [message, setMessage] = useState("");
	const [messageReceived, setMessageReceived] = useState("");
	const [pot, setPot] = useState("0");
	const [point, setPoint] = useState({ x: 3, y: 1 });

	const sendMessage = () => {
		socket.emit("send_message", { message });
	};

	useEffect(() => {
		socket.on("receive_message", (message) => {
			console.log("received message");
			setMessageReceived(message.message);
		});

		socket.on("serial_data", (data) => {
			setPot(data);
			setPoint({ x: point.x, y: data });
			console.log("serial data:", data);
		});

		return () => {};
	}, [socket]);

	return (
		<>
			<Mafs>
				<Coordinates.Cartesian
					xAxis={{
						lines: 0.25,
						subdivisions: false,
						labels: (n) => (n % 2 == 0 ? n : ""),
					}}
					yAxis={{
						lines: 0.25,
						subdivisions: false,
						labels: (n) => (n % 2 == 0 ? n : ""),
					}}
				/>
				<Point x={point.x} y={point.y} />
			</Mafs>
		</>
	);

	// const padd = pot + "px";
	// return (
	// 	<div style={{ padding: pot }} className="App flex-1 flex flex-col justify-center items-center">
	// 		<div className="p-10 rounded bg-zinc-900">
	// 			<p>
	// 				<button>{pot}</button>
	// 			</p>
	// 			<input
	// 				type="text"
	// 				placeholder="Message.."
	// 				onChange={(event) => {
	// 					setMessage(event.target.value);
	// 				}}
	// 			/>

	// 			<button style={{ padding: padd }} onClick={sendMessage}>
	// 				Send Message{" "}
	// 			</button>
	// 			<p className="text-xl">Message: </p>
	// 			{messageReceived}
	// 		</div>
	// 	</div>
	// );
}
        
 export const Route = createLazyFileRoute('/')({
  component: () => <div>Hello /!</div>
})