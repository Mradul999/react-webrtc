import React, { useCallback } from "react";
import { useSocket } from "../context/SocketProvider";
import { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import peer from "../service/peer";

const Room = () => {
  const socket = useSocket();

  const [remoteSocketId, setRemoteSocketId] = useState(null);
  const [myStream, setMyStream] = useState(null);
  console.log(myStream);

  const handleUserJoined = useCallback(({ email, id }) => {
    console.log(`Email ${email} joined room`);
    setRemoteSocketId(id);
  });

  const handleCallClick = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });

    const offer = await peer.getOffer();
    socket.emit("user:call", { to: remoteSocketId, offer });

    setMyStream(stream);
  }, [remoteSocketId, socket]);

  const handleIncomingCall = useCallback(
    async ({ from, offer }) => {
      console.log("Incoming call", from, offer);
      setRemoteSocketId(from);
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      setMyStream(stream);

      const ans = await peer.getAnswer(offer);
      socket.emit("call:accepted", { to: from, ans });
    },
    [socket]
  );

  const handleCallAccepted = useCallback(
    ({ from, ans }) => {
      peer.setLocalDescription(ans);
      console.log("call accepted");
      for (const track of myStream.getTracks()) {
        peer.peer.addTrack(track);
      }
    },
    [myStream]
  );

  useEffect(() => {
    socket.on("user:joined", handleUserJoined);
    socket.on("incoming:call", handleIncomingCall);
    socket.on("call:accepted", handleCallAccepted);
    return () => {
      socket.off("user:joined", handleUserJoined);
      socket.off("incoming:call", handleIncomingCall);
      socket.off("call:accepted", handleCallAccepted);
    };
  }, [socket, handleUserJoined, handleIncomingCall, handleCallAccepted]);

  return (
    <div className=" flex flex-col items-center mt-20">
      <h1>Room page</h1>
      <h4>{remoteSocketId ? "Connected" : "no one in room"}</h4>
      {remoteSocketId && (
        <button
          onClick={handleCallClick}
          className="bg-yellow-400 px-3 py-1 text-white rounded-lg"
        >
          Call
        </button>
      )}

      {myStream && (
        <ReactPlayer
          width="200px"
          height="200px"
          playing
          muted
          url={myStream}
        />
      )}
    </div>
  );
};

export default Room;
