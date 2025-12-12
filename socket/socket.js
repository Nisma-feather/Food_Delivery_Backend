const { Server } = require("socket.io");

// Store user sockets:
const connectedUsers = {
  restaurant: {},
  delivery: {},
  user: {},
};

let io;

const initSocket = (server) => {
  io = new Server(server, {
    cors: { origin: "*" },
  });

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    socket.on("register", ({ role, userId }) => {
       console.log("REGISTER RECEIVED:", role, userId, "socket:", socket.id);
      connectedUsers[role][userId] = socket.id;
      socket.role = role;
      socket.userId = userId;
      console.log("Registered:", connectedUsers);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
      if (socket.role && socket.userId) {
        delete connectedUsers[socket.role][socket.userId];
      }
    });
  });
};

// ✅ IMPORTANT — gives controller access to io
const getIO = () => io;

module.exports = { initSocket, getIO, connectedUsers };
