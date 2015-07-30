class User < ActiveRecord::Base

  after_commit :publish_update, on: :update
  after_commit :publish_create, on: :create
  after_commit :publish_destroy, on: :destroy

  def redis
    Redis.new
  end

  def publish_update
    publish(:update)
  end

  def publish_create
    publish(:create)
  end

  def publish_destroy
    publish(:destroy)
  end

  def publish(event)
    redis.publish('ChatChannel', {event: event, object: self}.to_json)
  end
end
