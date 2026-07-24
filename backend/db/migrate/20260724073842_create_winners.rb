class CreateWinners < ActiveRecord::Migration[8.0]
  def change
    create_table :winners do |t|
      t.references :member, null: false, foreign_key: true
      t.datetime :drawn_at, null: false
      t.string :member_name_snapshot, null: false
      t.string :member_number_snapshot, null: false

      t.timestamps
    end
  end
end
