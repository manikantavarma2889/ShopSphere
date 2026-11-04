class OrderConfirmationJob < ActiveJob::Base
  queue_as :order_notifications

  def perform(order_id:, user_id:, total_amount:, created_at:)
    Rails.logger.info(
      {
        event: "order_confirmation_processed",
        order_id: order_id,
        user_id: user_id,
        total_amount: total_amount,
        created_at: created_at
      }.to_json
    )

    # Add an email provider here when delivery credentials are configured.
  end
end
