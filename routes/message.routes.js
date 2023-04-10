const chatModel = require("../models/chatModel");
const messageModel = require("../models/messageModel");
const userModel = require("../models/userModel");

const messageRouter = require("express").Router();

messageRouter.post("/", async (req, res) => {
  const { content, chatId } = req.body;
  if (!content || !chatId) {
    res.status(401).send("Please pass all required fields");
  } else {
    let newMsg = {
      sender: req.user._id,
      content,
      chat: chatId,
    };
    try {
      let message = await messageModel.create(newMsg);
      message = await message.populate("sender", "name avatar");
      message = await message.populate("chat");
      message = await userModel.populate(message, {
        path: "chat.users",
        select: "name pic email",
      });
      await chatModel.findByIdAndUpdate(chatId, {
        lastMsg: message,
      });
      res.json(message);
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  }
});

messageRouter.get("/:chatId", async (req, res) => {
  try {
    const { chatId } = req.params;
    const messages = await messageModel
      .find({ chat: chatId })
      .populate("sender", "name avatar email")
      .populate("chat");
    res.json(messages);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

module.exports = messageRouter;
