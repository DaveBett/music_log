class Api::ReviewsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_review, only: %i[show update destroy]

  def index
    reviews = current_user.reviews
      .includes(:entry)
      .order(created_at: :desc)

    render json: reviews.as_json(
      include: {
        entry: {
          only: %i[
            id
            artist
            title
            year
            musicbrainz_id
            musicbrainz_url
          ]
        }
      }
    )
  end

  def user_reviews
    user = User.find_by!(username: params[:username])

    reviews = user.reviews
      .includes(:entry)
      .order(created_at: :desc)

    render json: reviews.as_json(
      include: {
        entry: {
          only: %i[
            id
            artist
            title
            year
            musicbrainz_id
            musicbrainz_url
          ]
        }
      }
    )
  end

  def show
    render json: {
      id: @review.id,
      title: @review.title,
      rating: @review.rating,
      body: @review.body,
      created_at: @review.created_at,

      user: {
        id: @review.user.id,
        username: @review.user.username
      },

      entry: {
        id: @review.entry.id,
        artist: @review.entry.artist,
        title: @review.entry.title,
        year: @review.entry.year,
        musicbrainz_id: @review.entry.musicbrainz_id,
        musicbrainz_url: @review.entry.musicbrainz_url
      },

      is_owner: @review.user_id == current_user.id
    }
  end

  def create
    entry = current_user.entries.find(params[:entry_id])

    if current_user.reviews.exists?(entry_id: entry.id)
      return render json: {
        errors: [ "You have already reviewed this album." ]
      }, status: :unprocessable_entity
    end

    review = current_user.reviews.new(
      review_params.merge(entry: entry)
    )

    Review.transaction do
      review.save!

      Activity.create!(
        user: current_user,
        activity_type: :review,
        trackable: review
      )
    end

    render json: review.as_json(
      include: {
        entry: {
          only: %i[
            id
            artist
            title
            year
            musicbrainz_id
            musicbrainz_url
          ]
        }
      }
    ), status: :created

  rescue ActiveRecord::RecordInvalid => e
    render json: {
      errors: e.record.errors.full_messages
    }, status: :unprocessable_entity
  end

  def update
    unless @review.user_id == current_user.id
      return render json: {
        errors: [ "You are not allowed to edit this review." ]
      }, status: :forbidden
    end

    if @review.update(review_params)
      render json: @review.as_json(
        include: {
          entry: {
            only: %i[
              id
              artist
              title
              year
              musicbrainz_id
              musicbrainz_url
            ]
          }
        }
      ), status: :ok
    else
      render json: {
        errors: @review.errors.full_messages
      }, status: :unprocessable_entity
    end
  end

  def destroy
    unless @review.user_id == current_user.id
      return render json: {
        errors: [ "You are not allowed to delete this review." ]
      }, status: :forbidden
    end

    @review.destroy!

    head :no_content
  end

  private

  def set_review
    @review = Review.find(params[:id])
  end

  def review_params
    params.require(:review).permit(
      :title,
      :rating,
      :body
    )
  end
end
