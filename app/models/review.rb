class Review < ApplicationRecord
  belongs_to :user
  belongs_to :entry

  has_many :comments, dependent: :destroy
  has_one :activity, as: :trackable, dependent: :destroy

  scope :with_comments_count, -> {
    left_joins(:comments)
      .select(
        "reviews.*",
        "COUNT(comments.id) AS comments_count"
      )
      .group("reviews.id")
  }

  validates :title, presence: true
  validates :body, presence: true
  validates :entry_id, uniqueness: { scope: :user_id, message: "has already been reviewed" }
  validates :rating,
    numericality: {
      only_integer: true,
      greater_than_or_equal_to: 0,
      less_than_or_equal_to: 100
    },
    allow_nil: true
end
