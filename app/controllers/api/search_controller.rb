class Api::SearchController < ApplicationController
  before_action :authenticate_user!

  def index
    query = params[:q].to_s.strip
    users =
      User
        .where("LOWER(username) LIKE ?", "%#{query.downcase}%")
        .limit(5)
    artists =
      Entry
        .where("LOWER(artist) LIKE ?", "%#{query.downcase}%")
        .distinct
        .limit(5)
        .pluck(:artist)
    albums =
      Entry
        .where("LOWER(title) LIKE ?", "%#{query.downcase}%")
        .distinct
        .limit(5)
        .pluck(:title, :artist)
    render json: {
      users: users.map do |u|
        {
          id: u.id,
          username: u.username
        }
      end,
      artists: artists,
      albums: albums.map do |title, artist|
        {
          title: title,
          artist: artist
        }
      end,
      reviews: []
    }
  end
end
