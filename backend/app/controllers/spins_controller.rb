class SpinsController < ApplicationController
  # Determined server-side (not left to client JS) so the result can't be
  # manipulated via devtools and the audit trail stays trustworthy; the
  # client only owns the wheel/ticker animation, seeded on this response.
  def create
    eligible = Member.active.to_a
    return render json: { error: "No active members to draw from" }, status: :unprocessable_content if eligible.empty?

    member = eligible.sample
    winner = Winner.create!(
      member: member,
      drawn_at: Time.current,
      member_name_snapshot: member.full_name,
      member_number_snapshot: member.member_number
    )

    log_activity!(
      action_type: "draw_run",
      description: "Drew #{member.full_name} (##{member.member_number}) in the weekly badge draw"
    )

    render json: winner_json(winner), status: :created
  end

  private

  def winner_json(winner)
    {
      id: winner.id,
      drawn_at: winner.drawn_at,
      member_id: winner.member_id,
      member_name: winner.member_name_snapshot,
      member_number: winner.member_number_snapshot
    }
  end
end
