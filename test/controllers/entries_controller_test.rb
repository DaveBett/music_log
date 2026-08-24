require "test_helper"

class Api::EntriesControllerTest < ActionDispatch::IntegrationTest
  setup do
    @user = users(:one)
    @entry = entries(:one)
    @headers = auth_headers_for(@user)
  end

  test "should get index" do
    get api_entries_url, headers: @headers
    assert_response :success
  end

  test "should show entry" do
    get api_entry_url(@entry), headers: @headers
    assert_response :success
  end

  test "should create entry" do
    assert_difference("Entry.count") do
      post api_entries_url,
        params: {
          entry: {
            artist: "New Artist",
            title: "New Title",
            year: "2024",
            musicbrainz_id: SecureRandom.uuid
          }
        },
        headers: @headers
    end
    assert_response :created
  end

  test "should update entry" do
    patch api_entry_url(@entry),
      params: { entry: { title: "Updated Title" } },
      headers: @headers
    assert_response :success
  end

  test "should destroy entry" do
    assert_difference("Entry.count", -1) do
      delete api_entry_url(@entry), headers: @headers
    end
  end
end
