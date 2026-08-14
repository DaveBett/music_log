class RemoveAlbumFieldsFromReviews < ActiveRecord::Migration[8.1]
  def change
    remove_column :reviews, :artist, :string
    remove_column :reviews, :album, :string
    remove_column :reviews, :release_year, :integer
  end
end
