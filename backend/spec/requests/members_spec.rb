require "rails_helper"

RSpec.describe "Members", type: :request do
  let!(:staff) { create(:user, password: "password123") }

  before { sign_in(staff) }

  describe "GET /members" do
    let!(:active_member) { create(:member, first_name: "Wyatt", last_name: "Boone", member_number: "017", active: true) }
    let!(:inactive_member) { create(:member, first_name: "Sadie", last_name: "Marsh", member_number: "115", active: false) }

    it "lists all members by default" do
      get "/members"

      expect(response).to have_http_status(:ok)
      expect(response.parsed_body.map { |m| m["id"] }).to contain_exactly(active_member.id, inactive_member.id)
    end

    it "filters by active status" do
      get "/members", params: { status: "active" }

      expect(response.parsed_body.map { |m| m["id"] }).to contain_exactly(active_member.id)
    end

    it "searches by name or member number" do
      get "/members", params: { q: "017" }
      expect(response.parsed_body.map { |m| m["id"] }).to contain_exactly(active_member.id)

      get "/members", params: { q: "marsh" }
      expect(response.parsed_body.map { |m| m["id"] }).to contain_exactly(inactive_member.id)
    end

    it "requires authentication" do
      delete "/logout"
      get "/members"

      expect(response).to have_http_status(:unauthorized)
    end
  end

  describe "POST /members" do
    it "creates a member and logs the activity" do
      expect {
        post "/members", params: { first_name: "Cole", last_name: "Ramirez", member_number: "203" }, as: :json
      }.to change(Member, :count).by(1).and change(AuditLogEntry, :count).by(1)

      expect(response).to have_http_status(:created)
    end

    it "rejects a number currently active on another member" do
      create(:member, member_number: "203", active: true)

      post "/members", params: { first_name: "Cole", last_name: "Ramirez", member_number: "203" }, as: :json

      expect(response).to have_http_status(:unprocessable_content)
    end

    it "flags a conflict instead of silently allowing a number held by an inactive member" do
      inactive = create(:member, member_number: "203", active: false, first_name: "Old", last_name: "Holder")

      expect {
        post "/members", params: { first_name: "Cole", last_name: "Ramirez", member_number: "203" }, as: :json
      }.not_to change(Member, :count)

      expect(response).to have_http_status(:conflict)
      expect(response.parsed_body["conflict"]).to eq("member_id" => inactive.id, "member_name" => "Old Holder")
    end

    it "allows the reassignment once staff confirms with reassign_number" do
      create(:member, member_number: "203", active: false)

      post "/members", params: {
        first_name: "Cole", last_name: "Ramirez", member_number: "203", reassign_number: true
      }, as: :json

      expect(response).to have_http_status(:created)
      expect(response.parsed_body["member_number"]).to eq("203")
    end

    it "does not let reassign_number bypass an active conflict" do
      create(:member, member_number: "203", active: true)

      post "/members", params: {
        first_name: "Cole", last_name: "Ramirez", member_number: "203", reassign_number: true
      }, as: :json

      expect(response).to have_http_status(:unprocessable_content)
    end
  end

  describe "PATCH /members/:id and old numbers" do
    let!(:member) { create(:member, active: true) }

    it "logs activity when active status flips" do
      expect {
        patch "/members/#{member.id}", params: { active: false }, as: :json
      }.to change(AuditLogEntry, :count).by(1)

      expect(member.reload.active).to eq(false)
    end

    it "flags a conflict when editing a member's number to one held by an inactive member" do
      inactive = create(:member, member_number: "888", active: false, first_name: "Old", last_name: "Holder")

      patch "/members/#{member.id}", params: { member_number: "888" }, as: :json

      expect(response).to have_http_status(:conflict)
      expect(response.parsed_body["conflict"]).to eq("member_id" => inactive.id, "member_name" => "Old Holder")
      expect(member.reload.member_number).not_to eq("888")
    end

    it "allows the edit once staff confirms with reassign_number" do
      create(:member, member_number: "888", active: false)

      patch "/members/#{member.id}", params: { member_number: "888", reassign_number: true }, as: :json

      expect(response).to have_http_status(:ok)
      expect(member.reload.member_number).to eq("888")
    end

    it "does not flag a conflict against the member's own current number" do
      patch "/members/#{member.id}", params: { first_name: "Renamed" }, as: :json

      expect(response).to have_http_status(:ok)
    end

    it "adds and removes an old number" do
      post "/members/#{member.id}/old_numbers", params: { number: "005", retired_on: "2024-01-01" }, as: :json
      expect(response).to have_http_status(:created)
      old_number_id = response.parsed_body["id"]

      expect {
        delete "/members/#{member.id}/old_numbers/#{old_number_id}"
      }.to change(OldMemberNumber, :count).by(-1)
      expect(response).to have_http_status(:no_content)
    end
  end
end
