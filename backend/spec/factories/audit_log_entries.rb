FactoryBot.define do
  factory :audit_log_entry do
    association :actor, factory: :user
    action_type { "member_added" }
    description { "Added member Wyatt Boone (#017)" }
  end
end
