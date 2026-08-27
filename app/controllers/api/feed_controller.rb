class Api::FeedController < ApplicationController
  before_action :authenticate_user!

  def index
    activities =
      case params[:type]
      when "following"
        following_activities
      when "popular"
        popular_activities
      when "recent"
        recent_activities
      when "global"
        global_activities
      else
        global_activities
      end

    render json: activities.map { |activity| activity_json(activity) }
  end

  private

  def following_activities
    followed_user_ids = current_user.following.pluck(:id)

    Activity
      .where(user_id: followed_user_ids)
      .where.not(activity_type: :follow)
      .includes(
        :user,
        :trackable,
        trackable: [
          :entry,
          :comments,
          { review: [ :user, :entry ] }
        ]
      )
      .order(created_at: :desc)
      .limit(20)
  end

  def popular_activities
    Activity
      .where(activity_type: :review)
      .where.not(user_id: current_user.id)
      .joins("LEFT JOIN comments ON comments.review_id = activities.trackable_id")
      .where(trackable_type: "Review")
      .group("activities.id")
      .order(Arel.sql("COUNT(comments.id) DESC"))
      .includes(
        :user,
        :trackable,
        trackable: [
          :entry,
          :comments,
          { review: [ :user, :entry ] }
        ]
      )
      .limit(20)
  end

  def recent_activities
    Activity
      .where(created_at: 3.days.ago..Time.current)
      .where.not(user_id: current_user.id)
      .where.not(activity_type: :follow)
      .includes(
        :user,
        :trackable,
        trackable: [
          :entry,
          :comments,
          { review: [ :user, :entry ] }
        ]
      )
      .order(created_at: :desc)
      .limit(20)
  end

  def global_activities
    Activity
      .where.not(user_id: current_user.id)
      .where.not(activity_type: :follow)
      .includes(
        :user,
        :trackable,
        trackable: [
          :entry,
          :comments,
          { review: [ :user, :entry ] }
        ]
      )
      .order(created_at: :desc)
      .limit(20)
  end

  def activity_json(activity)
    {
      id: activity.id,
      type: activity.activity_type,
      created_at: activity.created_at,

      user: {
        id: activity.user.id,
        username: activity.user.username,
        avatar_url: avatar_url(activity.user)
      },

      data: activity_data(activity)
    }
  end

  def avatar_url(user)
    return nil unless user.avatar.attached?

    url_for(user.avatar)
  end

  def activity_data(activity)
    case activity.activity_type.to_sym

    when :log
      entry = activity.trackable

      {
        entry_id: entry&.id,
        album: entry&.title,
        artist: entry&.artist
      }

    when :review
      review = activity.trackable
      entry = review&.entry

      {
        review_id: review&.id,
        entry_id: entry&.id,
        album: entry&.title,
        artist: entry&.artist,
        comment_count: review&.comments&.count || 0
      }

    when :comment
      comment = activity.trackable
      review = comment&.review
      entry = review&.entry
      review_author = review&.user

      {
        comment_id: comment&.id,
        review_id: review&.id,
        entry_id: entry&.id,
        album: entry&.title,
        artist: entry&.artist,
        review_author_id: review_author&.id,
        review_author_username: review_author&.username
      }

    else
      {}
    end
  end
end
