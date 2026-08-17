class UserMailer < ApplicationMailer
  def email_verification(user, token)
    @user = user
    @token = token

    @verification_url =
      "#{frontend_url}/verify-email?token=#{CGI.escape(@token)}"

    mail(
      to: @user.email,
      subject: "Confirm your MusicLog account"
    )
  end

  private

  def frontend_url
    Rails.application.config.x.frontend_url.presence ||
      "http://localhost:3001"
  end
end
