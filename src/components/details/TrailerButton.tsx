import { IoPlayCircleOutline } from "react-icons/io5";

import Button from "../ui/Button";

const TrailerButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <Button rounded="full" className="flex items-center pr-3" onClick={onClick}>
      <IoPlayCircleOutline className="text-3xl mr-1" />
      Trailer
    </Button>
  );
};
export default TrailerButton;
