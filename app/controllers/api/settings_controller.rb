class Api::SettingsController < ApplicationController
  def show
    render json: {
      username: current_user.username,
      email: current_user.email
    }
  end

  def update
    if current_user.update(profile_params)
      render json: {
        user: {
          id: current_user.id,
          username: current_user.username,
          email: current_user.email
        }
      }
    else
      render json: {
        errors: current_user.errors.full_messages
      }, status: :unprocessable_entity
    end
  end

  def password
    unless current_user.valid_password?(params[:current_password])
      return render json: {
        error: "Current password is incorrect."
      }, status: :unprocessable_entity
    end

    if current_user.update(
      password: params[:password],
      password_confirmation: params[:password_confirmation]
    )
      head :ok
    else
      render json: {
        errors: current_user.errors.full_messages
      }, status: :unprocessable_entity
    end
  end

  def destroy
    current_user.destroy

    head :no_content
  end

  private

  def profile_params
    params.require(:user).permit(
      :username,
      :email
    )
  end
end
