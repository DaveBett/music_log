class AddMusicbrainzFieldsToReviews < ActiveRecord::Migration[8.1]
  def change
    add_column :reviews, :musicbrainz_id, :string
    add_column :reviews, :musicbrainz_url, :string

    add_index :reviews, [ :user_id, :musicbrainz_id ], unique: true
  end
end
