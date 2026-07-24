require "rails_helper"

RSpec.describe "StaffDirectory", type: :request do
  it "lists active accounts without requiring authentication" do
    active = create(:user, name: "Jess Carter")
    create(:user, name: "Retired Staffer", active: false)

    get "/staff_directory"

    expect(response).to have_http_status(:ok)
    names = response.parsed_body.map { |u| u["name"] }
    expect(names).to include("Jess Carter")
    expect(names).not_to include("Retired Staffer")
    expect(response.parsed_body.first.keys).to contain_exactly("id", "name", "role")
    expect(active).to be_active
  end
end
