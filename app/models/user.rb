class User < ActiveRecord::Base

  after_commit :redis_publish

  def redis_publish
    redis = Redis.new
    redis.publish('ChatChannel', self.to_json)
  end
end
