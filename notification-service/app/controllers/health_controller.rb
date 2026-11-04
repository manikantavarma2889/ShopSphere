class HealthController < ApplicationController
  def show
    render json: { status: "ok", service: "shopsphere-notification-service" }
  end
end
