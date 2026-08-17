# app/models/genre.rb
class Genre < ApplicationRecord
  has_many :entry_genres, dependent: :destroy
  has_many :entries, through: :entry_genres

  validates :name, presence: true, uniqueness: true
end
