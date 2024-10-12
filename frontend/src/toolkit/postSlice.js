import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// Dispatch fetchPosts method to get data
export const fetchPosts = createAsyncThunk("posts/fetchPosts", async () => {
  const res = await axios.get("https://health1st.onrender.com/api/post");
  return res.data;
});

// Create posts slice
const postSlice = createSlice({
  name: "posts",
  initialState: {
    postObject: {},
    posts: [],
    isLoading: false,
    isError: false,
    getMessage: "",
  },
  reducers: {
    addPost: (state, action) => {
      state.posts = [action.payload, ...state.posts];
    },

    updatePostComments: (state, action) => {
      const { postId, newComment } = action.payload;
      const postIndex = state.posts.findIndex((post) => post._id === postId);
      if (postIndex !== -1) {
        state.posts[postIndex].comments.push(newComment);
      }
    },

    deletePostComment: (state, action) => {
      const { postId, commentId } = action.payload;
      const post = state.posts.find((post) => post._id === postId);
      if (post) {
        post.comments = post.comments.filter(
          (comment) => comment._id !== commentId
        );
      }
    },

    deletePost: (state, action) => {
      const filteredPosts = state.posts.filter(
        (post) => post._id !== action.payload
      );
      state.posts = filteredPosts;
    },
  },
  // Extra reducers for fetchPosts
  extraReducers: (builder) => {
    builder.addCase(fetchPosts.pending, (state) => {
      state.isLoading = true;
      state.getMessage = "Loading...";
    });
    builder.addCase(fetchPosts.fulfilled, (state, action) => {
      state.isError = false;
      state.isLoading = false;
      state.posts = action.payload.payload.posts;
      state.postObject = action.payload;
    });
    builder.addCase(fetchPosts.rejected, (state, action) => {
      state.posts = [];
      state.isLoading = false;
      state.isError = true;
      state.getMessage = action.error.message;
    });
  },
});

export const { addPost, updatePostComments, deletePostComment, deletePost } =
  postSlice.actions;
export default postSlice.reducer;

// step 1: create user slice
// step 2: configure store
// step 3: provide store in index.js
