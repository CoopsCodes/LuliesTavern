class UsersController < ApplicationController
  def me
    render json: user_json(current_user)
  end

  def update_me
    if current_user.update(me_params)
      render json: user_json(current_user)
    else
      render json: { errors: current_user.errors.full_messages }, status: :unprocessable_content
    end
  end

  private

  def me_params
    params.permit(:password, :pin)
  end
end
