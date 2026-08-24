class ChangeRatingBackToIntegerInReviews < ActiveRecord::Migration[8.0]
  def up
    change_column :reviews, :rating, :decimal, precision: 5, scale: 1

    execute <<~SQL
      UPDATE reviews SET rating = ROUND(((rating - 1) / 4.0) * 100) WHERE rating IS NOT NULL
    SQL

    change_column :reviews, :rating, :integer
  end

  def down
    change_column :reviews, :rating, :decimal, precision: 3, scale: 1

    execute <<~SQL
      UPDATE reviews SET rating = ((rating / 100.0) * 4) + 1 WHERE rating IS NOT NULL
    SQL
  end
end
