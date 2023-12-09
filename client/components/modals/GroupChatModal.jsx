import { ViewIcon } from "@chakra-ui/icons";
import {
  Button,
  Flex,
  FormControl,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { chatSlice } from "../../store/slices/chatSlice";
import axios from "axios";
import UserList from "../user/UserList";
import UserBadgeItem from "../user/UserBadgeItem";

const GroupChatModal = ({ children }) => {
  const { chat } = useSelector((state) => state);
  const { chats } = chat;
  const { setChats } = chatSlice.actions;
  const dispatch = useDispatch();
  const { onOpen, isOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleSubmitGroup = async () => {
    if (!groupChatName) {
      toast({
        title: "Plase Enter Group Name",
        status: "warning",
        duration: 1500,
        position: "top-left",
        isClosable: true,
      });
    } else {
      try {
        const { data } = await axios.post(
          `https://ch-chat-app-production.up.railway.app/api/chat/group`,
          {
            name: groupChatName,
            users: JSON.stringify(selectedUsers.map((el) => el._id)),
          }
        );
        dispatch(setChats([data, ...chats]));
        setSelectedUsers([]);
        setSearchResults([]);
        onClose();
        toast({
          title: "Group Created",
          status: "success",
          duration: 1500,
          position: "top-left",
          isClosable: true,
        });
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

  const handleSearchUser = async (input) => {
    if (!input) return;
    try {
      setLoading(true);
      const { data } = await axios.get(
        `https://ch-chat-app-production.up.railway.app/api?search=${input}`
      );
      setSearchResults(data);
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
  };

  const handleSelectedUser = (user) => {
    if (selectedUsers.includes(user)) {
      toast({
        title: "User Already Added",
        status: "warning",
        duration: 1500,
        position: "top-left",
        isClosable: true,
      });
      return;
    } else {
      setSelectedUsers([...selectedUsers, user]);
    }
  };
  const handleRemoveUser = (id) => {
    setSelectedUsers(selectedUsers.filter((el) => el._id !== id));
  };

  return (
    <>
      {children ? (
        <div
          style={{
            fontSize: "12px",
            margin: " 5px 0",
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
          onClick={onOpen}
        >
          {children}
        </div>
      ) : (
        <ViewIcon onClick={onOpen} />
      )}
      <Modal isOpen={isOpen} color onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg="var(--bg-color-secondary)">
          <ModalHeader
            textAlign={"center"}
            fontSize={40}
            color={"var(--color-white)"}
          >
            Create Group Chat
          </ModalHeader>
          <ModalCloseButton color={"var(--color-white)"} />
          <ModalBody>
            <FormControl>
              <Input
                placeholder="Group Name"
                mb="3"
                onChange={(e) => setGroupChatName(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add Users"
                mb="1"
                onChange={(e) => handleSearchUser(e.target.value)}
              />
            </FormControl>
            <Flex>
              {selectedUsers?.map((el) => (
                <UserBadgeItem
                  key={el._id}
                  el={el}
                  handleFunction={(id) => handleRemoveUser(id)}
                />
              ))}
            </Flex>
            {loading ? (
              <span>loading</span>
            ) : (
              searchResults
                ?.slice(0, 4)
                .map((el) => (
                  <UserList
                    key={el._id}
                    el={el}
                    handleFunction={(user) => handleSelectedUser(user)}
                  />
                ))
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={handleSubmitGroup}>
              Create Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupChatModal;
