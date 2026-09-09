class Api::AlbumsController < ApplicationController
  include ReviewSerializable

  before_action :authenticate_user!

  def show
    musicbrainz_id = params[:musicbrainz_id]

    entries = Entry.where(musicbrainz_id: musicbrainz_id)

    reviews = Review
      .joins(:entry)
      .where(entries: { musicbrainz_id: musicbrainz_id })
      .includes(:user, :entry)
      .order(created_at: :desc)

    entry = entries.first

    render json: {
      album: entry && {
        title: entry.title,
        artist: entry.artist,
        year: entry.year,
        musicbrainz_id: entry.musicbrainz_id
      },
      stats: {
        total_logs: entries.count,
        recent_logs: entries.where("entries.created_at >= ?", 30.days.ago).count
      },
      reviews: reviews.map { |review| review_json(review) }
    }
  end
end
