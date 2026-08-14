class AddMusicbrainzFieldsToEntries < ActiveRecord::Migration[8.1]
  def change
    add_column :entries, :musicbrainz_id, :string
    add_column :entries, :musicbrainz_url, :string
  end
end
