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

  MUTEX = Mutex.new
  MIN_INTERVAL = 1.05

    def self.search_albums(query)
      query = query.to_s.strip
      return [] if query.blank?

      cache_key = "musicbrainz:full_search:#{query.downcase}"

      Rails.cache.fetch(cache_key, expires_in: 24.hours) do
        artists = search_artists(query)
        primary_artist = find_primary_artist(artists, query)

        if primary_artist
          Rails.logger.info("MusicBrainz matched artist: #{primary_artist["name"]} (#{primary_artist["id"]})")
          search_release_groups_for_artist(primary_artist["id"])
        else
          search_general_albums(query)
        end
      end
    end

  def self.get_release_group(release_group_id)
    return nil if release_group_id.blank?

    uri = URI(
      "#{RELEASE_GROUP_URL}/#{release_group_id}"
    )

    uri.query = URI.encode_www_form(
      inc: "genres",
      fmt: "json"
    )

    Rails.logger.info(
      "MusicBrainz release-group lookup: #{uri}"
    )

    data = make_request(uri)

    {
      id: data["id"],
      title: data["title"],
      genres: data.fetch("genres", []).filter_map do |genre|
        genre["name"].presence
      end
    }
  end

  private

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

  def self.find_primary_artist(artists, query)
    normalized_query =
      query.downcase.strip

    exact_match =
      artists.find do |artist|
        artist["name"]
          .to_s
          .downcase
          .strip ==
          normalized_query
      end

    return exact_match if exact_match

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

  def self.search_release_groups_for_artist(artist_id)
    Rails.cache.fetch("musicbrainz:artist_releases:#{artist_id}", expires_in: 24.hours) do
      uri = URI(RELEASE_GROUP_URL)
      uri.query = URI.encode_www_form(
        artist: artist_id,
        type: "album|ep",
        inc: "artist-credits",
        fmt: "json",
        limit: 100
      )

      Rails.logger.info("MusicBrainz artist release-group request: #{uri}")
      data = make_request(uri)
      parse_release_groups(data)
    end
  end

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

  def self.make_request(uri)
    attempts = 0

    loop do
      response = perform_request(uri)

      if response.code == "503" && attempts < 2
        attempts += 1
        Rails.logger.warn("MusicBrainz busy (503), retrying in 1.5s... (attempt #{attempts})")
        sleep(1.5)
        next
      end

      unless response.is_a?(Net::HTTPSuccess)
        Rails.logger.error("MusicBrainz returned #{response.code}: #{response.body}")
        raise "MusicBrainz API returned HTTP #{response.code}"
      end

      return JSON.parse(response.body)
    end
  end

  def self.perform_request(uri)
    MUTEX.synchronize do
      wait_for_rate_limit

      request = Net::HTTP::Get.new(uri)
      request["User-Agent"] = USER_AGENT
      request["Accept"] = "application/json"

      response =
        Net::HTTP.start(
          uri.hostname,
          uri.port,
          use_ssl: true,
          open_timeout: 5,
          read_timeout: 5
        ) do |http|
          http.request(request)
        end

      @last_request_at = Time.now
      response
    end
  end

  def self.wait_for_rate_limit
    return unless @last_request_at

    elapsed = Time.now - @last_request_at
    sleep(MIN_INTERVAL - elapsed) if elapsed < MIN_INTERVAL
  end
end
