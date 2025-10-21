package com.smartbus2plus.payment.controller;

import com.smartbus2plus.payment.model.Payment;
import com.smartbus2plus.payment.service.PaymentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

/**
 * Payment controller for SmartBus2+
 */
@RestController
@RequestMapping("/api/payment")
@Tag(name = "Payment", description = "Payment processing and transaction management")
public class PaymentController {
    
    @Autowired
    private PaymentService paymentService;
    
    @PostMapping("/process")
    @Operation(summary = "Process payment", description = "Process a payment for a booking")
    public ResponseEntity<Payment> processPayment(
            @RequestParam Long bookingId,
            @RequestParam Payment.PaymentMethod paymentMethod,
            @RequestParam BigDecimal amount) {
        Payment payment = paymentService.processPayment(bookingId, paymentMethod, amount);
        return ResponseEntity.ok(payment);
    }
    
    @PostMapping("/{paymentId}/refund")
    @Operation(summary = "Refund payment", description = "Refund a completed payment")
    public ResponseEntity<Payment> refundPayment(
            @PathVariable Long paymentId,
            @RequestParam BigDecimal refundAmount) {
        Payment payment = paymentService.refundPayment(paymentId, refundAmount);
        return ResponseEntity.ok(payment);
    }
    
    @GetMapping("/{paymentId}")
    @Operation(summary = "Get payment by ID", description = "Retrieve payment details by ID")
    public ResponseEntity<Payment> getPaymentById(@PathVariable Long paymentId) {
        Payment payment = paymentService.getPaymentById(paymentId);
        return ResponseEntity.ok(payment);
    }
    
    @GetMapping("/booking/{bookingId}")
    @Operation(summary = "Get payments by booking", description = "Retrieve all payments for a booking")
    public ResponseEntity<List<Payment>> getPaymentsByBooking(@PathVariable Long bookingId) {
        List<Payment> payments = paymentService.getPaymentsByBooking(bookingId);
        return ResponseEntity.ok(payments);
    }
    
    @GetMapping("/status/{status}")
    @Operation(summary = "Get payments by status", description = "Retrieve payments by status")
    public ResponseEntity<List<Payment>> getPaymentsByStatus(@PathVariable Payment.PaymentStatus status) {
        List<Payment> payments = paymentService.getPaymentsByStatus(status);
        return ResponseEntity.ok(payments);
    }
    
    @GetMapping("/revenue/total")
    @Operation(summary = "Get total revenue", description = "Get total revenue from completed payments")
    public ResponseEntity<BigDecimal> getTotalRevenue() {
        BigDecimal revenue = paymentService.getTotalRevenue();
        return ResponseEntity.ok(revenue);
    }
    
    @GetMapping("/revenue/refunds")
    @Operation(summary = "Get total refunds", description = "Get total refund amount")
    public ResponseEntity<BigDecimal> getTotalRefunds() {
        BigDecimal refunds = paymentService.getTotalRefunds();
        return ResponseEntity.ok(refunds);
    }
    
    @GetMapping("/health")
    @Operation(summary = "Health check", description = "Check Payment service health")
    public ResponseEntity<String> healthCheck() {
        return ResponseEntity.ok("Payment Service is running");
    }
}
