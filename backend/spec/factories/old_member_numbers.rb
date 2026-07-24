FactoryBot.define do
  factory :old_member_number do
    member
    sequence(:number) { |n| format("%03d", n) }
    retired_on { 1.year.ago.to_date }
  end
end
