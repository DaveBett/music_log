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

  validates :username, presence: true, uniqueness: true, length: { minimum: 3, maximum: 20 }

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
end
