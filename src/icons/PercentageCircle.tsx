import { FC } from "react";

type PercentageCircleProps = {
  rating: number;
};

const PercentageCircle: FC<PercentageCircleProps> = ({ rating }) => {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (circumference * rating) / 100;

  return (
    <div className="relative w-10 h-10">
      <svg className="w-full h-full" viewBox="0 0 100 100">
        {/* Background circle */}
        <circle
          className="text-[#00000040] stroke-current"
          strokeWidth={10}
          cx={50}
          cy={50}
          r={radius}
          fill="transparent"
        />
        {/* Progress circle */}
        <circle
          className="text-orange stroke-current"
          strokeWidth={10}
          strokeLinecap="round"
          cx={50}
          cy={50}
          r={radius}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
        {/* Center text */}
        <text
          x={50}
          y={53}
          fontFamily="Verdana"
          fontSize={26}
          textAnchor="middle"
          alignmentBaseline="middle"
          className="fill-white"
        >
          {rating.toFixed(0)}
        </text>
      </svg>
    </div>
  );
};

export default PercentageCircle;
