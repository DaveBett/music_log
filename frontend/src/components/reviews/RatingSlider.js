export default function RatingSlider({ value, onChange }) {
  const numericValue = value === "" ? null : Number(value);

  function clamp(n) {
    return Math.min(100, Math.max(0, n));
  }

  function handleSliderChange(e) {
    onChange(String(e.target.value));
  }

  function increment() {
    const current = numericValue ?? 0;
    onChange(String(clamp(current + 1)));
  }

  function decrement() {
    const current = numericValue ?? 0;
    onChange(String(clamp(current - 1)));
  }

  function clearRating() {
    onChange("");
  }

  return (
    <div className="rating-slider">
      <div className="rating-slider-controls">
        <button
          type="button"
          className="rating-step-button"
          onClick={decrement}
          aria-label="Decrease rating"
        >
          −
        </button>

        <input
          id="rating-slider"
          type="range"
          min={0}
          max={100}
          step={1}
          value={numericValue ?? 0}
          onChange={handleSliderChange}
          className="rating-range"
        />

        <button
          type="button"
          className="rating-step-button"
          onClick={increment}
          aria-label="Increase rating"
        >
          +
        </button>
      </div>

      <div className="rating-slider-value">
        {numericValue === null ? (
          <span>No rating</span>
        ) : (
          <span>{numericValue} / 100</span>
        )}

        {numericValue !== null && (
          <button
            type="button"
            className="rating-clear-button"
            onClick={clearRating}
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
}