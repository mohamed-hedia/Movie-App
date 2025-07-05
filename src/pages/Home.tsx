import { useDispatch, useSelector } from "react-redux";
import { FC, useEffect } from "react";

import PageLayout from "@/components/layout/PageLayout";
import GridLayout from "@/components/layout/GridLayout";
import ItemCard from "@/components/ui/ItemCard";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchRecommendations, fetchTrending } from "@/redux/home/homeSlice";
import TrendingWrapper from "@/components/home/TrendingWrapper";
import TrendingCard from "@/components/home/TrendingCard";
import Heading from "@/components/ui/Heading";

const Home: FC = () => {
  const data = useSelector((state: RootState) => state.home);
  const dispatch = useDispatch<AppDispatch>();

  const { loading, trending, recommendations } = data;
  const trendingData = trending?.slice(0, 5);

  useEffect(() => {
    dispatch(fetchTrending()).then((action) => {
      if (action.meta.requestStatus === "fulfilled") {
        const fetchedTrending = action.payload as typeof trending;
        if (fetchedTrending && fetchedTrending.length > 0) {
          const firstItem = fetchedTrending[0];
          const { id, media_type } = firstItem;
          if (media_type === "movie" || media_type === "tv") {
            dispatch(fetchRecommendations({ id: Number(id), media_type }));
          }
        }
      }
    });
  }, [dispatch]);

  return (
    <PageLayout loading={loading}>
      <Heading as="h1" className="mt-6">
        Trending
      </Heading>
      <TrendingWrapper>
        {!loading && trending && trending.length !== 0
          ? [...(trendingData || []), ...(trendingData || [])].map(
              (item, index: number) => {
                const isMovie = item.media_type === "movie";
                const safeMediaType: "movie" | "tv" = isMovie ? "movie" : "tv";

                return (
                  <TrendingCard
                    key={item.id + index}
                    id={item.id}
                    imgSrc={item.backdrop_path ?? ""}
                    releaseDate={
                      isMovie
                        ? item.release_date?.substring(0, 4) || "N/A"
                        : item.first_air_date?.substring(0, 4) || "N/A"
                    }
                    media_type={safeMediaType}
                    ratings={item.adult ? "18+" : "PG"}
                    title={
                      isMovie
                        ? item.title || "Untitled"
                        : item.name || "Untitled"
                    }
                  />
                );
              }
            )
          : null}
      </TrendingWrapper>

      <section className="w-full">
        <Heading as="h2" className="mt-6">
          Recommendations
        </Heading>
        <GridLayout>
          {!loading && recommendations && recommendations.length !== 0
            ? recommendations.map((item) => {
                const isMovie = item.media_type === "movie";
                const safeMediaType: "movie" | "tv" = isMovie ? "movie" : "tv";

                return (
                  <ItemCard
                    key={item.id}
                    id={item.id}
                    imgSrc={item.backdrop_path ?? ""}
                    releaseDate={
                      isMovie
                        ? item.release_date?.substring(0, 4) || "N/A"
                        : item.first_air_date?.substring(0, 4) || "N/A"
                    }
                    media_type={safeMediaType}
                    ratings={item.adult ? "18+" : "PG"}
                    title={
                      isMovie
                        ? item.title || "Untitled"
                        : item.name || "Untitled"
                    }
                  />
                );
              })
            : null}
        </GridLayout>
      </section>
    </PageLayout>
  );
};

export default Home;
