import { createAsyncThunk } from "@reduxjs/toolkit";

const GetResizedImage = createAsyncThunk(
  "image/getResizedImage",
  async (payload, {dispatch, getState ,rejectWithValue}) => {
    try {
    } catch (ex) {
        rejectWithValue("Failed to resize the image");
    }
  }
);

const GetResizedImageByUrl = createAsyncThunk(
    "image/getResizedImageByUrl",
    async (payload, {dispatch, getState ,rejectWithValue}) => {
      try {
      } catch (ex) {
          rejectWithValue("Failed to resize the image");
      }
    }
  );


export { 
    GetResizedImage,
    GetResizedImageByUrl
}
