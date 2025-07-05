import { FC, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { IoBookmark, IoBookmarkOutline } from "react-icons/io5";

import {
  addBookmark,
  removeBookmark,
  fetchBookmark,
} from "@/redux/bookmarked/bookmarkSlice";
import { AppDispatch } from "@/redux/store";
import { useLocation, useNavigate } from "react-router-dom";
import { checkBookmarked } from "@/lib/api";

type BookMarkProps = {
  id: number;
  media_type: "movie" | "tv";
  className?: string;
};

const BookMark: FC<BookMarkProps> = ({ id, media_type, className }) => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const session_id = localStorage.getItem("session_id");

  const handleClick = async () => {
    if (!session_id) {
      console.error("Session ID not found!");
      return;
    }

    console.log("Adding/removing bookmark for:", { id, media_type });

    if (isBookmarked) {
      await dispatch(removeBookmark({ id, media_type, session_id }));
      await dispatch(fetchBookmark());
      if (pathname === "/bookmarked") navigate(0);
      setIsBookmarked(false);
    } else {
      await dispatch(addBookmark({ id, media_type, session_id }));
      await dispatch(fetchBookmark());
      setIsBookmarked(true);
    }
  };

  useEffect(() => {
    if (!isBookmarked && session_id) {
      checkBookmarked({ id, media_type }).then((res) => setIsBookmarked(res));
    }
  }, [id, media_type, session_id]);

  return (
    <div
      onClick={handleClick}
      className={`group rounded-full bg-[#00000070] hover:bg-white active:bg-orange hover:opacity-100 flex justify-center items-center cursor-pointer ${className}`}
    >
      {isBookmarked ? (
        <IoBookmark className="text-xl text-white group-hover:text-black" />
      ) : (
        <IoBookmarkOutline className="text-xl text-white group-hover:text-black" />
      )}
    </div>
  );
};

export default BookMark;
