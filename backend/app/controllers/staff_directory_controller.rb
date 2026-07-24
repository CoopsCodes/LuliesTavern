class StaffDirectoryController < ApplicationController
  # Public and unauthenticated: the Quick PIN login screen needs to show
  # tappable name buttons before anyone is signed in. Only name/role are
  # exposed here, never email/pin/anything sensitive.
  skip_before_action :authenticate!, only: :index

  def index
    render json: User.active.order(:name).map { |u| { id: u.id, name: u.name, role: u.role } }
  end
end
