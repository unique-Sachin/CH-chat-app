import React, { useEffect, useState } from "react";
import styles from "../../styles/components/chat/Singlechat.module.css";
import { useDispatch, useSelector } from "react-redux";
import { chatSlice } from "../../store/slices/chatSlice";
import { Spinner, useToast } from "@chakra-ui/react";
import UpdateGroupChatModal from "../modals/UpdateGroupChatModal";
import ProfileModal from "../modals/ProfileModal";
import axios from "axios";
import ScrollableChat from "./ScrollableChat";
import { IoMdCall } from "react-icons/io";
import { FaVideo } from "react-icons/fa";
import { BiDotsVertical } from "react-icons/bi";
import { ImAttachment } from "react-icons/im";
import { io } from "socket.io-client";
import VideoChat from "../videocall/VideoChat";
import { api_host } from "../../constants";

const ENDPOINT = api_host;

var socket, selectedChatCompare;

const SingleChat = () => {
  const { chat, user } = useSelector((state) => state);
  const { selectedChat, chatNotification, fetchChat } = chat;
  const { setSelectedChat, SetChatNotification, setFetchChat } =
    chatSlice.actions;
  const dispatch = useDispatch();
  const [messages, setMessages] = useState([]);
  const [loading, setloading] = useState(false);
  const [newMsg, setNewMsg] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [videoCallToggle, setVideoCallToggle] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const toast = useToast();

  const getSender = (users) => {
    //* this function is used 3 times
    return users[0]._id === user.id ? users[1] : users[0];
  };

  const handleSendMessage = async (e) => {
    if (e.key === "Enter" && newMsg) {
      socket.on("stop typing", () => setIsTyping(false));

      try {
        const { data } = await axios.post(`${api_host}/api/message`, {
          content: newMsg,
          chatId: selectedChat._id,
        });
        setMessages([...messages, data]);
        socket.emit("new message", data);
        setNewMsg("");
      } catch (error) {
        toast({
          title: error?.response?.data || "Error",
          status: "error",
          duration: 1500,
          position: "top-left",
          isClosable: true,
        });
      }
    }
  };

  const handleFetchMessages = async () => {
    if (!selectedChat?._id) {
      return;
    } else {
      try {
        setloading(true);
        const { data } = await axios.get(
          `${api_host}/api/message/${selectedChat._id}`
        );
        setMessages(data);
        setloading(false);
        socket.emit("join chat", selectedChat._id);
      } catch (error) {
        toast({
          title: error?.response?.data || "Error",
          status: "error",
          duration: 1500,
          position: "top-left",
          isClosable: true,
        });
      }
    }
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
  }, []);

  useEffect(() => {
    handleFetchMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    socket.on("message received", (newMsgRcd) => {
      if (
        !selectedChatCompare._id ||
        selectedChatCompare._id !== newMsgRcd.chat._id
      ) {
        if (!chatNotification.includes(newMsgRcd)) {
          dispatch(SetChatNotification([newMsgRcd.chat, ...chatNotification]));
          dispatch(setFetchChat(!fetchChat));
        }
      } else {
        setMessages([...messages, newMsgRcd]);
      }
    });
  });

  const handleTyping = (e) => {
    setNewMsg(e.target.value);
    if (!socketConnected) return;
    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let stoppedTyping = new Date().getTime();
    var timer = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - stoppedTyping;
      if (timeDiff >= timer && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timer);
  };

  return (
    selectedChat._id && (
      <div className={styles.main__container}>
        <div className={styles.chat__header}>
          <div className={styles.chat__user__container}>
            {messages && !selectedChat?.isGroup ? (
              <>
                <p>{getSender(selectedChat.users).name}</p>
              </>
            ) : (
              <p>{selectedChat.chatName}</p>
            )}
          </div>
          <div className={styles.chat__controls}>
            <IoMdCall />
            <FaVideo onClick={() => setVideoCallToggle(true)} />

            {videoCallToggle && (
              <VideoChat
                videoCallToggle={videoCallToggle}
                setVideoCallToggle={setVideoCallToggle}
              />
            )}
            {messages && !selectedChat?.isGroup ? (
              <ProfileModal user={getSender(selectedChat.users)}>
                <BiDotsVertical />
              </ProfileModal>
            ) : (
              <UpdateGroupChatModal handleFetchMessages={handleFetchMessages}>
                <BiDotsVertical />
              </UpdateGroupChatModal>
            )}
          </div>
        </div>
        <div className={styles.chat__box__container}>
          {loading ? (
            <div className={styles.chat__loading}>
              <Spinner size={"xl"} thickness="4px" speed="0.65s" />
            </div>
          ) : (
            <div className={styles.chat__messages}>
              <ScrollableChat messages={messages} isTyping={isTyping} />
            </div>
          )}

          <div className={styles.input__container}>
            <ImAttachment />
            <input
              onKeyDown={handleSendMessage}
              variant="filled"
              value={newMsg}
              placeholder="Your message"
              onChange={handleTyping}
            />
          </div>
        </div>
      </div>
    )
  );
};

export default SingleChat;
