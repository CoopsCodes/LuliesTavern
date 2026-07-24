class CreateMembers < ActiveRecord::Migration[8.0]
  def change
    create_table :members do |t|
      t.string :first_name, null: false
      t.string :last_name, null: false
      t.string :email
      t.string :member_number, null: false
      t.boolean :active, null: false, default: true

      t.timestamps
    end
    add_index :members, :member_number, unique: true
  end
end
