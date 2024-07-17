const { SerialPort } = require("serialport");
const { ReadlineParser } = require("@serialport/parser-readline");

const port = new SerialPort({
  path: "/dev/ttyACM0",
  baudRate: 9600,
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


const express = require('express');
const app = express();
const http = require("http");
const {Server} = require('socket.io');

const cors = require("cors");

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:4173",
        methods: ["GET", "POST"]
    },
});


io.on("connection", (socket) => {
    console.log(`User Connected ${socket.id}`);

    socket.on("send_message", (data) => {
        socket.broadcast.emit("receive_message", data)
        console.log(data);
    });

    parser.on("data", function onData(data) {
        socket.emit("serial_data", data);
        console.log("serial sent:", data)

      });

});
 
server.listen(3001, () => {
    console.log("SERVER IS RUNNING");
})
