
import Toothless from './components/toothless/toothless'
import Snack from './components/snack/snack'
import Counter from './components/counter/counter'
import Connect from './components/connect/connect'
import './App.css'
import io from "socket.io-client";
import { useEffect, useState } from "react";
const socket = io.connect("http://localhost:3001/");

import video from "./assets/video.mp4";



function App() {

  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
    };
  }, []);


  const handleConnectClick = () => {
    if (!isConnected) {
      socket.connect();
    }
    socket.emit("testConnection", "Hello from the front end!");
  };
  return (
    <>
      <video autoPlay muted loop id="myVideo">
        <source src={video} type="video/mp4" />
      </video>

      <div>
        <Snack/>
        <Counter/>
        <Toothless/>
        <Connect isConnected={isConnected} onConnectClick={handleConnectClick} />
      </div>
    </>
  )
}

export default App;
