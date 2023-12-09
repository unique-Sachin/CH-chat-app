import styles from "../../styles/components/chat/Mychat.module.css";
import { useToast } from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { chatSlice } from "../../store/slices/chatSlice";
import Image from "next/image";
import ChatLoading from "./ChatLoading";
import UserList from "../user/UserList";
import { api_host } from "../../constants";

const MyChats = () => {
  const { chat, user } = useSelector((state) => state);
  const { chats, selectedChat, fetchChat, chatNotification } = chat;
  const { setChats, setSelectedChat, SetChatNotification } = chatSlice.actions;
  const dispatch = useDispatch();
  const [search, setSearch] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [hover, sethover] = useState("");
  const toast = useToast();
  const fetchChats = async () => {
    try {
      const { data } = await axios.get(
        `${api_host}/api/chat`
      );
      dispatch(setChats(data));
    } catch (error) {
      console.log(error);
      toast({
        title: error?.response?.data || "Error",
        status: "error",
        duration: 1500,
        position: "top-left",
        isClosable: true,
      });
    }
  };
  useEffect(() => {
    fetchChats();
  }, [fetchChat]);

  const getSender = (users) => {
    return users[0]._id === user.id ? users[1] : users[0];
  };

  const handleSearch = async () => {
    if (input) {
      try {
        setLoading(true);
        const { data } = await axios.get(
          `${api_host}/api?search=${input}`
        );
        setSearch(data);
        setLoading(false);
      } catch (error) {
        toast({
          title: error?.response?.data || "Error",
          status: "error",
          duration: 1500,
          position: "top-left",
          isClosable: true,
        });
      }
    } else {
      setSearch([]);
    }
  };

  const handleAccessChat = async (user) => {
    try {
      const { data } = await axios.post(
        `${api_host}/api/chat`,
        {
          userId: user._id,
        }
      );
      if (!chats.find((c) => c._id === data._id)) {
        dispatch(setChats([data, ...chats]));
      }
      setInput("");
      setSearch([]);
      dispatch(setSelectedChat(data));
    } catch (error) {
      console.log(error);
      toast({
        title: error?.response?.data || "Error",
        status: "error",
        duration: 1500,
        position: "top-left",
        isClosable: true,
      });
    }
  };

  return (
    <div className={styles.main_container}>
      <div className={styles.search__box}>
        <input
          value={input}
          placeholder="Search"
          onChange={(e) => {
            setInput(e.target.value);
            handleSearch();
          }}
        />
      </div>
      {input ? (
        loading ? (
          <ChatLoading />
        ) : (
          <div className={styles.all__chats}>
            {search?.map((el) => (
              <UserList
                key={el._id}
                el={el}
                handleFunction={(user) => handleAccessChat(user)}
              />
            ))}
          </div>
        )
      ) : (
        <div className={styles.all__chats}>
          {chats?.map((el) => (
            <div
              className={styles.single__chat}
              key={el._id}
              onClick={() => {
                dispatch(setSelectedChat(el));
                dispatch(
                  SetChatNotification(
                    chatNotification?.filter((n) => n._id !== el._id)
                  )
                );
              }}
              onMouseEnter={() => sethover(el._id)}
              onMouseLeave={() => sethover("")}
              style={{
                backgroundColor:
                  hover === el._id
                    ? "var(--chat-color-secondary)"
                    : selectedChat === el
                    ? "var(--chat-color-secondary)"
                    : "var(--bg-color-secondary)",
              }}
            >
              <Image
                draggable={false}
                width={40}
                height={40}
                src={
                  !el.isGroup ? getSender(el.users).avatar : el.users[0].avatar
                }
                alt={
                  !el.isGroup ? getSender(el.users).name : el.users[0].avatar
                }
              />
              <p>{!el.isGroup ? getSender(el.users).name : el.chatName}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyChats;
