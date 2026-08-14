class CreateReviews < ActiveRecord::Migration[8.0]
  def change
    create_table :reviews do |t|
      t.references :user, null: false, foreign_key: true
      t.string :title, null: false
      t.string :artist, null: false
      t.string :album, null: false
      t.integer :release_year, null: false
      t.integer :rating
      t.text :body, null: false

      t.timestamps
    end
  end
end
