import { createSlice } from "@reduxjs/toolkit";
import { GetPosts } from "../thunks/PostsThunk";

export const postSlice = createSlice({
    name : "posts",
    initialState : {
        isLoading : false,
        posts : [],
        error : ""
    },
    reducers : {
        
    },
    extraReducers : {
        [GetPosts.pending] : (state, action) => {
            state.isLoading = true;
        },
        [GetPosts.rejected] : (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        },
        [GetPosts.fulfilled] : (state, action) => {
            state.isLoading = false;
            state.posts = action.payload;
        }
    }
})

export default postSlice.reducer;