class CreateEntryGenres < ActiveRecord::Migration[8.1]
  def change
    create_table :entry_genres do |t|
      t.references :entry, null: false, foreign_key: true
      t.references :genre, null: false, foreign_key: true

      t.timestamps
    end
  end
end
