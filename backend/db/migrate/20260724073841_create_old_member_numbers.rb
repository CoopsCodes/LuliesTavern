class CreateOldMemberNumbers < ActiveRecord::Migration[8.0]
  def change
    create_table :old_member_numbers do |t|
      t.references :member, null: false, foreign_key: true
      t.string :number, null: false
      t.date :retired_on, null: false

      t.timestamps
    end
  end
end
