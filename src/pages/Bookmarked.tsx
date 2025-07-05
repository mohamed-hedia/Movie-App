import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import GridLayout from "@/components/layout/GridLayout";
import PageLayout from "@/components/layout/PageLayout";
import Heading from "@/components/ui/Heading";
import ItemCard from "@/components/ui/ItemCard";
import { fetchBookmark } from "@/redux/bookmarked/bookmarkSlice";
import { AppDispatch, RootState } from "@/redux/store";

const Bookmarked = () => {
  const { loading, bookmarks } = useSelector(
    (state: RootState) => state.bookmark
  );
  const dispatch = useDispatch<AppDispatch>();

  const movies = bookmarks
    ? bookmarks.filter((item) => item.media_type === "movie")
    : [];
  const tvShows = bookmarks
    ? bookmarks.filter((item) => item.media_type === "tv")
    : [];

  useEffect(() => {
    dispatch(fetchBookmark());
  }, [dispatch]);

  return (
    <PageLayout loading={loading}>
      {!loading && (
        <>
          <section>
            <Heading as="h2" className="mt-6">
              Bookmarked Movies
            </Heading>
            {movies.length !== 0 ? (
              <GridLayout>
                {movies.map((movie) => (
                  <ItemCard
                    key={movie.id}
                    id={movie.id}
                    imgSrc={movie.backdrop_path}
                    releaseDate={
                      movie.release_date
                        ? movie.release_date.substring(0, 4)
                        : "N/A"
                    }
                    media_type="movie"
                    ratings={movie.adult ? "18+" : "PG"}
                    title={movie.title ?? "Untitled"}
                  />
                ))}
              </GridLayout>
            ) : (
              <div>No Bookmarked Movies...</div>
            )}
          </section>

          <section>
            <Heading as="h2" className="mt-6">
              Bookmarked TV Shows
            </Heading>
            {tvShows.length !== 0 ? (
              <GridLayout>
                {tvShows.map((tvShow) => (
                  <ItemCard
                    key={tvShow.id}
                    id={tvShow.id}
                    imgSrc={tvShow.backdrop_path}
                    releaseDate={
                      tvShow.first_air_date
                        ? tvShow.first_air_date.substring(0, 4)
                        : "N/A"
                    }
                    media_type="tv"
                    ratings={tvShow.adult ? "18+" : "PG"}
                    title={tvShow.name ?? "Untitled"}
                  />
                ))}
              </GridLayout>
            ) : (
              <div>No Bookmarked TV Shows...</div>
            )}
          </section>
        </>
      )}
    </PageLayout>
  );
};

export default Bookmarked;
