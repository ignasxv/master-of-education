const { SerialPort } = require("serialport");
const { ReadlineParser } = require("@serialport/parser-readline");

const PORTS = { linux: "/dev/ttyACM0", windows: "COM7" };
const BAUD_RATE = 9600;

const port = new SerialPort({
	path: PORTS.windows,
	baudRate: BAUD_RATE,
	autoOpen: false,
});

port.open(function (err) {
	if (err) {
		return console.log("Error opening port: ", err.message);
	}

	// Because there's no callback to write, write errors will be emitted on the port:
	port.write("main screen turn on");
});

// The open event is always emitted
port.on("open", function () {
	// open logic
	console.log("Serial Port: OPEN");
});

// Customize delimiter if needed
const parser = port.pipe(new ReadlineParser({ delimiter: "\r\n" }));

// Event listener for serial data
/*
parser.on("data", function (data) {
  console.log(data.toString());

});
*/  


///////////////////// server

const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");

const cors = require("cors");

const server = http.createServer(app);

//the ports on which the App can be hosted
const ORIGINS = ["http://localhost:4173", "http://localhost:3000"];

const io = new Server(server, {
	cors: {
		origin: ORIGINS,
		methods: ["GET", "POST"],
	},
});

io.on("connection", (socket) => {
	let previousValues = {};

	console.log(`User Connected ${socket.id}`);

	socket.on("send_message", (message) => {
		socket.broadcast.emit("receive_message", message);
		console.log(message);
	});

	parser.on("data", function onData(data) {
		let formattedPacket = {};
		let colonPairs = data.replaceAll("},{", ",").replace("{", "").replace("}", "").split(",");
		colonPairs.forEach((pair) => {
			let keyValuePair = pair.split(":");
			let dataKey = keyValuePair[0].toLowerCase();
			let dataValue = parseFloat(keyValuePair[1]);

			let previousValue = previousValues[dataKey];
			if (dataKey.length > 1) {
				// checking if the key is a button  eg B1, B2, B3
				if (Object.keys(previousValues).includes(dataKey)) {
					// console.log({previousValue});
					formattedPacket[dataKey] = dataValue != previousValue ? true : false;
				} else {
					formattedPacket[dataKey] = false;
				}
				previousValues[dataKey] = dataValue;
			} else {
				formattedPacket[dataKey] = parseInt(dataValue);
			}
		});
		// console.log(formattedPacket);
		// console.log(previousValues.b1, formattedPacket.b1);
		socket.emit("serial_data", JSON.stringify(formattedPacket));
		socket.emit("serial_data", data);
		console.log("", data);
	});
});

server.listen(3001, () => {
	console.log("SERVER IS RUNNING");
});
