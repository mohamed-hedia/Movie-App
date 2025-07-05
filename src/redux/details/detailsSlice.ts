import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { fetchRecommendations, HomeData } from "../home/homeSlice";

type DetailsData = {
  id: number;
  backdrop_path: string;
  release_date?: string;
  first_air_date?: string;
  adult: boolean;
  title?: string;
  name?: string;
  poster_path: string;
  genres: { id: number; name: string }[];
  vote_average: number;
  overview: string;
};

interface DetailsState {
  loading: boolean;
  details?: DetailsData;
  recommendations?: HomeData[];
  error?: string;
}

type Param = string | undefined;

const initialState: DetailsState = {
  loading: false,
  details: undefined,
  recommendations: undefined,
  error: undefined,
};

export const fetchDetails = createAsyncThunk(
  "details/fetchDetails",
  async ({ media_type, id }: { media_type: Param; id: Param }) => {
    const params = {
      api_key: import.meta.env.VITE_APP_API_KEY,
    };
    const response = await axios.get(
      `https://api.themoviedb.org/3/${media_type}/${id}`,
      { params }
    );
    return response.data;
  }
);

export const detailsSlice = createSlice({
  name: "details",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDetails.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(fetchDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.details = action.payload;
      })
      .addCase(fetchDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });

    builder
      .addCase(fetchRecommendations.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(fetchRecommendations.fulfilled, (state, action) => {
        state.loading = false;
        state.recommendations = action.payload;
      })
      .addCase(fetchRecommendations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default detailsSlice.reducer;
