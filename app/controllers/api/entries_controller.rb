class Api::EntriesController < ApplicationController
  skip_forgery_protection
  before_action :set_entry, only: %i[ show edit update destroy ]

  # GET /entries or /entries.json
  def index
    @entries = Entry.order(created_at: :desc)

    render json: @entries
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
    @entry = Entry.new(entry_params)

    if @entry.save
      render json: @entry, status: :created
    else
      render json: @entry.errors, status: :unprocessable_content
    end
  end

  # PATCH/PUT /entries/1 or /entries/1.json
  def update
    if @entry.update(entry_params)
      render json: @entry, status: :ok
    else
      render json: @entry.errors, status: :unprocessable_content
    end
  end

  # DELETE /entries/1 or /entries/1.json
  def destroy
    @entry.destroy!
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_entry
      @entry = Entry.find(params.expect(:id))
    end

    # Only allow a list of trusted parameters through.
    def entry_params
      params.expect(entry: [ :artist, :title, :year ])
    end
end
