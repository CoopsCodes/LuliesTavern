class OldMemberNumber < ApplicationRecord
  belongs_to :member

  validates :number, presence: true
  validates :retired_on, presence: true
end
