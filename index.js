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
app.use(cors());
app.use(json());

app.get("/", (req, res) => {
  res.send("Server is Running");
});

app.use("/api", userRouter);
app.use("/api/chat", chatRouter);
app.use("/api/message", authMiddleware, messageRouter);
app.use(notFoundMiddleware);

const server = app.listen(process.env.PORT || 8000, async () => {
  connection();
});

const io = require("socket.io")(server, {
  cors: {
    origin: "https://ch-chat-app.vercel.app",
  },
});

io.on("connection", (socket) => {
  //* this socket is for video stream till line 46 after that is for messages
  socket.emit("me", socket.id);

  socket.on("disconnect", () => {
    socket.broadcast.emit("callended");
  });

  socket.on("calluser", ({ userToCall, signalData, from, name }) => {
    io.to(userToCall).emit("calluser", { signal: signalData, from, name });
  });

  socket.on("answercall", (data) => {
    io.to(data.to).emit("callaccepted", data.signal);
  });

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
