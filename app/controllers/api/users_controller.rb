class Api::UsersController < ApplicationController
  before_action :authenticate_user!,
    except: [ :login, :register, :verify_email, :resend_confirmation ]

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
      token = user.generate_email_verification_token!

      UserMailer.email_verification(user, token).deliver_later

      render json: {
        user: user_json(user)
      }, status: :created
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
      unless user.email_verified?
        return render json: {
          error: "Please confirm your email address before logging in."
        }, status: :forbidden
      end

      token, _payload =
        Warden::JWTAuth::UserEncoder.new.call(user, :user, nil)

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

  def verify_email
    token = params[:token]

    user = User.find_by_email_verification_token(token)

    unless user
      return render json: {
        error: "This verification link is invalid or has expired."
      }, status: :unprocessable_entity
    end

    user.verify_email!

    render json: {
      message: "Your email has been verified successfully."
    }
  end

  def resend_confirmation
    user = User.find_by(email: params[:email])

    if user && !user.email_verified?
      token = user.generate_email_verification_token!

      UserMailer.email_verification(user, token).deliver_later
    end

    render json: {
      message: "If an unverified account exists for that email, a confirmation email has been sent."
    }
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
        following: current_user.following.count,
        favorite_genre: favorite_genre,
        this_year_logs: current_user.entries
          .where(
            created_at: Time.current.beginning_of_year..Time.current.end_of_year
          ).count,
        average_rating: current_user.reviews
        .where.not(rating: nil)
        .average(:rating)
        &.round(2)
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

  def favorite_genre
    Genre
      .joins(entry_genres: :entry)
      .where(entries: { user_id: current_user.id })
      .group("genres.id", "genres.name")
      .order(
        Arel.sql("COUNT(entry_genres.id) DESC"),
        "genres.name ASC"
      )
      .limit(1)
      .pick(:name)
  end
end
