# lib/tasks/cleanup_orphan_activities.rake
namespace :activities do
  desc "Remove orphaned or invalid follow activities"
  task cleanup_orphan_follows: :environment do
    removed = 0

    Activity.follow.find_each do |activity|
      follow = Follow.find_by(id: activity.trackable_id)

      if follow.nil? || follow.follower_id == follow.followed_id
        activity.destroy
        removed += 1
      end
    end

    puts "Removed #{removed} orphaned/invalid follow activities"
  end
end
