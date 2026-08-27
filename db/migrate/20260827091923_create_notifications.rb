class CreateNotifications < ActiveRecord::Migration[8.0]
  def change
    create_table :notifications do |t|
      t.references :user, null: false, foreign_key: true # destinatario
      t.references :actor, null: false, foreign_key: { to_table: :users } # chi ha generato la notifica
      t.integer :notification_type, null: false
      t.references :trackable, polymorphic: true, null: false
      t.datetime :read_at

      t.timestamps
    end

    add_index :notifications, [ :user_id, :read_at ]
  end
end
