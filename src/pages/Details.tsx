import { FC, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import { AppDispatch, RootState } from "@/redux/store";
import { fetchDetails } from "@/redux/details/detailsSlice";
import DetailsHeader from "@/components/details/DetailsHeader";
import GridLayout from "@/components/layout/GridLayout";
import { fetchRecommendations } from "@/redux/home/homeSlice";
import ItemCard from "@/components/ui/ItemCard";
import Heading from "@/components/ui/Heading";
import Loading from "@/components/common/Loading";
import { addBookmark } from "@/redux/bookmarked/bookmarkSlice";

const Details: FC = () => {
  const data = useSelector((state: RootState) => state.details);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { loading, details, recommendations } = data;
  const { media_type, id } = useParams<{ media_type: string; id: string }>();

  const mediaType: "movie" | "tv" | null =
    media_type === "movie" ? "movie" : media_type === "tv" ? "tv" : null;

  useEffect(() => {
    if (mediaType && id) {
      dispatch(fetchDetails({ media_type: mediaType, id })).then((action) => {
        if (fetchDetails.fulfilled.match(action)) {
          const detailsData = action.payload;
          if (detailsData?.id && mediaType) {
            dispatch(
              fetchRecommendations({
                id: detailsData.id.toString(),
                media_type: mediaType,
              })
            );
          }
        }
      });
    }
  }, [dispatch, id, mediaType]);

  const handleBookmark = () => {
    const session_id = localStorage.getItem("session_id");
    if (!session_id) {
      navigate("/login");
      return;
    }
    if (mediaType && id) {
      dispatch(
        addBookmark({ id: Number(id), media_type: mediaType, session_id })
      );
    }
  };

  return (
    <main className="w-full md:w-[calc(100%-8rem)] pb-6 md:ml-32 md:pl-0">
      {loading ? (
        <Loading />
      ) : (
        <>
          <div>
            {!loading && details && mediaType ? (
              <DetailsHeader
                id={details.id}
                posterUrl={details.poster_path}
                title={String(
                  mediaType === "movie"
                    ? details.title || "No Title"
                    : details.name || "No Title"
                )}
                imageSrc={details.backdrop_path}
                release_date={String(
                  mediaType === "movie"
                    ? details.release_date?.substring(0, 4) || "N/A"
                    : details.first_air_date?.substring(0, 4) || "N/A"
                )}
                media_type={mediaType}
                genres={details.genres}
                rating={details.vote_average}
                overview={details.overview}
              />
            ) : null}
          </div>

          <div className="px-6 my-6">
            <button
              onClick={handleBookmark}
              className="bg-orange text-white rounded-md px-4 py-2 hover:bg-white hover:text-black transition"
            >
              Add Bookmark
            </button>
          </div>

          <section className="pl-6 md:pl-0">
            <Heading as="h2">Recommendations</Heading>
            <GridLayout>
              {!loading && recommendations && recommendations.length !== 0
                ? recommendations.map((item) => {
                    const isMovie = item.media_type === "movie";
                    return (
                      <ItemCard
                        key={item.id}
                        id={item.id}
                        imgSrc={item.backdrop_path}
                        releaseDate={String(
                          isMovie
                            ? item.release_date?.substring(0, 4) || "N/A"
                            : item.first_air_date?.substring(0, 4) || "N/A"
                        )}
                        media_type={isMovie ? "movie" : "tv"}
                        ratings={item.adult ? "18+" : "PG"}
                        title={String(
                          isMovie
                            ? item.title || "No Title"
                            : item.name || "No Title"
                        )}
                      />
                    );
                  })
                : null}
            </GridLayout>
          </section>
        </>
      )}
    </main>
  );
};

export default Details;
