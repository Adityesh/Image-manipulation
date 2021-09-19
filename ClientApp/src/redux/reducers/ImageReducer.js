import { createSlice } from "@reduxjs/toolkit";
import { GetResizedImage } from "../thunks/Imagethunk";

export const imageSlice = createSlice({
    name : "image",
    initialState : {
        isLoading : false,
        imageSize : 0,
        imageHeight : 0,
        imageWidth : 0,
        imageExtension : '',
        image : null,
        imageUrl : "",
        error : "",
        filters : null
    },
    reducers : {
        toggleLoading : state => {
            state.isLoading = !state.isLoading
        },
        setLoadingOn : state => {
            state.isLoading = true;
        },
        setLoadingOff : state => {
            state.isLoading = false;
        },
        setFilters : (state, action) => {
            state.filters = action.payload;
        },
        setImageUrl : (state, action) => {
            state.imageUrl = action.payload.imageUrl;
            state.imageExtension = action.payload.extension;
        },
        setImage : (state, action) => {
            const { extension } = action.payload;
            state.imageExtension = extension;
        },
    },
    extraReducers : {
        [GetResizedImage.pending] : (state, action) => {
            state.isLoading = true;
        },
        [GetResizedImage.rejected] : (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        },
        [GetResizedImage.fulfilled] : (state, action) => {
            state.isLoading = false
            
        }
    }
});

export const { toggleLoading, setLoadingOff, setLoadingOn, setFilters, setImage, setImageUrl } = imageSlice.actions;

export default imageSlice.reducer;