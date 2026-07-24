class CreateAuditLogEntries < ActiveRecord::Migration[8.0]
  def change
    create_table :audit_log_entries do |t|
      t.references :actor, null: false, foreign_key: { to_table: :users }
      t.string :action_type, null: false
      t.text :description, null: false

      t.timestamps
    end
  end
end
