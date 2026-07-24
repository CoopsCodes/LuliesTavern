class Admin::UsersController < ApplicationController
  before_action :require_admin!
  before_action :set_user, only: :update

  def index
    render json: User.order(:name).map { |u| user_json(u) }
  end

  def create
    user = User.new(create_params)

    if user.save
      log_activity!(action_type: "account_created", description: "Created #{user.role} account for #{user.name}")
      render json: user_json(user), status: :created
    else
      render json: { errors: user.errors.full_messages }, status: :unprocessable_content
    end
  end

  def update
    was_active = @user.active

    if @user.update(update_params)
      if was_active != @user.active
        state = @user.active? ? "activated" : "deactivated"
        log_activity!(action_type: "account_#{state}", description: "#{state.capitalize} account for #{@user.name}")
      end
      render json: user_json(@user)
    else
      render json: { errors: @user.errors.full_messages }, status: :unprocessable_content
    end
  end

  private

  def set_user
    @user = User.find(params[:id])
  end

  def create_params
    params.permit(:name, :email, :password, :pin, :role)
  end

  def update_params
    params.permit(:active)
  end
end
