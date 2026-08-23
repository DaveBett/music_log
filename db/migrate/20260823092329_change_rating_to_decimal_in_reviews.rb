class ChangeRatingToDecimalInReviews < ActiveRecord::Migration[8.0]
  def up
    change_column :reviews, :rating, :decimal, precision: 3, scale: 1

    execute <<~SQL
      UPDATE reviews SET rating = rating / 2.0 WHERE rating IS NOT NULL
    SQL
  end

  def down
    execute <<~SQL
      UPDATE reviews SET rating = rating * 2 WHERE rating IS NOT NULL
    SQL

    change_column :reviews, :rating, :integer
  end
end
