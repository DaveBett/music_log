class AddEntryToReviews < ActiveRecord::Migration[8.1]
  def up
    Review.delete_all

    add_reference :reviews, :entry, null: false, foreign_key: true
  end

  def down
    remove_reference :reviews, :entry, foreign_key: true
  end
end
