class MembersController < ApplicationController
  before_action :set_member, only: %i[show update]

  def index
    members = Member.all
    members = members.active if params[:status] == "active"
    members = members.where(active: false) if params[:status] == "inactive"

    if params[:q].present?
      q = "%#{params[:q].strip}%"
      members = members.where(
        "first_name LIKE :q OR last_name LIKE :q OR member_number LIKE :q OR (first_name || ' ' || last_name) LIKE :q",
        q: q
      )
    end

    render json: members.order(:last_name, :first_name).map { |m| member_json(m) }
  end

  def show
    render json: member_json(@member)
  end

  def create
    if (conflict = inactive_number_conflict(member_params[:member_number])) && !reassign_number?
      return render json: { conflict: conflict_json(conflict) }, status: :conflict
    end

    member = Member.new(member_params)

    if member.save
      log_activity!(
        action_type: "member_added",
        description: "Added member #{member.full_name} (##{member.member_number})"
      )
      render json: member_json(member), status: :created
    else
      render json: { errors: member.errors.full_messages }, status: :unprocessable_content
    end
  end

  def update
    conflict = inactive_number_conflict(member_params[:member_number], excluding_id: @member.id)
    if conflict && !reassign_number?
      return render json: { conflict: conflict_json(conflict) }, status: :conflict
    end

    was_active = @member.active

    if @member.update(member_params)
      if was_active != @member.active
        state = @member.active? ? "activated" : "deactivated"
        log_activity!(
          action_type: "member_#{state}",
          description: "#{state.capitalize} member #{@member.full_name} (##{@member.member_number})"
        )
      end
      render json: member_json(@member)
    else
      render json: { errors: @member.errors.full_messages }, status: :unprocessable_content
    end
  end

  private

  def set_member
    @member = Member.find(params[:id])
  end

  def member_params
    params.permit(:first_name, :last_name, :email, :member_number, :active)
  end

  def reassign_number?
    ActiveModel::Type::Boolean.new.cast(params[:reassign_number])
  end

  # A number currently sitting on an INACTIVE member isn't in active use, so
  # rather than silently letting a new member claim it (confusing) or hard
  # blocking it (the active-only DB/model uniqueness already blocks a live
  # collision), the frontend confirms the reassignment with staff first.
  def inactive_number_conflict(number, excluding_id: nil)
    return nil if number.blank?

    scope = Member.where(member_number: number, active: false)
    scope = scope.where.not(id: excluding_id) if excluding_id
    scope.first
  end

  def conflict_json(member)
    { member_id: member.id, member_name: member.full_name }
  end

  def member_json(member)
    {
      id: member.id,
      first_name: member.first_name,
      last_name: member.last_name,
      full_name: member.full_name,
      email: member.email,
      member_number: member.member_number,
      active: member.active,
      old_numbers: member.old_member_numbers.order(retired_on: :desc).map do |n|
        { id: n.id, number: n.number, retired_on: n.retired_on }
      end
    }
  end
end
