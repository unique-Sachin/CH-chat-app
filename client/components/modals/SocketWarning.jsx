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
import React, { useEffect } from "react";

const SocketWarning = () => {
  const { onOpen, isOpen, onClose } = useDisclosure();
  useEffect(() => {
    onOpen();
  }, []);

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg="var(--bg-color-secondary)">
          <ModalHeader
            textAlign={"center"}
            fontSize={40}
            color={"var(--color-white)"}
          >
            <Text fontSize={30} fontWeight={"bold"}>
              Server Warning
            </Text>
          </ModalHeader>
          <ModalCloseButton color={"var(--color-white)"} />
          <ModalBody color={"var(--color-white)"} textAlign={"center"}>
            <Text lineHeight={"6"}>
              Please note that our chat app is currently running on a free
              server, which means that you may not experience real-time
              messaging. We apologize for any inconvenience this may cause. If
              you'd like to test the app's real-time functionality, please feel
              free to give us a call at{" "}
              <Text
                display={"inline"}
                fontSize={20}
                color={"var(--chat-color-primary)"}
                fontWeight={"bold"}
              >
                7080623634
              </Text>{" "}
              and ask for Sachin. <br /> <br />
              Thank you for using our app!
            </Text>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default SocketWarning;
