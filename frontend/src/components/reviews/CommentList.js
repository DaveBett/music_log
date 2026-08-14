import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getComments, createComment, deleteComment, me } from "../../api/endpoints";

export default function CommentList({ reviewId }) {
  const [comments, setComments] = useState([]);
  const [body, setBody] = useState("");

  const [currentUser, setCurrentUser] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
  async function loadComments() {
    try {
      setLoading(true);
      setError("");

      const data = await getComments(reviewId);
      setComments(data);
    } catch (err) {
      console.error(err);
      setError("Unable to load comments.");
    } finally {
      setLoading(false);
    }
  }

  loadComments();
}, [reviewId]);

useEffect(() => {
  async function loadCurrentUser() {
    try {
      const data = await me();
      setCurrentUser(data);
    } catch (err) {
      console.error(err);
    }
  }

  loadCurrentUser();
}, []);

  async function handleSubmit(event) {
    event.preventDefault();

    if (!body.trim()) {
      return;
    }

    try {
      setSaving(true);
      setError("");

      const created = await createComment(
        reviewId,
        body.trim()
      );

      setComments((current) => [
        ...current,
        created
      ]);

      setBody("");
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.errors?.join(", ") ||
        "Unable to post comment."
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(commentId) {
    const confirmed = window.confirm(
      "Delete this comment?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteComment(
        reviewId,
        commentId
      );

      setComments((current) =>
        current.filter(
          (comment) =>
            comment.id !== commentId
        )
      );
    } catch (err) {
      console.error(err);
      setError("Unable to delete comment.");
    }
  }

  return (
    <section className="comment-section">
      <h3>
        Comments ({comments.length})
      </h3>

      {error && (
        <div className="error-banner">
          {error}
        </div>
      )}

      {loading ? (
        <p>Loading comments...</p>
      ) : comments.length === 0 ? (
        <p>No comments yet.</p>
      ) : (
        <div className="comment-list">

          {comments.map((comment) => (
            <article className="comment" key={comment.id} >

              <div className="comment-header">
                <div className="comment-user">
                  <Link to={`/user/${comment.user?.username}`}>
                    <strong>
                      {comment.user?.username}
                    </strong>
                  </Link>

                  <span>
                    {new Date(
                      comment.created_at
                    ).toLocaleDateString()}
                  </span>
                </div>
                <p>
                  {comment.body}
                </p>

              </div>

              {currentUser &&
                comment.user?.id ===
                  currentUser.id && (
                  <button
                    className="delete-comment"
                    onClick={() =>
                      handleDelete(
                        comment.id
                      )
                    }
                  >
                    Delete
                  </button>
                )}

            </article>
          ))}

        </div>
      )}

      <form onSubmit={handleSubmit}>

        <textarea
          className="auth-input"
          value={body}
          onChange={(e) =>
            setBody(e.target.value)
          }
          placeholder="Write a comment..."
          rows={3}
          maxLength={1000}
        />

        <button
          className="auth-button"
          type="submit"
          disabled={
            saving || !body.trim()
          }
        >
          {saving
            ? "Posting..."
            : "Post Comment"}
        </button>
      </form>
    </section>
  );
}