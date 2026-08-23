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
      greater_than_or_equal_to: 0,
      less_than_or_equal_to: 5
    },
    allow_nil: true
  validate :rating_must_be_half_step, if: -> { rating.present? }

  private

  def rating_must_be_half_step
    return if (rating * 2) % 1 == 0

    errors.add(:rating, "must be in increments of 0.5")
  end
end
