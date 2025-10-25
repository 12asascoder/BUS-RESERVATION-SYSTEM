package com.smartbus2plus.payment.repository;

import com.smartbus2plus.payment.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

/**
 * Repository for Payments
 */
@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    
    List<Payment> findByBookingIdOrderByPaymentDateDesc(Long bookingId);
    
    List<Payment> findByPaymentStatusOrderByPaymentDateDesc(Payment.PaymentStatus status);
    
    @Query("SELECT SUM(p.amount) FROM Payment p WHERE p.paymentStatus = 'COMPLETED'")
    BigDecimal findTotalRevenue();
    
    @Query("SELECT SUM(p.refundAmount) FROM Payment p WHERE p.paymentStatus = 'REFUNDED'")
    BigDecimal findTotalRefunds();
    
    @Query("SELECT COUNT(p) FROM Payment p WHERE p.paymentStatus = :status")
    Long countByPaymentStatus(Payment.PaymentStatus status);
    
    @Query("SELECT AVG(p.amount) FROM Payment p WHERE p.paymentStatus = 'COMPLETED'")
    BigDecimal findAveragePaymentAmount();
}

