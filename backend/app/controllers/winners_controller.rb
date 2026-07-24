class WinnersController < ApplicationController
  def index
    winners = Winner.order(drawn_at: :desc)
    render json: winners.map { |w| winner_json(w) }
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
