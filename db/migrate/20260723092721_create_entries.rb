class CreateEntries < ActiveRecord::Migration[8.1]
  def change
    create_table :entries do |t|
      t.string :artist
      t.string :title
      t.string :year

      t.timestamps
    end
    add_index :entries, :year
  end
end
