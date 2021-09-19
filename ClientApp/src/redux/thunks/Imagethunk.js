import { createAsyncThunk } from "@reduxjs/toolkit";

const GetResizedImage = createAsyncThunk(
  "image/getResizedImage",
  async ({form, reset}, { dispatch, getState, rejectWithValue }) => {
    try {
      const result = await fetch("/Image/ResizeImage", {
        method: "POST",
        body: form,
      });
      console.log(result)
      const blob = await result.blob();
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", result.headers.get("name")); //or any other extension
      const element = document.body.appendChild(link);
      link.click();
      link.parentElement.removeChild(element);
      reset();
      return Promise.resolve(result);
    } catch (ex) {
      console.log(ex);
      return rejectWithValue("Failed to resize the image");
    }
  }
);

const GetResizedImageByUrl = createAsyncThunk(
  "image/getResizedImageByUrl",
  async ({payload, reset}, { dispatch, getState, rejectWithValue }) => {
    try {
      const result = await fetch("/Image/ResizeImageByUrl", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      console.log(result)

      const blob = await result.blob();
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", result.headers.get("name")); //or any other extension
      const element = document.body.appendChild(link);
      link.click();
      link.parentElement.removeChild(element);

      reset();
      return Promise.resolve(result);

    } catch (ex) {
      console.log(ex);

      return rejectWithValue("Failed to resize the image");
    }
  }
);

export { GetResizedImage, GetResizedImageByUrl };
