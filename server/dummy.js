const { SerialPort } = require("serialport");
const { ReadlineParser } = require("@serialport/parser-readline");
const { readFileSync } = require("fs");

const PORTS = { linux: "/dev/ttyACM0", windows: "COM3" };
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
	console.log(`User Connected ${socket.id}`);
	const dummyData = readFileSync("../hardware/dummyData.txt", "utf8", (err, data) => {
		if (err) {
			console.log(err);
		}
	});

	let serialPackets = dummyData.split("\r\n");

	serialPackets.forEach(async (packet, packetIndex) => {
		await new Promise((resolve) => {
			setTimeout(() => {
                let formattedPacket={}
                let colonPairs=packet.replaceAll("},{",",").replace("{","").replace("}","").split(",");
                colonPairs.forEach(pair=>{
                    let keyValuePair=pair.split(":");
                    formattedPacket[keyValuePair[0].toLowerCase()]=parseInt(keyValuePair[1]);
                })
				resolve(socket.emit("serial_data", JSON.stringify(formattedPacket)));
			}, 1000 * packetIndex);
		});
	});
});

server.listen(3001, () => {
	console.log("SERVER IS RUNNING");
});
