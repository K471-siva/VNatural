import React from "react";
import { Star } from "lucide-react";

export const Stars = ({ rating, size = 16 }) => {
  const rounded = Math.round(rating * 2) / 2; // round to nearest 0.5
  const fullStars = Math.floor(rounded);
  const hasHalf = rounded % 1 !== 0;

  return (
    <div className="stars-container" style={{ display: "flex", gap: "2px" }}>
      {[...Array(5)].map((_, i) => {
        const starNum = i + 1;
        let fill = "none";
        let color = "#cbd5e1"; // slate-300

        if (starNum <= fullStars) {
          fill = "#fbbf24"; // amber-400
          color = "#fbbf24";
        } else if (starNum === fullStars + 1 && hasHalf) {
          // Approximate half star with gold border
          fill = "rgba(251, 191, 36, 0.4)";
          color = "#fbbf24";
        }

        return <Star key={i} size={size} fill={fill} color={color} style={{ strokeWidth: 1.5 }} />;
      })}
    </div>
  );
};
