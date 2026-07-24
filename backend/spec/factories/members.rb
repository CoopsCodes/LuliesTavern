FactoryBot.define do
  factory :member do
    first_name { "Wyatt" }
    last_name { "Boone" }
    sequence(:email) { |n| "member#{n}@example.test" }
    sequence(:member_number) { |n| format("%03d", n) }
    active { true }
  end
end
