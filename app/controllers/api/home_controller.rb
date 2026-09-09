class Api::HomeController < ApplicationController
  before_action :authenticate_user!

  def trending
    since = 30.days.ago

    artist_rows = Entry
      .where("entries.created_at >= ?", since)
      .where.not(artist: [ nil, "" ])
      .pluck(:artist, :created_at)

    album_rows = Entry
      .where("entries.created_at >= ?", since)
      .where.not(musicbrainz_id: [ nil, "" ])
      .pluck(:musicbrainz_id, :title, :artist, :created_at)

    render json: {
      artists: trending_artists(artist_rows),
      albums: trending_albums(album_rows)
    }
  end

  private

  def recency_weight(created_at)
    days_ago = (Time.current - created_at) / 1.day
    [ 1.0 - (days_ago / 30.0) * 0.9, 0.1 ].max
  end

  def trending_artists(rows)
    scores = Hash.new(0.0)
    counts = Hash.new(0)

    rows.each do |artist, created_at|
      scores[artist] += recency_weight(created_at)
      counts[artist] += 1
    end

    scores.sort_by { |_, score| -score }.first(10).map do |artist, score|
      {
        artist: artist,
        logs: counts[artist],
        score: score.round(2)
      }
    end
  end

  def trending_albums(rows)
    scores = Hash.new(0.0)
    counts = Hash.new(0)
    meta = {}

    rows.each do |musicbrainz_id, title, artist, created_at|
      scores[musicbrainz_id] += recency_weight(created_at)
      counts[musicbrainz_id] += 1
      meta[musicbrainz_id] ||= { title: title, artist: artist }
    end

    scores.sort_by { |_, score| -score }.first(5).map do |musicbrainz_id, score|
      {
        musicbrainz_id: musicbrainz_id,
        title: meta[musicbrainz_id][:title],
        artist: meta[musicbrainz_id][:artist],
        logs: counts[musicbrainz_id],
        score: score.round(2)
      }
    end
  end
end
