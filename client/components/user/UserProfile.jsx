import { BellIcon } from "@chakra-ui/icons";
import { Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import ProfileModal from "../modals/ProfileModal";
import { userSlice } from "../../store/slices/userSlice";
import { chatSlice } from "../../store/slices/chatSlice";
import { useRouter } from "next/router";
import { FaUser } from "react-icons/fa";
import { IoLogOut } from "react-icons/io5";

const UserProfile = () => {
  const { user, chat } = useSelector((state) => state);
  const { chatNotification } = chat;
  const dispatch = useDispatch();
  const { logoutUser } = userSlice.actions;
  const { SetChatNotification, setSelectedChat } = chatSlice.actions;
  const router = useRouter();
  const handleLogout = () => {
    dispatch(logoutUser());
    router.push("/");
  };

  const getSender = (users) => {
    //* this function is used 3 times
    return users[0]._id === user.id ? users[1] : users[0];
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        fontSize: "22px",
        height: "100%",
        justifyContent: "space-between",
      }}
    >
      <Menu>
        <MenuButton>
          <span>
            {chatNotification.length > 0 ? chatNotification.length : ""}
          </span>
          <BellIcon fontSize={"25"} />
        </MenuButton>
        <MenuList
          color={"var(--color-white)"}
          bg={"var(--bg-color-secondary)"}
          marginLeft={10}
          fontSize={17}
          padding={2}
          marginTop="-40px"
        >
          {!chatNotification.length && "No new Messages"}
          {chatNotification?.map((el) => (
            <MenuItem
              color={"var(--color-white)"}
              bg={"var(--bg-color-secondary)"}
              key={el._id}
              onClick={() => {
                dispatch(setSelectedChat(el));
                dispatch(
                  SetChatNotification(
                    chatNotification.filter((n) => n._id !== el._id)
                  )
                );
              }}
            >
              {el.isGroup
                ? `New Message from ${el.chatName}`
                : `New Message from ${getSender(el.users).name}`}
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
      <ProfileModal user={user}>
        <FaUser style={{ cursor: "pointer", fontSize: "20px" }} />
      </ProfileModal>
      <IoLogOut onClick={handleLogout} style={{ cursor: "pointer" }} />
    </div>
  );
};

export default UserProfile;
