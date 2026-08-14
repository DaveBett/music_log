class Api::EntriesController < ApplicationController
  before_action :set_entry, only: %i[ show edit update destroy ]
  before_action :authenticate_user!

  # GET /entries or /entries.json
  def index
    render json: current_user.entries.order(created_at: :desc)
  end

  # GET /entries/1 or /entries/1.json
  def show
    render json: @entry
  end

  # GET /entries/new
  def new
    @entry = Entry.new
  end

  # GET /entries/1/edit
  def edit
  end

  # POST /entries or /entries.json
  def create
    entry = current_user.entries.build(entry_params)

    if entry.save
      render json: entry, status: :created
    else
      render json: {
        errors: entry.errors.full_messages
      }, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /entries/1 or /entries/1.json
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

  # DELETE /entries/1 or /entries/1.json
  def destroy
    @entry.destroy!
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_entry
      @entry = current_user.entries.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
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
end
