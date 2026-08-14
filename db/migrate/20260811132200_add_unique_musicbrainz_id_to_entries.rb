class AddUniqueMusicbrainzIdToEntries < ActiveRecord::Migration[8.1]
  def change
    add_index :entries, [ :user_id, :musicbrainz_id ], unique: true, name: "index_entries_on_user_id_and_musicbrainz_id"
  end
end
