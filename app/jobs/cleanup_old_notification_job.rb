class CleanupOldNotificationsJob < ApplicationJob
  queue_as :default

  def perform
    deleted_count = Notification
      .where.not(read_at: nil)
      .where("read_at < ?", 7.days.ago)
      .delete_all

    Rails.logger.info("CleanupOldNotificationsJob: removed #{deleted_count} old read notifications")
  end
end
