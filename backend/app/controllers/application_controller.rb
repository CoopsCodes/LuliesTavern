class ApplicationController < ActionController::API
  include ActionController::Cookies

  before_action :authenticate!

  private

  def current_user
    @current_user ||= User.active.find_by(id: session[:user_id])
  end

  def authenticate!
    render json: { error: "Not authenticated" }, status: :unauthorized unless current_user
  end

  def require_admin!
    render json: { error: "Forbidden" }, status: :forbidden unless current_user&.admin?
  end

  def log_activity!(action_type:, description:)
    AuditLogEntry.create!(actor: current_user, action_type: action_type, description: description)
  end

  def user_json(user)
    { id: user.id, name: user.name, email: user.email, role: user.role, active: user.active }
  end
end
