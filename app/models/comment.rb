class Comment < ApplicationRecord
  belongs_to :user
  belongs_to :review
  has_one :activity, as: :trackable, dependent: :destroy

  validates :body, presence: true, length: { maximum: 1000 }
end
