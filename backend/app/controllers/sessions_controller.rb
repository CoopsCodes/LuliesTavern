class SessionsController < ApplicationController
  skip_before_action :authenticate!, only: :create

  def create
    user = find_user_for_login

    if user
      reset_session
      session[:user_id] = user.id
      render json: { user: user_json(user) }
    else
      render json: { error: "Invalid credentials" }, status: :unauthorized
    end
  end

  def destroy
    reset_session
    head :no_content
  end

  private

  def find_user_for_login
    if params[:user_id].present? && params[:pin].present?
      user = User.active.find_by(id: params[:user_id])
      user if user&.authenticate_pin(params[:pin])
    elsif params[:email].present? && params[:password].present?
      user = User.active.find_by(email: params[:email].to_s.downcase)
      user if user&.authenticate(params[:password])
    end
  end
end
