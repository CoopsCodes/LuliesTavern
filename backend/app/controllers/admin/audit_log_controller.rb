class Admin::AuditLogController < ApplicationController
  before_action :require_admin!

  def index
    entries = AuditLogEntry.includes(:actor).order(created_at: :desc)
    render json: entries.map { |e| entry_json(e) }
  end

  private

  def entry_json(entry)
    {
      id: entry.id,
      actor_name: entry.actor.name,
      action_type: entry.action_type,
      description: entry.description,
      created_at: entry.created_at
    }
  end
end
