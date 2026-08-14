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
  validates :rating, numericality: { only_integer: true, in: 1..10 }, allow_nil: true
end
