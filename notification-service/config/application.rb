require_relative "boot"
require "rails"
require "action_controller/railtie"
require "active_job/railtie"

module ShopSphereNotifications
  class Application < Rails::Application
    config.load_defaults 7.1
    config.api_only = true
    config.active_job.queue_adapter = :sidekiq
    config.secret_key_base = ENV.fetch("SECRET_KEY_BASE", "local-development-secret-key-change-before-production")
  end
end
