import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getReviews,
  getUserReviews,
  deleteReview
} from "../../api/endpoints";

import ReviewList from "../reviews/ReviewList";

const PAGE_SIZE = 6;
const SIBLING_COUNT = 2;

const SORT_OPTIONS = [
  { value: "recent", label: "Most Recent" },
  { value: "artist", label: "Artist" },
  { value: "album", label: "Album" },
  { value: "year", label: "Year" },
  { value: "rating", label: "Rating" }
];

export default function UserReviewSection({ username, editable = false }) {
  const navigate = useNavigate();

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState("recent");
  const [sortDirection, setSortDirection] = useState("desc");
  const [page, setPage] = useState(1);

  const backTo = editable ? "/profile?tab=reviews" : `/user/${username}?tab=reviews`;

  useEffect(() => {
    async function loadReviews() {
      try {
        setLoading(true);
        setError("");

        const data = editable
          ? await getReviews()
          : await getUserReviews(username);

        setReviews(data);
      } catch (err) {
        console.error(err);
        setError("Unable to load reviews.");
      } finally {
        setLoading(false);
      }
    }
    loadReviews();
  }, [username, editable]);

  function handleEdit(review) {
    navigate(`/reviews/${review.id}/edit`);
  }

  async function handleDelete(reviewId) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this review?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      await deleteReview(reviewId);
      setReviews((currentReviews) =>
        currentReviews.filter(
          (review) => review.id !== reviewId
        )
      );

    } catch (err) {
      console.error("Unable to delete review:", err);

      setError(
        err.response?.data?.errors?.join(", ") ||
        "Unable to delete review."
      );
    }
  }

  function getSortValue(review, field) {
    switch (field) {
      case "artist":
        return (review.entry?.artist || "").toLowerCase();
      case "album":
        return (review.entry?.title || "").toLowerCase();
      case "year":
        return parseInt(review.entry?.year, 10) || 0;
      case "rating":
        return review.rating ?? -1;
      case "recent":
      default:
        return new Date(review.created_at).getTime();
    }
  }

  const filteredReviews = useMemo(() => {
    const normalized = searchQuery.trim().toLowerCase();
    if (!normalized) return reviews;

    return reviews.filter((review) => {
      const haystack = `${review.entry?.artist} ${review.entry?.title} ${review.title}`.toLowerCase();
      return haystack.includes(normalized);
    });
  }, [reviews, searchQuery]);

  const sortedReviews = useMemo(() => {
    const sorted = [...filteredReviews].sort((a, b) => {
      const valueA = getSortValue(a, sortField);
      const valueB = getSortValue(b, sortField);

      if (valueA < valueB) return -1;
      if (valueA > valueB) return 1;
      return 0;
    });

    if (sortDirection === "desc") {
      sorted.reverse();
    }

    return sorted;
  }, [filteredReviews, sortField, sortDirection]);

  const totalPages = Math.max(1, Math.ceil(sortedReviews.length / PAGE_SIZE));

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [totalPages, page]);

  useEffect(() => {
    setPage(1);
  }, [searchQuery, sortField, sortDirection]);

  function getPageNumbers() {
    const pages = [];
    const start = Math.max(2, page - SIBLING_COUNT);
    const end = Math.min(totalPages - 1, page + SIBLING_COUNT);

    pages.push(1);

    if (start > 2) pages.push("ellipsis-start");
    for (let i = start; i <= end; i++) pages.push(i);
    if (end < totalPages - 1) pages.push("ellipsis-end");

    if (totalPages > 1) pages.push(totalPages);

    return pages;
  }

  if (loading) {
    return (
      <section className="user-review-section">
        <p>Loading reviews...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="user-review-section">
        <div className="error-banner">
          {error}
        </div>
      </section>
    );
  }

  const startIndex = (page - 1) * PAGE_SIZE;
  const pageReviews = sortedReviews.slice(startIndex, startIndex + PAGE_SIZE);

  return (
    <section className="user-review-section">
      <div className="section-header">
        <h2>Reviews</h2>

        <div className="review-controls">
          <input
            className="auth-input entry-search-input"
            type="text"
            placeholder="Filter reviews..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <select
            className="auth-input review-sort-select"
            value={sortField}
            onChange={(e) => setSortField(e.target.value)}
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <button
            type="button"
            className="review-sort-direction"
            onClick={() =>
              setSortDirection((current) =>
                current === "asc" ? "desc" : "asc"
              )
            }
          >
            {sortDirection === "asc" ? "↑ Asc" : "↓ Desc"}
          </button>
        </div>
      </div>

      {reviews.length === 0 ? (
        <div className="empty-reviews">
          <p>No reviews yet.</p>
        </div>
      ) : (
        <>
          <ReviewList
            reviews={pageReviews}
            editable={editable}
            onEdit={editable ? handleEdit : undefined}
            onDelete={editable ? handleDelete : undefined}
            backTo={backTo}
          />

          <div className="entry-list-footer">
            <div className="entry-pagination">
              <button
                className="entry-pagination-button"
                onClick={() => setPage(1)}
                disabled={page === 1}
              >
                First
              </button>

              <button
                className="entry-pagination-button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Previous
              </button>

              {getPageNumbers().map((entryPage, i) =>
                typeof entryPage === "number" ? (
                  <button
                    key={entryPage}
                    className={`entry-pagination-page ${
                      page === entryPage ? "active" : ""
                    }`}
                    onClick={() => setPage(entryPage)}
                  >
                    {entryPage}
                  </button>
                ) : (
                  <span key={`${entryPage}-${i}`} className="entry-pagination-ellipsis">
                    …
                  </span>
                )
              )}

              <button
                className="entry-pagination-button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                Next
              </button>

              <button
                className="entry-pagination-button"
                onClick={() => setPage(totalPages)}
                disabled={page === totalPages}
              >
                Last
              </button>
            </div>
          </div>
        </>
      )}
    </section>
  );
}