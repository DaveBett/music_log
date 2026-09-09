class Api::SearchController < ApplicationController
  before_action :authenticate_user!

  def index
    query = params[:q].to_s.strip

    render json: {
      users: search_users(query),
      artists: search_artists(query),
      albums: search_albums(query)
    }
  end

  private

  def search_users(query)
    return [] if query.blank?

    User
      .where(
        "LOWER(username) LIKE LOWER(?)",
        "%#{User.sanitize_sql_like(query)}%"
      )
      .order(:username)
      .limit(5)
      .map do |user|
        {
          id: user.id,
          username: user.username,
          avatar_url: avatar_url(user)
        }
      end
  end

  def search_artists(query)
    return [] if query.blank?

    Entry
      .where(
        "LOWER(artist) LIKE LOWER(?)",
        "%#{Entry.sanitize_sql_like(query)}%"
      )
      .distinct
      .order(:artist)
      .limit(5)
      .pluck(:artist)
      .map { |artist| { artist: artist } }
  end

  def search_albums(query)
    return [] if query.blank?

    Entry
      .where(
        "LOWER(title) LIKE LOWER(?)",
        "%#{Entry.sanitize_sql_like(query)}%"
      )
      .where.not(musicbrainz_id: [ nil, "" ])
      .select(:musicbrainz_id, :title, :artist)
      .distinct
      .order(:title)
      .limit(5)
      .map do |entry|
        {
          musicbrainz_id: entry.musicbrainz_id,
          title: entry.title,
          artist: entry.artist
        }
      end
  end

  def avatar_url(user)
    return nil unless user.avatar.attached?

    url_for(user.avatar)
  end
end
