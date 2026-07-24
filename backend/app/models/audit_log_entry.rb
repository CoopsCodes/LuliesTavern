class AuditLogEntry < ApplicationRecord
  belongs_to :actor, class_name: "User", inverse_of: :audit_log_entries

  validates :action_type, :description, presence: true
end
