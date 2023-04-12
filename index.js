const { json } = require("express");
const connection = require("./configs/db");
const userRouter = require("./routes/user.routes");
const notFoundMiddleware = require("./middlewares/notFoundMiddleware");
const cors = require("cors");
const chatRouter = require("./routes/chat.routes");
const messageRouter = require("./routes/message.routes");
const authMiddleware = require("./middlewares/authMiddleware");
const app = require("express")();
require("dotenv").config();

connection();

app.use(cors());

app.use(json());

app.get("/", (req, res) => {
  res.send("Server is Running");
});

app.use("/api", userRouter);
app.use("/api/chat", chatRouter);
app.use("/api/message", authMiddleware, messageRouter);

app.use(notFoundMiddleware);

const server = app.listen(process.env.PORT);

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "https://sandesh-chat.vercel.app",
  },
});

io.on("connection", (socket) => {
  console.log("connected to socket");
  socket.on("setup", (userData) => {
    socket.join(userData.id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
  });

  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (newMsgRcd) => {
    var chat = newMsgRcd.chat;
    if (!chat.users) {
      return console.log("chat.user is not defined");
    }

    chat.users.forEach((user) => {
      if (user._id === newMsgRcd.sender._id) {
        return;
      }
      socket.in(user._id).emit("message received", newMsgRcd);
    });
  });

  socket.off("setup", () => {
    console.log("disconnected");
    socket.leave(userData.id);
  });
});
