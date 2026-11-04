module Internal
  class OrderConfirmationsController < ApplicationController
    def create
      expected_token = ENV.fetch("NOTIFICATION_SERVICE_TOKEN")
      provided_token = request.headers["Authorization"].to_s

      unless ActiveSupport::SecurityUtils.secure_compare(
        provided_token,
        "Bearer #{expected_token}"
      )
        return render json: { error: "unauthorized" }, status: :unauthorized
      end

      required_fields = %w[orderId userId totalAmount createdAt]
      missing_fields = required_fields.reject { |field| params.key?(field) }

      if missing_fields.any?
        return render json: { error: "missing fields", fields: missing_fields }, status: :unprocessable_entity
      end

      OrderConfirmationJob.perform_later(
        order_id: params[:orderId],
        user_id: params[:userId],
        total_amount: params[:totalAmount],
        created_at: params[:createdAt]
      )

      render json: { accepted: true, queued: true }, status: :accepted
    end
  end
end
