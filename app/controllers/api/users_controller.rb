class Api::UsersController < ApplicationController
  before_action :authenticate_user!,
  except: [ :login, :register ]

  def me
    render json: {
      id: current_user.id,
      username: current_user.username,
      email: current_user.email
    }
  end

  def register
    user = User.new(user_params)

    if user.save
      token, _payload =
        Warden::JWTAuth::UserEncoder.new.call(user, :user, nil)

        render json: {
          user: user_json(user),
          token: token
        }
    else
      render json: {
        errors: user.errors.full_messages
      }, status: :unprocessable_entity
    end
  end

  def login
    credentials = params.require(:user).permit(:email, :password)

    user = User.find_by(email: credentials[:email])

    if user&.valid_password?(credentials[:password])
      token, _payload = Warden::JWTAuth::UserEncoder.new.call(user, :user, nil)

      render json: {
        user: user_json(user),
        token: token
      }
    else
      render json: {
        error: "Invalid email or password"
      }, status: :unauthorized
    end
  end
  def logout
    head :no_content
  end

  def update
    if current_user.update(update_user_params)
      render json: {
        user: user_json(current_user)
      }
    else
      render json: {
        errors: current_user.errors.full_messages
      }, status: :unprocessable_entity
    end
  end

  def update_password
    data = password_params

    unless current_user.valid_password?(data[:current_password])
      return render json: {
        error: "Current password is incorrect."
      }, status: :unauthorized
    end

    if current_user.update(
      password: data[:password],
      password_confirmation: data[:password_confirmation]
    )
      render json: {
        message: "Password updated successfully."
      }
    else
      render json: {
        errors: current_user.errors.full_messages
      }, status: :unprocessable_entity
    end
  end

  def show
    user = User.find_by!(username: params[:username])

    render json: {
      user: {
        id: user.id,
        username: user.username,
        created_at: user.created_at
      },
      stats: {
        logs: user.entries.count,
        reviews: user.reviews.count,
        followers: user.followers.count,
        following: user.following.count
      },
      entries: user.entries.order(created_at: :desc),

      following: current_user.following?(user)
    }
  end

  def profile
    render json: {
      user: {
        id: current_user.id,
        username: current_user.username,
        email: current_user.email,
        created_at: current_user.created_at
      },

      stats: {
        logs: current_user.entries.count,
        reviews: current_user.reviews.count,
        followers: current_user.followers.count,
        following: current_user.following.count
      },

      entries: current_user.entries.order(created_at: :desc)
    }
  end

  private

  def user_json(user)
    {
      id: user.id,
      username: user.username,
      email: user.email
    }
  end

  def user_params
    params.require(:user).permit(
      :username,
      :email,
      :password,
      :password_confirmation
    )
  end

  def update_user_params
    params.require(:user).permit(
      :username,
      :email
    )
  end

  def password_params
    params.require(:user).permit(
      :current_password,
      :password,
      :password_confirmation
    )
  end

  def render_current_user
    render json: {
      user: {
        id: current_user.id,
        username: current_user.username,
        email: current_user.email
      }
    }
  end
end
