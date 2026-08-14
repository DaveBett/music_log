class Follow < ApplicationRecord
  belongs_to :follower, class_name: "User"
  belongs_to :followed, class_name: "User"

  validates :follower_id, uniqueness: { scope: :followed_id }
  validate :cannot_follow_yourself
  has_one :activity, as: :trackable, dependent: :destroy

  private

  def cannot_follow_yourself
    if follower_id == followed_id
      errors.add(
        :base,
        "You cannot follow yourself."
      )
    end
  end
end
