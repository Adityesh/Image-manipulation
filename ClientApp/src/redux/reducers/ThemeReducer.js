import { createSlice } from "@reduxjs/toolkit";

export const themeSlice = createSlice({
    name : "theme",
    initialState : {
        isDark : false
    },
    reducers : {
        toggleTheme : (state) => {
            state.isDark = !state.isDark
        },

        setDark : (state) => {
            state.isDark = true;
        },

        setLight : state => {
            state.isDark = false;
        }

    }
});

export const { toggleTheme, setDark, setLight  } = themeSlice.actions;

export default themeSlice.reducer;