class Api::SearchController < ApplicationController
  before_action :authenticate_user!

  def index
    query = params[:q].to_s.strip

    users =
      if query.present?
        User
          .where(
            "username LIKE ?",
            "%#{User.sanitize_sql_like(query)}%"
          )
          .order(:username)
          .limit(10)
      else
        User.none
      end

    render json: {
      users: users.map do |user|
        {
          id: user.id,
          username: user.username,
          avatar_url: avatar_url(user)
        }
      end
    }
  end

  private

  def avatar_url(user)
    return nil unless user.avatar.attached?

    url_for(user.avatar)
  end
end
