class Winner < ApplicationRecord
  belongs_to :member

  validates :drawn_at, :member_name_snapshot, :member_number_snapshot, presence: true
end
