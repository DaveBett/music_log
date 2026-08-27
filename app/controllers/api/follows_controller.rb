class Api::FollowsController < ApplicationController
  before_action :authenticate_user!

  def create
    user = User.find(params[:user_id])

    follow = current_user.active_follows.build(
      followed: user
    )

    Follow.transaction do
      follow.save!

      Activity.create!(user: current_user, activity_type: :follow, trackable: follow)

      Notification.create!(
        user: user,
        actor: current_user,
        notification_type: :follow,
        trackable: follow
      )
    end
  end

  def destroy
    follow = current_user.active_follows.find_by(
      followed_id: params[:user_id]
    )

    if follow
      follow.destroy
    end

    render json: {
      following: false
    }
  end
end
