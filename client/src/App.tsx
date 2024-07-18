import "./App.css";
import * as io from "socket.io-client";
import { useEffect, useState } from "react";

const socket = io.connect("http://localhost:3001");

function App() {
  const [message, setMessage] = useState("");
  const [messageReceived, setMessageReceived] = useState("");
  const [pot, setPot] =useState("0");

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

    return () => {

    };
   
  }, [socket]);

  const padd = pot + "px"
  return (
    <div style={{ "padding": pot}} className="App">
      <p>
      <button>{pot}</button>
      </p>
      <input
        type="text"
        placeholder="Message.."
        onChange={(event) => {
          setMessage(event.target.value)
        }}
      />
    
      
      <button style={{ "padding": padd}} onClick={sendMessage}>Send Message </button>
      <h1>Message: </h1>
      {messageReceived}
    </div>
  );
}

export default App;
