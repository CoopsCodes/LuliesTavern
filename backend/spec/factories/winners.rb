FactoryBot.define do
  factory :winner do
    member
    drawn_at { Time.current }
    member_name_snapshot { member&.full_name || "Wyatt Boone" }
    member_number_snapshot { member&.member_number || "017" }
  end
end
