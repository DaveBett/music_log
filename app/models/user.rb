class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  require "digest"
  require "securerandom"

  devise :database_authenticatable,
  :registerable,
  :recoverable,
  :rememberable,
  :validatable,
  :jwt_authenticatable,
  jwt_revocation_strategy: Devise::JWT::RevocationStrategies::Null

  has_many :entries, dependent: :destroy
  has_many :reviews, dependent: :destroy
  has_many :activities, dependent: :destroy
  has_many :active_follows, class_name: "Follow", foreign_key: :follower_id, dependent: :destroy
  has_many :following, through: :active_follows, source: :followed
  has_many :passive_follows, class_name: "Follow", foreign_key: :followed_id, dependent: :destroy
  has_many :followers, through: :passive_follows, source: :follower
  has_many :comments, dependent: :destroy
  has_one_attached :avatar


  validates :username, presence: true, uniqueness: true, length: { minimum: 3, maximum: 20 }
  validate :acceptable_avatar

  def email_verified?
    email_verified_at.present?
  end

  def generate_email_verification_token!
    raw_token = SecureRandom.urlsafe_base64(32)

    update!(
      email_verification_token_digest:
        Digest::SHA256.hexdigest(raw_token),
      email_verification_sent_at: Time.current
    )

    raw_token
  end

  def verify_email!
    update!(
      email_verified_at: Time.current,
      email_verification_token_digest: nil,
      email_verification_sent_at: nil
    )
  end

  def following?(user)
    following.exists?(user.id)
  end

  def follow(user)
    active_follows.create(followed: user)
  end

  def unfollow(user)
    active_follows.find_by(
      followed: user
    )&.destroy
  end

  private
  def acceptable_avatar
    return unless avatar.attached?

    unless avatar.blob.content_type.in?(%w[image/jpeg image/png image/webp])
      errors.add(:avatar, "must be a JPEG, PNG or WebP image")
    end

    if avatar.blob.byte_size > 5.megabytes
      errors.add(:avatar, "must be smaller than 5 MB")
    end
  end
end
