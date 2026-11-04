Rails.application.routes.draw do
  get "/health", to: "health#show"
  post "/internal/order-confirmations", to: "internal/order_confirmations#create"
end
