class Activity < ApplicationRecord
  belongs_to :user
  belongs_to :trackable, polymorphic: true

  enum :activity_type, {
    log: 0,
    review: 1,
    follow: 2,
    comment: 3
  }

  validates :activity_type, presence: true
end
