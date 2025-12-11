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

module.exports = { initSocket, connectedUsers };
