import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Radio,
  RadioGroup,
  Stack,
  VStack,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useState } from "react";

const Signup = () => {
  const toast = useToast();
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState({
    name: "",
    email: "",
    password: "",
    gender: "Male",
  });

  const toastAlert = (title, status) => {
    toast({
      title,
      status,
      duration: 1500,
      position: "top-left",
      isClosable: true,
    });
  };
  const handleSignUp = async () => {
    if (input.name == "" || input.email == "" || input.password == "") {
      toastAlert("All fields are mandatory", "warning");
    } else if (!input.email.includes("@")) {
      toastAlert("Plase enter valid email", "warning");
    } else {
      setLoading(true);
      try {
        const value = {
          name: input.name,
          email: input.email,
          password: input.password,
          gender: input.gender,
        };
        const res = await axios.post(
          `https://ch-chat-app-production.up.railway.app/api/register`,
          value
        );
        setLoading(false);
        toastAlert(res.data.msg, "success");
      } catch (error) {
        setLoading(false);
        if (error.response.data !== undefined) {
          toastAlert(error.response.data, "error");
        } else {
          toastAlert("Network Error", "error");
        }
      }
    }
  };
  return (
    <VStack>
      <FormControl isRequired>
        <FormLabel>Name</FormLabel>
        <Input
          color={"black"}
          value={input.name}
          onChange={(e) => setInput({ ...input, name: e.target.value })}
          type="text"
          placeholder="Enter Your Name"
        />
      </FormControl>
      <FormControl isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          color={"black"}
          value={input.email}
          onChange={(e) => setInput({ ...input, email: e.target.value })}
          type="email"
          placeholder="Enter Your Email"
        />
      </FormControl>
      <FormControl isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            color={"black"}
            value={input.password}
            onChange={(e) => setInput({ ...input, password: e.target.value })}
            type={show ? "text" : "password"}
            placeholder="Enter Your Password"
          />
          <InputRightElement>
            {show ? (
              <ViewIcon cursor={"pointer"} onClick={() => setShow(!show)} />
            ) : (
              <ViewOffIcon cursor={"pointer"} onClick={() => setShow(!show)} />
            )}
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl>
        <FormLabel>Gender</FormLabel>
        <RadioGroup
          value={input.gender}
          onChange={(e) => setInput({ ...input, gender: e })}
          defaultValue="Male"
          mb={"8"}
        >
          <Stack spacing={4} direction="row" px={5}>
            <Radio value="Male">Male</Radio>
            <Radio value="Female">Female</Radio>
            <Radio value="Other">Other</Radio>
          </Stack>
        </RadioGroup>
      </FormControl>
      <Button
        colorScheme={"blue"}
        width={"60%"}
        onClick={handleSignUp}
        isLoading={loading}
      >
        Submit
      </Button>
    </VStack>
  );
};

export default Signup;
