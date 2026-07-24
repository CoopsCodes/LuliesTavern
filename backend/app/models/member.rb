class Member < ApplicationRecord
  has_many :old_member_numbers, dependent: :destroy
  has_many :winners, dependent: :restrict_with_error

  validates :first_name, :last_name, :member_number, presence: true
  validates :member_number,
            uniqueness: { conditions: -> { where(active: true) }, message: "is already assigned to another active member" }
  validates :email, format: { with: URI::MailTo::EMAIL_REGEXP }, allow_blank: true

  scope :active, -> { where(active: true) }

  def full_name
    "#{first_name} #{last_name}"
  end
end
