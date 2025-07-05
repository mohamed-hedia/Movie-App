import axios from "axios";

const API_KEY = import.meta.env.VITE_APP_API_KEY;
const SESSION_ID = import.meta.env.VITE_APP_SESSION_ID;
const MOVIE_LIST_ID = import.meta.env.VITE_APP_MOVIE_LIST_ID;
const TV_LIST_ID = import.meta.env.VITE_APP_TV_SHOWS_LIST_ID;

const getListIdForType = (media_type: string) => {
  if (media_type === "movie") return MOVIE_LIST_ID;
  if (media_type === "tv") return TV_LIST_ID;
  throw new Error(`Unsupported media_type: ${media_type}`);
};

export const addBookmark = async ({
  id,
  media_type,
}: {
  id: number;
  media_type: string;
}) => {
  const listId = getListIdForType(media_type);
  const params = { api_key: API_KEY, session_id: SESSION_ID };

  try {
    const response = await axios.post(
      `https://api.themoviedb.org/3/list/${listId}/add_item`,
      { media_id: id },
      { params }
    );
    return response.data;
  } catch (error) {
    console.error("Error adding bookmark:", error);
    throw error;
  }
};

export const removeBookmark = async ({
  id,
  media_type,
}: {
  id: number;
  media_type: string;
}) => {
  const listId = getListIdForType(media_type);
  const params = { api_key: API_KEY, session_id: SESSION_ID };

  try {
    const response = await axios.post(
      `https://api.themoviedb.org/3/list/${listId}/remove_item`,
      { media_id: id },
      { params }
    );
    return response.data;
  } catch (error) {
    console.error("Error removing bookmark:", error);
    throw error;
  }
};

export const checkBookmarked = async ({
  id,
  media_type,
}: {
  id: number;
  media_type: string;
}) => {
  const listId = getListIdForType(media_type);
  const params = { api_key: API_KEY, movie_id: id };

  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/list/${listId}/item_status`,
      { params }
    );
    return response.data.item_present;
  } catch (error) {
    console.error("Error checking bookmarked:", error);
    return false;
  }
};

export const fetchBookmarkedMovies = async () => {
  const params = { api_key: API_KEY };
  try {
    const movieRes = await axios.get(
      `https://api.themoviedb.org/3/list/${MOVIE_LIST_ID}`,
      { params }
    );
    const tvRes = await axios.get(
      `https://api.themoviedb.org/3/list/${TV_LIST_ID}`,
      { params }
    );

    return [...movieRes.data.items, ...tvRes.data.items];
  } catch (error) {
    console.error("Error fetching bookmarked items:", error);
    return [];
  }
};
