import { useState, useEffect, useCallback, React } from "react";
import { useSocket } from "../context/SocketProvider";
import { useNavigate } from "react-router-dom";

const Lobby = () => {
  const [email, setEmail] = useState("");
  const [room, setRoom] = useState("");
  const navigate = useNavigate();

  const socket = useSocket();

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      socket.emit("room:join", { email, room });

      console.log(email, room);
    },
    [email, room, socket]
  );

  const handleRoomJoin = useCallback((data) => {
    const { email, room } = data;
    navigate(`/room/${room}`);
  }, [navigate]);

  useEffect(() => {
    socket.on("room:join", handleRoomJoin);
    return () => {
      socket.off("room:join");
    };
  }, [socket, handleRoomJoin]);

  return (
    <div className=" pt-10">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-2 items-center max-w-[150px] mx-auto "
      >
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          className="border-gray-300 border-2 p-1 rounded-lg"
          placeholder="Enter email"
        />
        <input
          onChange={(e) => setRoom(e.target.value)}
          value={room}
          type="number"
          className="border-gray-300 border-2 p-1 rounded-lg"
          placeholder="Enter your room id"
        />
        <button className="bg-blue-400 text-white rounded-lg p-2  w-full   ">
          Join
        </button>
      </form>
    </div>
  );
};

export default Lobby;
