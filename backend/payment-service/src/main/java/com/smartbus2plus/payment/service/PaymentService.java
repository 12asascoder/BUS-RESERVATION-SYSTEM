package com.smartbus2plus.payment.service;

import com.smartbus2plus.payment.model.Payment;
import com.smartbus2plus.payment.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;

/**
 * Payment service for SmartBus2+
 */
@Service
public class PaymentService {
    
    @Autowired
    private PaymentRepository paymentRepository;
    
    private final Random random = new Random();
    
    public Payment processPayment(Long bookingId, Payment.PaymentMethod paymentMethod, BigDecimal amount) {
        Payment payment = new Payment(bookingId, paymentMethod, amount);
        payment.setPaymentDate(LocalDateTime.now());
        
        // Mock payment processing
        boolean paymentSuccess = processMockPayment(paymentMethod, amount);
        
        if (paymentSuccess) {
            payment.setPaymentStatus(Payment.PaymentStatus.COMPLETED);
            payment.setStripePaymentIntentId("pi_" + System.currentTimeMillis());
        } else {
            payment.setPaymentStatus(Payment.PaymentStatus.FAILED);
        }
        
        return paymentRepository.save(payment);
    }
    
    private boolean processMockPayment(Payment.PaymentMethod paymentMethod, BigDecimal amount) {
        // Mock payment processing logic
        // In real implementation, this would integrate with Stripe, PayPal, etc.
        
        // Simulate 95% success rate
        return random.nextDouble() < 0.95;
    }
    
    public Payment refundPayment(Long paymentId, BigDecimal refundAmount) {
        return paymentRepository.findById(paymentId)
                .map(payment -> {
                    if (payment.getPaymentStatus() != Payment.PaymentStatus.COMPLETED) {
                        throw new RuntimeException("Cannot refund non-completed payment");
                    }
                    
                    if (refundAmount.compareTo(payment.getAmount()) > 0) {
                        throw new RuntimeException("Refund amount cannot exceed payment amount");
                    }
                    
                    payment.setRefundAmount(refundAmount);
                    payment.setRefundDate(LocalDateTime.now());
                    payment.setPaymentStatus(Payment.PaymentStatus.REFUNDED);
                    
                    return paymentRepository.save(payment);
                })
                .orElseThrow(() -> new RuntimeException("Payment not found"));
    }
    
    public Payment getPaymentById(Long paymentId) {
        return paymentRepository.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Payment not found"));
    }
    
    public List<Payment> getPaymentsByBooking(Long bookingId) {
        return paymentRepository.findByBookingIdOrderByPaymentDateDesc(bookingId);
    }
    
    public List<Payment> getPaymentsByStatus(Payment.PaymentStatus status) {
        return paymentRepository.findByPaymentStatusOrderByPaymentDateDesc(status);
    }
    
    public BigDecimal getTotalRevenue() {
        return paymentRepository.findTotalRevenue();
    }
    
    public BigDecimal getTotalRefunds() {
        return paymentRepository.findTotalRefunds();
    }
}
