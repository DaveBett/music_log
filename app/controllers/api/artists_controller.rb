class Api::ArtistsController < ApplicationController
  include ReviewSerializable

  before_action :authenticate_user!

  def show
    artist_name = params[:name].to_s.strip

    entries = Entry.where("LOWER(entries.artist) = ?", artist_name.downcase)

    reviews = Review
      .joins(:entry)
      .where("LOWER(entries.artist) = ?", artist_name.downcase)
      .includes(:user, :entry)
      .order(created_at: :desc)

    render json: {
      artist: artist_name,
      stats: {
        total_logs: entries.count,
        recent_logs: entries.where("entries.created_at >= ?", 30.days.ago).count
      },
      trending_album: trending_album_for(artist_name),
      reviews: reviews.map { |review| review_json(review) }
    }
  end

  private

  def trending_album_for(artist_name)
    since = 30.days.ago

    log_counts = Entry
      .where("LOWER(entries.artist) = ?", artist_name.downcase)
      .where("entries.created_at >= ?", since)
      .where.not(musicbrainz_id: [ nil, "" ])
      .group(:musicbrainz_id, :title)
      .count

    review_counts = Review
      .joins(:entry)
      .where("LOWER(entries.artist) = ?", artist_name.downcase)
      .where("reviews.created_at >= ?", since)
      .where.not(entries: { musicbrainz_id: [ nil, "" ] })
      .group("entries.musicbrainz_id", "entries.title")
      .count

    scores = Hash.new(0)
    titles = {}

    log_counts.each do |(musicbrainz_id, title), count|
      scores[musicbrainz_id] += count
      titles[musicbrainz_id] = title
    end

    review_counts.each do |(musicbrainz_id, title), count|
      scores[musicbrainz_id] += count * 2
      titles[musicbrainz_id] ||= title
    end

    return nil if scores.empty?

    top_id, top_score = scores.max_by { |_, score| score }

    {
      musicbrainz_id: top_id,
      title: titles[top_id],
      activity_score: top_score
    }
  end
end
