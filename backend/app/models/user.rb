class User < ApplicationRecord
  has_secure_password
  has_secure_password :pin, validations: false

  enum :role, { user: 0, admin: 1 }

  before_validation { self.email = email&.downcase }

  validates :name, presence: true
  validates :email, presence: true, uniqueness: { case_sensitive: false },
                     format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :pin, presence: true, on: :create
  validates :pin, format: { with: /\A\d{4}\z/, message: "must be exactly 4 digits" }, allow_blank: true

  has_many :audit_log_entries, foreign_key: :actor_id, inverse_of: :actor, dependent: :restrict_with_error

  scope :active, -> { where(active: true) }
end
