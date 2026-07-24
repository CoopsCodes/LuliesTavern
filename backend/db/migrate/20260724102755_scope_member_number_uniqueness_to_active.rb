class ScopeMemberNumberUniquenessToActive < ActiveRecord::Migration[8.0]
  def change
    remove_index :members, :member_number, unique: true, name: "index_members_on_member_number"
    add_index :members, :member_number, unique: true, where: "active = 1", name: "index_members_on_member_number_when_active"
  end
end
