import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { chatSlice } from "../../store/slices/chatSlice";
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
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import UserBadgeItem from "../user/UserBadgeItem";
import axios from "axios";
import UserList from "../user/UserList";

const UpdateGroupChatModal = ({ children, handleFetchMessages }) => {
  const { chat, user } = useSelector((state) => state);
  const { selectedChat, fetchChat } = chat;
  const inputUser = useRef(null);
  const { setSelectedChat, setFetchChat } = chatSlice.actions;
  const dispatch = useDispatch();
  const [groupChatName, setGroupChatName] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const { onOpen, isOpen, onClose } = useDisclosure();

  const handleRenameGroup = async () => {
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
        const { data } = await axios.put(
          `https://sandesh-app-server.adaptable.app/api/chat/grouprename`,
          {
            chatName: groupChatName,
            chatId: selectedChat._id,
          }
        );
        dispatch(setSelectedChat(data));
        dispatch(setFetchChat(!fetchChat));
        setGroupChatName("");
        onClose();
        toast({
          title: "Group Name Updated",
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
        `https://sandesh-app-server.adaptable.app/api?search=${input}`
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

  const handleRemoveUser = async (id) => {
    if (selectedChat.admin._id !== user.id && user.id !== id) {
      toast({
        title: "You are not an Admin",
        status: "warning",
        duration: 1500,
        position: "top-left",
        isClosable: true,
      });
      return;
    } else {
      try {
        const { data } = await axios.put(
          `https://sandesh-app-server.adaptable.app/api/chat/groupremove`,
          { chatId: selectedChat._id, userId: id }
        );
        if (id === user.id) {
          dispatch(setSelectedChat({}));
          handleFetchMessages();
          toast({
            title: "You leaved from Group",
            status: "success",
            duration: 1500,
            position: "top-left",
            isClosable: true,
          });
          onClose();
        } else {
          dispatch(setSelectedChat(data));
        }
        dispatch(setFetchChat(!fetchChat));
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

  const handleAddUser = async (adduser) => {
    if (selectedChat.admin._id !== user.id) {
      toast({
        title: "You are not an Admin",
        status: "warning",
        duration: 1500,
        position: "top-left",
        isClosable: true,
      });
      return;
    } else if (selectedChat.users.find((el) => el._id === adduser._id)) {
      toast({
        title: "User Already Added",
        status: "warning",
        duration: 1500,
        position: "top-left",
        isClosable: true,
      });
      return;
    } else {
      try {
        const { data } = await axios.put(
          `https://sandesh-app-server.adaptable.app/api/chat/groupadd`,
          { chatId: selectedChat._id, userId: adduser._id }
        );
        dispatch(setSelectedChat(data));
        dispatch(setFetchChat(!fetchChat));
        setSearchResults([]);
        inputUser.current.value = "";
        inputUser.current.focus();
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

  return (
    <>
      <span onClick={onOpen}>{children}</span>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg="var(--bg-color-secondary)">
          <ModalHeader
            textAlign={"center"}
            fontSize={40}
            color={"var(--color-white)"}
          >
            {selectedChat.chatName}
          </ModalHeader>
          <ModalCloseButton color={"var(--color-white)"} />
          <ModalBody>
            <Flex>
              {selectedChat.users?.map((el) => (
                <UserBadgeItem
                  key={el._id}
                  el={el}
                  handleFunction={(id) => handleRemoveUser(id)}
                />
              ))}
            </Flex>
            <FormControl>
              <Flex p="3">
                <Input
                  value={groupChatName}
                  placeholder="Edit Group Name"
                  mx="3"
                  onChange={(e) => setGroupChatName(e.target.value)}
                />
                <Button onClick={handleRenameGroup}>Update</Button>
              </Flex>
            </FormControl>
            <FormControl>
              <Input
                ref={inputUser}
                placeholder="Add Users"
                mb="1"
                onChange={(e) => handleSearchUser(e.target.value)}
              />
            </FormControl>
            {loading ? (
              <span>loading</span>
            ) : (
              searchResults
                ?.slice(0, 4)
                .map((el) => (
                  <UserList
                    key={el._id}
                    el={el}
                    handleFunction={(user) => handleAddUser(user)}
                  />
                ))
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="red" onClick={() => handleRemoveUser(user.id)}>
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateGroupChatModal;
