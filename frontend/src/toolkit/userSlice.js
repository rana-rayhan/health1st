import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { baseUrl } from "../app/apiEndpoint";

// Dispatch fetchPosts method to get data
export const fetchUserPosts = createAsyncThunk("users/fetchUsers", async () => {
  const res = await axios.get(`${baseUrl}/api/post/user-post`, {
    withCredentials: true,
  });
  return res.data;
});

// Create posts slice
const userSlice = createSlice({
  name: "posts",
  initialState: {
    loggedUser: true,
    userPosts: [],
    isLoading: false,
    isError: false,
    getMessage: "",
  },
  reducers: {
    addUserPost: (state, action) => {
      state.userPosts = [action.payload, ...state.userPosts];
    },
    addLoggedUser: (state, action) => {
      state.loggedUser = action.payload;
    },
    deleteUserPost: (state, action) => {
      const filteredPosts = state.userPosts.filter(
        (post) => post._id !== action.payload
      );
      state.userPosts = filteredPosts;
    },
  },
  // Extra reducers for fetchPosts
  extraReducers: (builder) => {
    builder.addCase(fetchUserPosts.pending, (state) => {
      state.isLoading = true;
      state.getMessage = "Loading...";
    });
    builder.addCase(fetchUserPosts.fulfilled, (state, action) => {
      state.isError = false;
      state.isLoading = false;
      state.userPosts = action.payload.payload;
    });
    builder.addCase(fetchUserPosts.rejected, (state, action) => {
      state.userPosts = [];
      state.isLoading = false;
      state.isError = true;
      state.getMessage = action.error.message;
    });
  },
});

export const { addUserPost, deleteUserPost, addLoggedUser } = userSlice.actions;
export default userSlice.reducer;

// step 1: create user slice
// step 2: configure store
// step 3: provide store in index.js
