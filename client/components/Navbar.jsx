import React from "react";
import UserProfile from "./user/UserProfile";
import styles from "../styles/Navbar.module.css";
import { SiGooglechat } from "react-icons/si";
import { BsFillPeopleFill } from "react-icons/bs";
import GroupChatModal from "./modals/GroupChatModal";

const Navbar = () => {
  return (
    <div className={styles.main__container}>
      <div className={styles.logo}>
        <p>CH</p>
      </div>
      <div className={styles.navigation__container}>
        <div className={styles.navigation}>
          <SiGooglechat className={styles.icons} />
          <p>All Chats</p>
        </div>
        <div className={styles.navigation}>
          <GroupChatModal>
            <BsFillPeopleFill className={styles.icons} />
            <p>Create Group</p>
          </GroupChatModal>
        </div>
      </div>
      <div className={styles.profile__container}>
        <UserProfile />
      </div>
    </div>
  );
};

export default Navbar;
