class Api::PasswordResetsController < ApplicationController
  def create
    email = params[:email].to_s.strip.downcase
    user = User.find_by(email: email)

    if user
      token = user.send_reset_password_instructions

      UserMailer.password_reset(user, token).deliver_later
    end

    # Deliberately return the same response whether the email exists or not.
    render json: {
      message: "If an account exists for that email, a password reset link has been sent."
    }
  end

  def update
    user = User.reset_password_by_token(reset_password_params)

    if user.errors.empty?
      render json: {
        message: "Your password has been reset successfully."
      }
    else
      render json: {
        errors: user.errors.full_messages
      }, status: :unprocessable_entity
    end
  end

  private

  def reset_password_params
    params.permit(
      :reset_password_token,
      :password,
      :password_confirmation
    )
  end
end
