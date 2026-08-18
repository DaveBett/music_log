class Api::HomeController < ApplicationController
  before_action :authenticate_user!

  def trending
    since = 30.days.ago

    trending_artists = Entry
      .where("entries.created_at >= ?", since)
      .where.not(artist: [ nil, "" ])
      .group(:artist)
      .order(Arel.sql("COUNT(*) DESC"))
      .limit(5)
      .count

    trending_albums = Entry
      .where("entries.created_at >= ?", since)
      .where.not(musicbrainz_id: [ nil, "" ])
      .group(:musicbrainz_id, :title, :artist)
      .order(Arel.sql("COUNT(*) DESC"))
      .limit(3)
      .count

    render json: {
      artists: trending_artists.map do |artist, count|
        {
          artist: artist,
          logs: count
        }
      end,

      albums: trending_albums.map do |(musicbrainz_id, title, artist), count|
        {
          title: title,
          artist: artist,
          musicbrainz_id: musicbrainz_id,
          logs: count
        }
      end
    }
  end
end
