import { getRatingColor, isPerfectRating } from "../../utils/rating";

export default function RatingRing({ rating, size = 56, strokeWidth = 5 }) {
  const hasRating = rating !== null && rating !== undefined;
  const value = hasRating ? Math.max(0, Math.min(100, rating)) : 0;

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - value / 100);

  const color = hasRating ? getRatingColor(value) : "#3b3b3b";
  const perfect = hasRating && isPerfectRating(value);

  return (
    <div className={`rating-ring ${perfect ? "rating-ring-perfect" : ""}`} style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <defs>
          <linearGradient id="rating-gradient-100" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4caf50" />
            <stop offset="100%" stopColor="#6d28d9" />
          </linearGradient>
        </defs>

        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#343434"
          strokeWidth={strokeWidth}
        />
        {hasRating && (
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
            style={{ transition: "stroke-dashoffset 0.4s ease, stroke 0.4s ease" }}
          />
        )}
      </svg>
      <span
        className="rating-ring-value"
        style={{ color: hasRating ? (perfect ? "#fff" : color) : "#bdbdbd" }}
      >
        {hasRating ? value : "-"}
      </span>
    </div>
  );
}