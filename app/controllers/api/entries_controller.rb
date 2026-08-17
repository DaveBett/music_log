class Api::EntriesController < ApplicationController
  before_action :set_entry, only: %i[ show edit update destroy ]
  before_action :authenticate_user!

  def index
    render json: current_user.entries.order(created_at: :desc)
  end

  def show
    render json: @entry
  end

  def new
    @entry = Entry.new
  end

  def edit
  end

  def create
    entry = current_user.entries.build(entry_params)

    if entry.save
      attach_musicbrainz_genres(entry)

      render json: entry.reload, status: :created
    else
      render json: {
        errors: entry.errors.full_messages
      }, status: :unprocessable_entity
    end
  end

  def update
    entry = current_user.entries.find(params[:id])

    if entry.update(entry_params)
      render json: entry
    else
      render json: {
        errors: entry.errors.full_messages
      }, status: :unprocessable_entity
    end
  end

  def destroy
    @entry.destroy!
  end

  private
    def set_entry
      @entry = current_user.entries.find(params[:id])
    end

    def entry_params
      params.expect(
        entry: [
          :artist,
          :title,
          :year,
          :musicbrainz_id,
          :musicbrainz_url
        ]
      )
    end

    def attach_musicbrainz_genres(entry)
      return if entry.musicbrainz_id.blank?

      album =
        MusicBrainzService.get_release_group(
          entry.musicbrainz_id
        )

      return unless album

      album[:genres].each do |genre_name|
        genre =
          Genre.find_or_create_by!(
            name: genre_name
          )

        EntryGenre.find_or_create_by!(
          entry: entry,
          genre: genre
        )
      end

    rescue StandardError => e
      Rails.logger.error(
        "Unable to attach MusicBrainz genres for Entry #{entry.id}: #{e.message}"
      )
    end
end
