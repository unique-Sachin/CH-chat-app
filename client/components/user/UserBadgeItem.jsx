import { CloseIcon } from "@chakra-ui/icons";
import { Box } from "@chakra-ui/react";
import React from "react";

const UserBadgeItem = ({ el, handleFunction }) => {
  return (
    <Box
      bg="purple"
      cursor="pointer"
      px="2"
      py="1"
      color={"white"}
      m="1"
      onClick={() => handleFunction(el._id)}
    >
      {el.name}
      <CloseIcon p="1" />
    </Box>
  );
};

export default UserBadgeItem;
