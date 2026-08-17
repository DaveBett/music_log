# app/models/entry_genre.rb
class EntryGenre < ApplicationRecord
  belongs_to :entry
  belongs_to :genre

  validates :genre_id, uniqueness: {
    scope: :entry_id
  }
end
