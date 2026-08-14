require "net/http"
require "json"
require "uri"

class MusicBrainzService
  ARTIST_URL =
    "https://musicbrainz.org/ws/2/artist"

  RELEASE_GROUP_URL =
    "https://musicbrainz.org/ws/2/release-group"

  USER_AGENT =
    "MusicLog/1.0 (dattero96@gmail.com)"

  def self.search_albums(query)
    query = query.to_s.strip

    return [] if query.blank?

    # First, determine whether the query matches an artist.
    artists = search_artists(query)

    primary_artist =
      find_primary_artist(
        artists,
        query
      )

    # If an artist was found, ONLY search that artist's
    # release groups.
    #
    # We deliberately do not perform a general album
    # search here.
    if primary_artist
      Rails.logger.info(
        "MusicBrainz matched artist: " \
        "#{primary_artist["name"]} " \
        "(#{primary_artist["id"]})"
      )

      return search_release_groups_for_artist(
        primary_artist["id"]
      )
    end

    # No artist matched, so this is treated as an
    # album search.
    search_general_albums(query)
  end

  private

  # --------------------------------------------------
  # Artist search
  # --------------------------------------------------

  def self.search_artists(query)
    uri = URI(ARTIST_URL)

    uri.query = URI.encode_www_form(
      query: query,
      fmt: "json",
      limit: 5
    )

    Rails.logger.info(
      "MusicBrainz artist request: #{uri}"
    )

    data = make_request(uri)

    data.fetch("artists", [])
  end

  # --------------------------------------------------
  # Find the best matching artist
  # --------------------------------------------------

  def self.find_primary_artist(artists, query)
    normalized_query =
      query.downcase.strip

    # Exact match
    exact_match =
      artists.find do |artist|
        artist["name"]
          .to_s
          .downcase
          .strip ==
          normalized_query
      end

    return exact_match if exact_match

    # Starts with query
    starts_with_match =
      artists.find do |artist|
        artist["name"]
          .to_s
          .downcase
          .start_with?(
            normalized_query
          )
      end

    return starts_with_match if starts_with_match

    # Contains query
    contains_match =
      artists.find do |artist|
        artist["name"]
          .to_s
          .downcase
          .include?(
            normalized_query
          )
      end

    return contains_match if contains_match

    nil
  end

  # --------------------------------------------------
  # Artist albums + EPs
  # --------------------------------------------------

  def self.search_release_groups_for_artist(artist_id)
    uri = URI(RELEASE_GROUP_URL)

    uri.query = URI.encode_www_form(
      artist: artist_id,
      type: "album|ep",
      inc: "artist-credits",
      fmt: "json",
      limit: 100
    )

    Rails.logger.info(
      "MusicBrainz artist release-group request: #{uri}"
    )

    data = make_request(uri)

    parse_release_groups(data)
  end

  # --------------------------------------------------
  # General album search
  # --------------------------------------------------

  def self.search_general_albums(query)
    uri = URI(RELEASE_GROUP_URL)

    uri.query = URI.encode_www_form(
      query: query,
      fmt: "json",
      limit: 25
    )

    Rails.logger.info(
      "MusicBrainz general release-group request: #{uri}"
    )

    data = make_request(uri)

    parse_release_groups(data).select do |album|
      [ "Album", "EP" ].include?(album[:type])
    end
  end

  # --------------------------------------------------
  # Parse release groups
  # --------------------------------------------------

  def self.parse_release_groups(data)
    data.fetch("release-groups", []).filter_map do |release_group|
      artist_credit =
        release_group.dig(
          "artist-credit",
          0
        )

      artist =
        artist_credit&.dig(
          "artist",
          "name"
        ) ||
        artist_credit&.dig(
          "name"
        )

      artist_id =
        artist_credit&.dig(
          "artist",
          "id"
        )

      id =
        release_group["id"]

      title =
        release_group["title"]

      type =
        release_group["primary-type"]

      next if id.blank?
      next if title.blank?

      {
        title: title,
        artist: artist,
        artist_id: artist_id,
        year:
          release_group[
            "first-release-date"
          ]&.first(4),
        type: type,
        musicbrainz_id: id,
        musicbrainz_url:
          "https://musicbrainz.org/release-group/#{id}"
      }
    end
  end

  # --------------------------------------------------
  # HTTP request
  # --------------------------------------------------

  def self.make_request(uri)
    request =
      Net::HTTP::Get.new(uri)

    request["User-Agent"] =
      USER_AGENT

    request["Accept"] =
      "application/json"

    response =
      Net::HTTP.start(
        uri.hostname,
        uri.port,
        use_ssl: true
      ) do |http|
        http.request(request)
      end

    unless response.is_a?(Net::HTTPSuccess)
      Rails.logger.error(
        "MusicBrainz returned #{response.code}: " \
        "#{response.body}"
      )

      raise(
        "MusicBrainz API returned HTTP #{response.code}"
      )
    end

    JSON.parse(
      response.body
    )
  end
end
