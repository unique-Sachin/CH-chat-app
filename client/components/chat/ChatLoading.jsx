import { Skeleton, Stack } from "@chakra-ui/react";
import React from "react";

const ChatLoading = () => {
  return (
    <Stack>
      <Skeleton height={"60px"} my={1} borderRadius={15} />
      <Skeleton height={"60px"} my={1} borderRadius={15} />
      <Skeleton height={"60px"} my={1} borderRadius={15} />
      <Skeleton height={"60px"} my={1} borderRadius={15} />
      <Skeleton height={"60px"} my={1} borderRadius={15} />
      <Skeleton height={"60px"} my={1} borderRadius={15} />
      <Skeleton height={"60px"} my={1} borderRadius={15} />
    </Stack>
  );
};

export default ChatLoading;
