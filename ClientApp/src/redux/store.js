import { configureStore } from '@reduxjs/toolkit';
import ThemeReducer from './reducers/ThemeReducer';
import ImageReducer from './reducers/ImageReducer';
import PostsReducer from './reducers/PostsReducer';

export default configureStore({
    devTools : true,
    reducer : {
        theme : ThemeReducer,
        image : ImageReducer,
        posts : PostsReducer
    },
});

