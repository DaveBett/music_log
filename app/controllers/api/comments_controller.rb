class Api::CommentsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_review
  before_action :set_comment, only: :destroy

  def index
    comments = @review.comments
      .includes(:user)
      .order(created_at: :asc)

    render json: comments.as_json(
      include: {
        user: {
          only: %i[id username]
        }
      }
    )
  end

  def create
    comment = @review.comments.new(comment_params)
    comment.user = current_user

    Comment.transaction do
      comment.save!

      Activity.create!(
        user: current_user,
        activity_type: :comment,
        trackable: comment
      )
    end

    render json: comment.as_json(
      include: {
        user: {
          only: %i[id username]
        }
      }
    ), status: :created

  rescue ActiveRecord::RecordInvalid => e
    render json: {
      errors: e.record.errors.full_messages
    }, status: :unprocessable_entity
  end

  def destroy
    unless @comment.user_id == current_user.id
      return render json: {
        errors: [ "You can only delete your own comments." ]
      }, status: :forbidden
    end

    @comment.destroy!

    head :no_content
  end

  private

  def set_review
    @review = Review.find(params[:review_id])
  end

  def set_comment
    @comment = @review.comments.find(params[:id])
  end

  def comment_params
    params.require(:comment).permit(:body)
  end
end
