import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { userSlice } from "../../store/slices/userSlice";
import { useRouter } from "next/router";

const Login = () => {
  const dispatch = useDispatch();
  const { loginUser } = userSlice.actions;
  const toast = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [input, setInput] = useState({
    email: "",
    password: "",
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
  const handleLogin = async () => {
    if (input.email == "" || input.password == "") {
      toastAlert("All fields are mandatory", "warning");
    } else if (!input.email.includes("@")) {
      toastAlert("Plase enter valid email", "warning");
    } else {
      setLoading(true);
      try {
        const value = {
          email: input.email,
          password: input.password,
        };
        const res = await axios.post(
          `https://sandesh-app-server.adaptable.app/api/login`,
          value
        );
        setLoading(false);
        toastAlert(res.data.msg, "success");
        dispatch(loginUser(res.data));
        router.push("/chat");
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
      <FormControl isRequired my={5}>
        <FormLabel>Email</FormLabel>
        <Input
          color={"black"}
          value={input.email}
          onChange={(e) => setInput({ ...input, email: e.target.value })}
          type="email"
          placeholder="Enter Your Email"
        />
      </FormControl>
      <FormControl isRequired my={5}>
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
      <br />
      <Button
        colorScheme={"blue"}
        width={"60%"}
        onClick={handleLogin}
        isLoading={loading}
      >
        Submit
      </Button>
    </VStack>
  );
};

export default Login;
