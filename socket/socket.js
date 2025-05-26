const { Server } = require("socket.io");

let io;

function initSocket(server) {
  io = new Server(server, {
    cors: {
      origin: "*", // Frontend origin
    },
  });

  io.on("connection", (socket) => {
    console.log("User connected");

    socket.on("join-group", (groupId) => {
      socket.join(`group-${groupId}`);
      console.log(`User joined group-${groupId}`);
    });

    socket.on("leave-group", (groupId) => {
      socket.leave(`group-${groupId}`);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });
}

function emitNewMessage(groupId, chat) {
  if (io) {
    io.to(`group-${groupId}`).emit("new-message", chat);
  }
}

module.exports = { initSocket, emitNewMessage };
