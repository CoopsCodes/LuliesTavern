require "rails_helper"

RSpec.describe "Admin::AuditLog", type: :request do
  let!(:admin) { create(:user, :admin, password: "password123") }
  let!(:staff) { create(:user, password: "password123") }

  it "forbids staff" do
    sign_in(staff)

    get "/admin/audit_log"

    expect(response).to have_http_status(:forbidden)
  end

  it "lists entries newest first for admins" do
    create(:audit_log_entry, actor: admin, created_at: 2.days.ago)
    recent = create(:audit_log_entry, actor: admin, created_at: 1.hour.ago)

    sign_in(admin)
    get "/admin/audit_log"

    expect(response).to have_http_status(:ok)
    expect(response.parsed_body.first["id"]).to eq(recent.id)
  end
end
