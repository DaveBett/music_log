class ChangeYearDatatype < ActiveRecord::Migration[8.1]
  def change
    change_column :entries, :year, :integer
  end
end
