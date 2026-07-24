require "rails_helper"

RSpec.describe "Sessions", type: :request do
  let!(:user) { create(:user, email: "jess@luliestavern.test", password: "password123", pin: "5150") }

  describe "POST /login" do
    it "logs in with a valid email + password" do
      post "/login", params: { email: user.email, password: "password123" }, as: :json

      expect(response).to have_http_status(:ok)
      expect(response.parsed_body["user"]["id"]).to eq(user.id)
    end

    it "logs in with the selected person's id + PIN" do
      post "/login", params: { user_id: user.id, pin: "5150" }, as: :json

      expect(response).to have_http_status(:ok)
      expect(response.parsed_body["user"]["id"]).to eq(user.id)
    end

    it "rejects a PIN that doesn't match the selected person" do
      other = create(:user, pin: "9999")

      post "/login", params: { user_id: other.id, pin: "5150" }, as: :json

      expect(response).to have_http_status(:unauthorized)
    end

    it "allows the same PIN on two different accounts, since login is scoped by id" do
      other = create(:user, :admin, pin: "5150")

      post "/login", params: { user_id: other.id, pin: "5150" }, as: :json
      expect(response.parsed_body["user"]["id"]).to eq(other.id)

      post "/login", params: { user_id: user.id, pin: "5150" }, as: :json
      expect(response.parsed_body["user"]["id"]).to eq(user.id)
    end

    it "rejects an invalid password" do
      post "/login", params: { email: user.email, password: "wrong" }, as: :json

      expect(response).to have_http_status(:unauthorized)
    end

    it "rejects a deactivated account" do
      user.update!(active: false)

      post "/login", params: { email: user.email, password: "password123" }, as: :json

      expect(response).to have_http_status(:unauthorized)
    end
  end

  describe "session lifecycle" do
    it "persists the session across requests and clears it on logout" do
      post "/login", params: { email: user.email, password: "password123" }, as: :json
      get "/me"
      expect(response).to have_http_status(:ok)

      delete "/logout"
      expect(response).to have_http_status(:no_content)

      get "/me"
      expect(response).to have_http_status(:unauthorized)
    end
  end
end
