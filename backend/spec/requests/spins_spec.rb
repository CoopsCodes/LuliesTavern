require "rails_helper"

RSpec.describe "Spins", type: :request do
  let!(:staff) { create(:user, password: "password123") }

  before { sign_in(staff) }

  describe "POST /spin" do
    it "draws only from active members and records a winner + audit entry" do
      active_member = create(:member, active: true)
      create(:member, active: false)

      expect {
        post "/spin"
      }.to change(Winner, :count).by(1).and change(AuditLogEntry, :count).by(1)

      expect(response).to have_http_status(:created)
      body = response.parsed_body
      expect(body["member_id"]).to eq(active_member.id)
    end

    it "returns an error when there are no active members" do
      create(:member, active: false)

      post "/spin"

      expect(response).to have_http_status(:unprocessable_content)
    end
  end

  describe "GET /winners" do
    it "lists winners newest first" do
      member = create(:member)
      older = create(:winner, member: member, drawn_at: 2.weeks.ago)
      newer = create(:winner, member: member, drawn_at: 1.day.ago)

      get "/winners"

      expect(response.parsed_body.map { |w| w["id"] }).to eq([ newer.id, older.id ])
    end
  end
end
