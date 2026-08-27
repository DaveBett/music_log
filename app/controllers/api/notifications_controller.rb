class Api::NotificationsController < ApplicationController
  before_action :authenticate_user!

  def index
    notifications = current_user.notifications
      .includes(:actor, :trackable)
      .order(created_at: :desc)
      .limit(30)

    render json: {
      unread_count: current_user.notifications.unread.count,
      notifications: notifications.map { |n| notification_json(n) }
    }
  end

  def mark_read
    current_user.notifications.unread.update_all(read_at: Time.current)
    head :no_content
  end

  private

  def notification_json(notification)
    {
      id: notification.id,
      type: notification.notification_type,
      read: notification.read_at.present?,
      created_at: notification.created_at,
      actor: {
        username: notification.actor.username,
        avatar_url: avatar_url(notification.actor)
      },
      data: notification_data(notification)
    }
  end

  def notification_data(notification)
    case notification.notification_type.to_sym

    when :follow
      {}

    when :comment_on_review, :comment_on_commented_review
      comment = notification.trackable
      review = comment&.review
      entry = review&.entry

      {
        review_id: review&.id,
        album: entry&.title,
        artist: entry&.artist
      }

    when :review_on_logged_entry
      review = notification.trackable
      entry = review&.entry

      {
        review_id: review&.id,
        album: entry&.title,
        artist: entry&.artist
      }

    else
      {}
    end
  end

  def avatar_url(user)
    return nil unless user.avatar.attached?
    url_for(user.avatar)
  end
end
