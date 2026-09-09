module ReviewSerializable
  extend ActiveSupport::Concern

  private

  def review_json(review)
    {
      id: review.id,
      title: review.title,
      rating: review.rating,
      body: review.body,
      created_at: review.created_at,
      is_owner: current_user && review.user_id == current_user.id,

      user: {
        id: review.user.id,
        username: review.user.username,
        avatar_url: avatar_url(review.user)
      },

      entry: {
        id: review.entry.id,
        artist: review.entry.artist,
        title: review.entry.title,
        year: review.entry.year,
        musicbrainz_id: review.entry.musicbrainz_id,
        musicbrainz_url: review.entry.musicbrainz_url
      }
    }
  end

  def avatar_url(user)
    return nil unless user.avatar.attached?

    url_for(user.avatar)
  end
end
