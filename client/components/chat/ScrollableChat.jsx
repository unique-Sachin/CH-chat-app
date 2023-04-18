import React from "react";
import { useSelector } from "react-redux";
import styles from "../../styles/components/chat/Scrollablechat.module.css";
import Image from "next/image";
import ScrollableFeed from "react-scrollable-feed";

const ScrollableChat = ({ messages }) => {
  const { user } = useSelector((state) => state);
  const isSameSender = (messages, el, i, userId) => {
    return (
      i < messages.length - 1 &&
      (messages[i + 1].sender._id !== el.sender._id ||
        messages[i + 1].sender._id === undefined) &&
      messages[i].sender._id !== userId
    );
  };
  const isSameSenderMargin = (messages, el, i, userId) => {
    if (
      i < messages.length - 1 &&
      messages[i + 1].sender._id === el.sender._id &&
      messages[i].sender._id !== userId
    ) {
      return "50px";
    } else if (
      (i < messages.length - 1 &&
        messages[i + 1].sender._id !== el.sender._id &&
        messages[i].sender._id !== userId) ||
      (messages[i].sender._id !== userId && i === messages.length - 1)
    ) {
      return "0px";
    } else {
      return "auto";
    }
  };

  const isSameUser = (messages, el, i) => {
    return i > 0 && messages[i - 1].sender._id === el.sender._id;
  };

  const isLastMessage = (messages, i, userId) => {
    return (
      i === messages.length - 1 &&
      messages[messages.length - 1].sender._id !== userId &&
      messages[messages.length - 1].sender._id
    );
  };
  return (
    <div className={styles.main__container}>
      <ScrollableFeed>
        {messages?.map((el, i) => (
          <div className={styles.single__chat} key={el._id}>
            {(isSameSender(messages, el, i, user.id) ||
              isLastMessage(messages, i, user.id)) && (
              <Image
                src={el.sender.avatar}
                width={40}
                height={40}
                alt={el.sender.name}
              />
            )}
            <span
              style={{
                color: "var(--color-white)",
                backgroundColor:
                  el.sender._id === user.id
                    ? "var(--chat-color-primary)"
                    : "var(--chat-color-secondary)",
                borderRadius: "10px",
                padding: "5px 15px",
                maxWidth: "75%",
                marginLeft: isSameSenderMargin(messages, el, i, user.id),
                marginTop: isSameUser(messages, el, i) ? 3 : 10,
              }}
            >
              {el.content}
            </span>
          </div>
        ))}
      </ScrollableFeed>
    </div>
  );
};

export default ScrollableChat;
