class OldMemberNumbersController < ApplicationController
  before_action :set_member

  def create
    old_number = @member.old_member_numbers.new(old_number_params)

    if old_number.save
      render json: old_number_json(old_number), status: :created
    else
      render json: { errors: old_number.errors.full_messages }, status: :unprocessable_content
    end
  end

  def destroy
    old_number = @member.old_member_numbers.find(params[:id])
    old_number.destroy
    head :no_content
  end

  private

  def set_member
    @member = Member.find(params[:member_id])
  end

  def old_number_params
    params.permit(:number, :retired_on)
  end

  def old_number_json(old_number)
    { id: old_number.id, number: old_number.number, retired_on: old_number.retired_on }
  end
end
