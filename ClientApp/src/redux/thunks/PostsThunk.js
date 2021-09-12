import { createAsyncThunk } from "@reduxjs/toolkit";

const GetPosts = createAsyncThunk(
  "posts/getPosts",
  async (payload, { dispatch, getState, rejectWithValue }) => {

    try {
      const url = payload === undefined || payload === null
        ? "https://jsonplaceholder.typicode.com/posts"
        : `https://jsonplaceholder.typicode.com/posts?_limit=${payload}`;
      const response = await fetch(url);
      const result = response.json();
      return result;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export { GetPosts };
