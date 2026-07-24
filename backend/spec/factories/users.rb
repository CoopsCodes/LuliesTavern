FactoryBot.define do
  factory :user do
    sequence(:name) { |n| "Staffer #{n}" }
    sequence(:email) { |n| "staffer#{n}@luliestavern.test" }
    sequence(:pin) { |n| format("%04d", 1000 + n) }
    password { "password123" }
    role { :user }
    active { true }

    trait :admin do
      role { :admin }
    end
  end
end
