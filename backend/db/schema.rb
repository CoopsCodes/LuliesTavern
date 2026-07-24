# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.0].define(version: 2026_07_24_102755) do
  create_table "audit_log_entries", force: :cascade do |t|
    t.integer "actor_id", null: false
    t.string "action_type", null: false
    t.text "description", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["actor_id"], name: "index_audit_log_entries_on_actor_id"
  end

  create_table "members", force: :cascade do |t|
    t.string "first_name", null: false
    t.string "last_name", null: false
    t.string "email"
    t.string "member_number", null: false
    t.boolean "active", default: true, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["member_number"], name: "index_members_on_member_number_when_active", unique: true, where: "active = 1"
  end

  create_table "old_member_numbers", force: :cascade do |t|
    t.integer "member_id", null: false
    t.string "number", null: false
    t.date "retired_on", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["member_id"], name: "index_old_member_numbers_on_member_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "name", null: false
    t.string "email", null: false
    t.string "password_digest", null: false
    t.string "pin_digest", null: false
    t.integer "role", default: 0, null: false
    t.boolean "active", default: true, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["email"], name: "index_users_on_email", unique: true
  end

  create_table "winners", force: :cascade do |t|
    t.integer "member_id", null: false
    t.datetime "drawn_at", null: false
    t.string "member_name_snapshot", null: false
    t.string "member_number_snapshot", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["member_id"], name: "index_winners_on_member_id"
  end

  add_foreign_key "audit_log_entries", "users", column: "actor_id"
  add_foreign_key "old_member_numbers", "members"
  add_foreign_key "winners", "members"
end
