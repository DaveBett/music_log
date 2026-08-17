class Api::EmailVerificationsController < ApplicationController
  RESEND_COOLDOWN = 60.seconds

  def show
    token = params[:token]

    if token.blank?
      return render json: {
        error: "Verification token is missing."
      }, status: :bad_request
    end

    digest = Digest::SHA256.hexdigest(token)

    user = User.find_by(
      email_verification_token_digest: digest
    )

    unless user
      return render json: {
        error: "This verification link is invalid or has already been used."
      }, status: :unprocessable_entity
    end

    user.verify_email!

    render json: {
      message: "Your email has been verified successfully."
    }
  end

  def resend
    email = params[:email].to_s.strip.downcase

    if email.blank?
      return render json: {
        error: "Email address is required."
      }, status: :bad_request
    end

    user = User.find_by(email: email)

    # Don't reveal whether an email belongs to an account.
    unless user
      return render json: {
        message: "If that account exists and is not verified, a confirmation email has been sent."
      }, status: :ok
    end

    if user.email_verified?
      return render json: {
        message: "This email address has already been verified."
      }, status: :ok
    end

    if user.email_verification_sent_at.present? &&
       user.email_verification_sent_at > RESEND_COOLDOWN.ago

      return render json: {
        error: "Please wait before requesting another confirmation email."
      }, status: :too_many_requests
    end

    token = user.generate_email_verification_token!

    UserMailer
      .email_verification(user, token)
      .deliver_later

    render json: {
      message: "If that account exists and is not verified, a confirmation email has been sent."
    }, status: :ok
  end
end
