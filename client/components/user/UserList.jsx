import { Avatar, Box, Flex, Text } from "@chakra-ui/react";
import styles from "../../styles/components/chat/Mychat.module.css";
import React from "react";
import Image from "next/image";

const UserList = ({ el, handleFunction }) => {
  return (
    <div onClick={() => handleFunction(el)} className={styles.single__chat}>
      <Image
        draggable={false}
        width={40}
        height={40}
        src={el.avatar}
        alt={el.name}
      />
      <div>
        <p>{el.name}</p>
        <p style={{ fontSize: "12px", textTransform: "lowercase" }}>
          <b>Email: </b>
          {el.email}
        </p>
      </div>
    </div>
  );
};

export default UserList;
