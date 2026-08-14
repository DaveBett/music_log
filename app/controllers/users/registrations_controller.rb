class Users::RegistrationsController < Devise::RegistrationsController
  respond_to :json

  private

  def respond_with(resource, _opts = {})
    render json: {
      user: {
        id: resource.id,
        username: resource.username,
        email: resource.email
      }
    }, status: :created
  end
end
