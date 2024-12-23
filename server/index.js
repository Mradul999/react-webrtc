import { Server } from "socket.io";

const io = new Server(8000, {
  cors: true,
});

const emailToSocketIdMap = new Map();
const socketIdToEmailMap = new Map();

io.on("connection", (socket) => {
  console.log("socket connected", socket.id);

  socket.on("room:join", (data) => {
    const { email, room } = data;
    socketIdToEmailMap.set(socket.id, email);
    emailToSocketIdMap.set(email, socket.id);
    io.to(room).emit("user:joined", { email, id: socket.id });
    socket.join(room);
    io.to(socket.id).emit("room:join", data);

    console.log(data);
  });

  socket.on("user:call",({to,offer})=>{
    io.to(to).emit("incoming:call",{from:socket.id,offer})
  })
});