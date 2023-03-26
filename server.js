const io = require("socket.io")({
  cors: {
    origin: "http://127.0.0.1:5500",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("User connected", socket.id);
});

io.listen(3000, () => {
  console.log("Server started on port 3000");
});

const users = {};

io.on("connection", (socket) => {
  socket.on("new-user", (name) => {
    users[socket.id] = name;
    socket.broadcast.emit("user-connected", name);
  });
  socket.on("send-chat-message", (message) => {
    socket.broadcast.emit("chat-message", {
      message: message,
      name: users[socket.id],
    }); // send to all users
  });
  io.emit("update-online-users", Object.values(users));
  socket.on("disconnect", () => {
    socket.broadcast.emit("user-disconnected", users[socket.id]);
    delete users[socket.id];
  });
  io.emit("update-online-users", Object.values(users));
  io.emit("notification", { message: `A user is online` });
});
