class Entry < ApplicationRecord
  belongs_to :user

  has_one :activity, as: :trackable, dependent: :destroy
  has_one :review, dependent: :destroy
  has_many :entry_genres, dependent: :destroy
  has_many :genres, through: :entry_genres

  after_create :create_activity

  validates :artist, presence: true
  validates :title, presence: true

  validates :musicbrainz_id, uniqueness: { scope: :user_id, message: "is already in your catalog" }

  private

  def create_activity
    Activity.create!(
      user: user,
      activity_type: :log,
      trackable: self
    )
  end
end
