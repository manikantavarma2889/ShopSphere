package com.shopsphere.order.DTO;

import jakarta.validation.constraints.NotBlank;

public record CreateOrderRequest(@NotBlank String shippingAddress) {}
