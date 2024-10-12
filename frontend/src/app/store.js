import { configureStore } from "@reduxjs/toolkit";
import postSlice from "../toolkit/postSlice";
import userSlice from "../toolkit/userSlice";

const store = configureStore({
  reducer: {
    postData: postSlice,
    userPostData: userSlice,
  },
});

export default store;
