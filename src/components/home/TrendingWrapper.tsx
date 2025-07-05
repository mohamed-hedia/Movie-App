import { FC, ReactNode } from "react";

interface TrendingWrapperProps {
  children: ReactNode;
}

const TrendingWrapper: FC<TrendingWrapperProps> = ({ children }) => {
  return (
    <div className="w-full overflow-x-scroll no-scrollbar mt-6">
      <ul className="carousel flex gap-6 animate-slide">{children}</ul>
    </div>
  );
};

export default TrendingWrapper;
