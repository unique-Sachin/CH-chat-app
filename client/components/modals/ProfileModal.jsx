import { ViewIcon } from "@chakra-ui/icons";
import {
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import React from "react";

const ProfileModal = ({ user, children }) => {
  const { onOpen, isOpen, onClose } = useDisclosure();
  return (
    <>
      <div onClick={onOpen}>{children}</div>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg="var(--bg-color-secondary)">
          <ModalHeader
            textAlign={"center"}
            fontSize={40}
            color={"var(--color-white)"}
          >
            {user.name}
          </ModalHeader>
          <ModalCloseButton color={"var(--color-white)"} />
          <ModalBody>
            <Image src={user.avatar} alt={user.name} width={"40%"} m={"auto"} />
            <Text textAlign={"center"} p={5} fontSize={20}>
              Email: {user.email}
            </Text>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProfileModal;
