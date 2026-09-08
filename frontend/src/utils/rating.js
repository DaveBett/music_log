export function getRatingColor(rating) {
  if (rating >= 100) return "url(#rating-gradient-100)";
  if (rating >= 80) return "#22d3ee";
  if (rating >= 61) return "#22c55e"; 
  if (rating >= 40) return "#eab308"; 
  if (rating >= 20) return "#f97316"; 
  return "#ef4444";                    
}

export function isPerfectRating(rating) {
  return rating >= 100;
}