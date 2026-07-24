require "rails_helper"

RSpec.describe "Admin::Users", type: :request do
  let!(:admin) { create(:user, :admin, password: "password123") }
  let!(:staff) { create(:user, password: "password123") }

  describe "authorization" do
    it "forbids staff from listing accounts" do
      sign_in(staff)

      get "/admin/users"

      expect(response).to have_http_status(:forbidden)
    end

    it "allows admins to list accounts" do
      sign_in(admin)

      get "/admin/users"

      expect(response).to have_http_status(:ok)
      expect(response.parsed_body.map { |u| u["id"] }).to contain_exactly(admin.id, staff.id)
    end
  end

  describe "POST /admin/users" do
    it "creates a staff account and logs the activity" do
      sign_in(admin)

      expect {
        post "/admin/users", params: {
          name: "New Hire", email: "new.hire@luliestavern.test", password: "password123", pin: "7788", role: "user"
        }, as: :json
      }.to change(User, :count).by(1).and change(AuditLogEntry, :count).by(1)

      expect(response).to have_http_status(:created)
    end
  end

  describe "PATCH /admin/users/:id" do
    it "toggles active status and logs the activity" do
      sign_in(admin)

      expect {
        patch "/admin/users/#{staff.id}", params: { active: false }, as: :json
      }.to change(AuditLogEntry, :count).by(1)

      expect(staff.reload.active).to eq(false)
    end
  end
end
