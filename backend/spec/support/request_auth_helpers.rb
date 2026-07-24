module RequestAuthHelpers
  # Logs in via the real /login endpoint so the integration session cookie
  # is set exactly as it would be for a browser request.
  def sign_in(user, password: "password123")
    post "/login", params: { email: user.email, password: password }, as: :json
  end
end

RSpec.configure do |config|
  config.include RequestAuthHelpers, type: :request
end
