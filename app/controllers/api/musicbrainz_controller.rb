class Api::MusicbrainzController < ApplicationController
  # before_action :authenticate_user!

  def search
    query = params[:q].to_s.strip

    if query.blank?
      return render json: {
        albums: []
      }
    end

    albums =
      MusicBrainzService.search_albums(
        query
      )

    render json: {
      albums: albums.map do |album|
        {
          title: album[:title],
          artist: album[:artist],
          artistId: album[:artist_id],
          year: album[:year],
          type: album[:type],
          musicbrainzId:
            album[:musicbrainz_id],
          musicbrainzUrl:
            album[:musicbrainz_url]
        }
      end
    }
  rescue StandardError => e
    Rails.logger.error(
      "MusicBrainz search failed: #{e.message}"
    )

    render json: {
      error:
        "Unable to search MusicBrainz."
    },
    status: :bad_gateway
  end
end
