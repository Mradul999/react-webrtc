import React from "react";
import { Route, Routes } from "react-router-dom";
import Lobby from "./screens/Lobby";
import Room from "./screens/Room";

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Lobby />}></Route>
        <Route path="/room/:roomId" element={<Room />}></Route>
      </Routes>
    </div>
  );
};

export default App;
