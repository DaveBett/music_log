json.extract! entry, :id, :artist, :title, :year, :created_at, :updated_at
json.url entry_url(entry, format: :json)
