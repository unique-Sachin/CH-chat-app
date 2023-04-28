import styles from "../styles/Chat.module.css";
import React, { useEffect } from "react";
import MyChats from "../components/chat/MyChats";
import Navbar from "../components/Navbar";
import axios from "axios";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import SingleChat from "../components/chat/SingleChat";
import SocketWarning from "../components/modals/SocketWarning";

const Chat = () => {
  const { user } = useSelector((state) => state);
  const router = useRouter();
  useEffect(() => {
    if (!user?.token) {
      router.push("/");
    }
  }, []);
  axios.defaults.headers = {
    "Content-Type": "application/json",
    Authorization: user?.token,
  };
  return (
    user?.token && (
      <div className={styles.main__container}>
        <Navbar />
        <SocketWarning />
        <div className={styles.chat__container}>
          <MyChats />
          <SingleChat />
        </div>
      </div>
    )
  );
};

export default Chat;
