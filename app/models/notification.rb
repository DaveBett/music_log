class Notification < ApplicationRecord
  belongs_to :user
  belongs_to :actor, class_name: "User"
  belongs_to :trackable, polymorphic: true

  enum :notification_type, {
    follow: 0,
    comment_on_review: 1,
    review_on_logged_entry: 2,
    comment_on_commented_review: 3
  }

  scope :unread, -> { where(read_at: nil) }

  validates :notification_type, presence: true
end
