import { useEffect, useState } from "react";
import { createLazyFileRoute } from "@tanstack/react-router";

import * as io from "socket.io-client";

import "./App.css";

export const Route = createLazyFileRoute("/")({
	component: App,
});

const socket = io.connect("http://localhost:3001");

function App() {
	const [message, setMessage] = useState("");
	const [messageReceived, setMessageReceived] = useState("");
	const [pot, setPot] = useState("0");

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
			console.log("serial data:", data);
		});

		return () => {};
	}, [socket]);

	const padd = pot + "px";
	return (
		<div style={{ padding: pot }} className="App flex-1 flex flex-col justify-center items-center">
			<div className="p-10 rounded bg-zinc-900">
				<p>
					<button>{pot}</button>
				</p>
				<input
					type="text"
					placeholder="Message.."
					onChange={(event) => {
						setMessage(event.target.value);
					}}
				/>

				<button style={{ padding: padd }} onClick={sendMessage}>
					Send Message{" "}
				</button>
				<p className="text-xl">Message: </p>
				{messageReceived}
			</div>
		</div>
	);
}
