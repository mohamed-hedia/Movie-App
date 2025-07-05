import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

type ItemData = {
  id: number;
  media_type: string;
  release_date?: string;
  first_air_date?: string;
  title?: string;
  name?: string;
  backdrop_path: string;
  adult: boolean;
};

type BookmarkData = ItemData[];

export interface BookmarkState {
  loading: boolean;
  bookmarks: BookmarkData | null;
  status: boolean;
  error: string | null;
}

const initialState: BookmarkState = {
  loading: false,
  bookmarks: null,
  status: false,
  error: null,
};

const API_KEY = import.meta.env.VITE_APP_API_KEY;
const MOVIE_LIST_ID = import.meta.env.VITE_APP_MOVIE_LIST_ID;
const TV_LIST_ID = import.meta.env.VITE_APP_TV_SHOWS_LIST_ID;

export const fetchBookmark = createAsyncThunk(
  "bookmark/fetchBookmark",
  async () => {
    const params = { api_key: API_KEY };

    const movieRes = await axios.get(
      `https://api.themoviedb.org/3/list/${MOVIE_LIST_ID}`,
      { params }
    );

    const tvRes = await axios.get(
      `https://api.themoviedb.org/3/list/${TV_LIST_ID}`,
      { params }
    );

    return [...(movieRes.data.items || []), ...(tvRes.data.items || [])];
  }
);

export const addBookmark = createAsyncThunk(
  "bookmark/addBookmark",
  async ({
    id,
    media_type,
    session_id,
  }: {
    id: number;
    media_type: string;
    session_id: string | null;
  }) => {
    const listId = media_type === "movie" ? MOVIE_LIST_ID : TV_LIST_ID;
    const params = { api_key: API_KEY, session_id };
    const response = await axios.post(
      `https://api.themoviedb.org/3/list/${listId}/add_item`,
      { media_id: id },
      { params }
    );
    return response.data;
  }
);

export const removeBookmark = createAsyncThunk(
  "bookmark/removeBookmark",
  async ({
    id,
    media_type,
    session_id,
  }: {
    id: number;
    media_type: string;
    session_id: string | null;
  }) => {
    const listId = media_type === "movie" ? MOVIE_LIST_ID : TV_LIST_ID;
    const params = { api_key: API_KEY, session_id };
    const response = await axios.post(
      `https://api.themoviedb.org/3/list/${listId}/remove_item`,
      { media_id: id },
      { params }
    );
    return response.data;
  }
);

const bookmarkSlice = createSlice({
  name: "bookmark",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBookmark.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBookmark.fulfilled, (state, action) => {
        state.loading = false;
        state.bookmarks = action.payload;
      })
      .addCase(fetchBookmark.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch bookmarks";
      });
    builder
      .addCase(addBookmark.pending, (state) => {
        state.loading = true;
      })
      .addCase(addBookmark.fulfilled, (state) => {
        state.loading = false;
        state.status = true;
      })
      .addCase(addBookmark.rejected, (state, action) => {
        state.loading = false;
        state.status = false;
        state.error = action.error.message || "Failed to add bookmark";
      });
    builder
      .addCase(removeBookmark.pending, (state) => {
        state.loading = true;
      })
      .addCase(removeBookmark.fulfilled, (state) => {
        state.loading = false;
        state.status = true;
      })
      .addCase(removeBookmark.rejected, (state, action) => {
        state.loading = false;
        state.status = false;
        state.error = action.error.message || "Failed to remove bookmark";
      });
  },
});

export default bookmarkSlice.reducer;
