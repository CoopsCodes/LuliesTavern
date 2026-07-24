# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).

admin = User.find_or_create_by!(email: "admin@luliestavern.test") do |u|
  u.name = "Lulie Owens"
  u.role = :admin
  u.password = "password123"
  u.pin = "1234"
end

staff = User.find_or_create_by!(email: "staff@luliestavern.test") do |u|
  u.name = "Jess Carter"
  u.role = :user
  u.password = "password123"
  u.pin = "4321"
end

members_data = [
  { first_name: "Wyatt", last_name: "Boone", member_number: "017", active: true },
  { first_name: "Dolly", last_name: "Nguyen", member_number: "042", active: true },
  { first_name: "Roy", last_name: "Whitfield", member_number: "108", active: true },
  { first_name: "Sadie", last_name: "Marsh", member_number: "115", active: false },
  { first_name: "Cole", last_name: "Ramirez", member_number: "203", active: true }
]

members_data.each do |attrs|
  Member.find_or_create_by!(member_number: attrs[:member_number]) do |m|
    m.first_name = attrs[:first_name]
    m.last_name = attrs[:last_name]
    m.email = "#{attrs[:first_name].downcase}.#{attrs[:last_name].downcase}@example.test"
    m.active = attrs[:active]
  end
end

sadie = Member.find_by!(member_number: "115")
sadie.old_member_numbers.find_or_create_by!(number: "071") { |n| n.retired_on = 1.year.ago.to_date }

AuditLogEntry.find_or_create_by!(action_type: "seed", description: "Initial seed data loaded") do |entry|
  entry.actor = admin
end

puts "Seeded #{User.count} users and #{Member.count} members."
