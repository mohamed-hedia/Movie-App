import { FC } from "react";
import { IoPlayCircleOutline } from "react-icons/io5";

import Button from "../ui/Button";

interface TrailerButtonProps {
  onClick: () => void;
}

const TrailerButton: FC<TrailerButtonProps> = ({ onClick }) => {
  return (
    <Button rounded="full" className="flex items-center pr-3" onClick={onClick}>
      <IoPlayCircleOutline className="text-3xl mr-1" />
      Trailer
    </Button>
  );
};

export default TrailerButton;
