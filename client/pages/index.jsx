import styles from "../styles/Home.module.css";
import {
  Container,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import Signup from "../components/auth/Signup";
import Login from "../components/auth/Login";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";

const Home = () => {
  const router = useRouter();
  const { user } = useSelector((state) => state);
  useEffect(() => {
    if (user?.token) {
      router.push("/chat");
    }
  }, []);
  return (
    !user?.token && (
      <div className={styles.App}>
        <Container
          bg={"white"}
          p={"20px"}
          borderRadius={"10px"}
          boxShadow={"rgba(0, 0, 0, 0.9) 0px 22px 70px 8px"}
        >
          <Tabs variant="soft-rounded">
            <TabList>
              <Tab color={"black"} width={"50%"}>
                SIGNUP
              </Tab>
              <Tab color={"black"} width={"50%"}>
                LOGIN
              </Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <Signup />
              </TabPanel>
              <TabPanel>
                <Login />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Container>
      </div>
    )
  );
};

export default Home;
