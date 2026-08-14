class CreateActivities < ActiveRecord::Migration[8.0]
  def change
    create_table :activities do |t|
      t.references :user, null: false, foreign_key: true

      t.integer :activity_type,
                null: false

      t.references :trackable,
                   polymorphic: true,
                   null: false

      t.timestamps
    end

    add_index :activities, :created_at
    add_index :activities, [ :activity_type, :created_at ]
  end
end
