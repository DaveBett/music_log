const Review = (artist, title) => {
  return (
    <div className="review">
      <h2>{title}</h2>
      <h3>{artist}</h3>
    </div>
  )
}

export default Review;