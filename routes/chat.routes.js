const authMiddleware = require("../middlewares/authMiddleware");
const chatModel = require("../models/chatModel");
const userModel = require("../models/userModel");
const chatRouter = require("express").Router();

chatRouter.get("/", authMiddleware, async (req, res) => {
  try {
    let chatResults = await chatModel
      .find({
        users: { $elemMatch: { $eq: req.user._id } },
      })
      .populate("users", "-password")
      .populate("admin", "-password")
      .populate("lastMsg")
      .sort({
        updatedAt: -1,
      });
    chatResults = await userModel.populate(chatResults, {
      path: "lastMsg.sender",
      select: "name avatar email",
    });
    res.status(200).send(chatResults);
  } catch (error) {
    res.status(400).send(error);
  }
});

chatRouter.post("/", authMiddleware, async (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    res.sendStatus(400);
  } else {
    let isChat = await chatModel
      .find({
        isGroup: false,
        $and: [
          { users: { $elemMatch: { $eq: req.user._id } } },
          { users: { $elemMatch: { $eq: userId } } },
        ],
      })
      .populate("users", "-password")
      .populate("lastMsg");
    isChat = await userModel.populate(isChat, {
      path: "lastMsg",
      select: "name avatar email",
    });
    if (isChat.length > 0) {
      res.send(isChat[0]);
    } else {
      const chatData = {
        chatName: "sender",
        isGroup: false,
        users: [req.user._id, userId],
      };
      try {
        const createdChat = await chatModel.create(chatData);
        const fullChat = await chatModel
          .findOne({ _id: createdChat._id })
          .populate("users", "-password");
        res.status(200).send(fullChat);
      } catch (error) {
        res.status(400).send(error);
      }
    }
  }
});

chatRouter.post("/group", authMiddleware, async (req, res) => {
  let { users, name } = req.body;
  if (!users || !name) {
    res.status(401).send("Please fill both field");
  } else {
    users = JSON.parse(users);
    if (users.length < 2) {
      res.status(401).send("Minimum 3 users required to from a group chat");
    } else {
      users.push(req.user);
      try {
        const groupChat = await chatModel.create({
          chatName: name,
          users,
          isGroup: true,
          admin: req.user,
        });
        const fullGroupChat = await chatModel
          .findOne({ _id: groupChat._id })
          .populate("users", "-password")
          .populate("admin", "-password");
        res.status(200).send(fullGroupChat);
      } catch (error) {
        res.status(400).send(error);
      }
    }
  }
});

chatRouter.put("/grouprename", authMiddleware, async (req, res) => {
  const { chatId, chatName } = req.body;
  try {
    const updatedChat = await chatModel
      .findByIdAndUpdate(
        chatId,
        {
          chatName,
        },
        {
          new: true,
        }
      )
      .populate("users", "-password")
      .populate("admin", "-password");
    if (!updatedChat) {
      res.status(401).send("Chat Not Found");
    } else {
      res.json(updatedChat);
    }
  } catch (error) {
    res.status(400).send(error);
  }
});

chatRouter.put("/groupremove", authMiddleware, async (req, res) => {
     const { chatId, userId } = req.body;
     try {
       const removeChat = await chatModel
         .findByIdAndUpdate(
           chatId,
           {
             $pull: { users: userId },
           },
           {
             new: true,
           }
         )
         .populate("users", "-password")
         .populate("admin", "-password");
       if (!removeChat) {
         res.status(401).send("Chat Not Found");
       } else {
         res.json(removeChat);
       }
     } catch (error) {
       res.status(400).send(error);
     }
});

chatRouter.put("/groupadd", authMiddleware, async (req, res) => {
  const { chatId, userId } = req.body;
  try {
    const addedChat = await chatModel
      .findByIdAndUpdate(
        chatId,
        {
          $push: { users: userId },
        },
        {
          new: true,
        }
      )
      .populate("users", "-password")
      .populate("admin", "-password");
    if (!addedChat) {
      res.status(401).send("Chat Not Found");
    } else {
      res.json(addedChat);
    }
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = chatRouter;
