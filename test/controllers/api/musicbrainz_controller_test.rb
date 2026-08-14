require "test_helper"

class Api::MusicbrainzControllerTest < ActionDispatch::IntegrationTest
  test "should get search" do
    get api_musicbrainz_search_url
    assert_response :success
  end
end
