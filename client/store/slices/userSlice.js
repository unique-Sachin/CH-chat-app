import { createSlice } from "@reduxjs/toolkit";

let userInfo;
if (typeof window !== "undefined") {
  userInfo = JSON.parse(localStorage.getItem("userInfo"));
}
export const userSlice = createSlice({
  name: "user",
  initialState: userInfo || {},
  reducers: {
    loginUser(state, { payload }) {
      localStorage.setItem("userInfo", JSON.stringify(payload));
      return JSON.parse(localStorage.getItem("userInfo"));
    },
    logoutUser(state, { payload }) {
      localStorage.removeItem("userInfo");
      return {};
    },
  },
});
