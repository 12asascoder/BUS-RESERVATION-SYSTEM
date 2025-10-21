package com.smartbus2plus.ai.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * AI Recommendation entity for SmartBus2+
 */
@Entity
@Table(name = "ai_recommendations")
public class AIRecommendation {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "user_id")
    private Long userId;
    
    @NotBlank
    @Column(name = "recommendation_type")
    private String recommendationType; // seat_suggestion, route_optimization, etc.
    
    @Column(columnDefinition = "jsonb")
    private String content; // JSON string for recommendation details
    
    @Column(name = "confidence_score", precision = 3, scale = 2)
    private BigDecimal confidenceScore = BigDecimal.valueOf(0.00);
    
    @Column(name = "is_applied")
    private Boolean isApplied = false;
    
    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    // Constructors
    public AIRecommendation() {}
    
    public AIRecommendation(Long userId, String recommendationType, String content, BigDecimal confidenceScore) {
        this.userId = userId;
        this.recommendationType = recommendationType;
        this.content = content;
        this.confidenceScore = confidenceScore;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    
    public String getRecommendationType() { return recommendationType; }
    public void setRecommendationType(String recommendationType) { this.recommendationType = recommendationType; }
    
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    
    public BigDecimal getConfidenceScore() { return confidenceScore; }
    public void setConfidenceScore(BigDecimal confidenceScore) { this.confidenceScore = confidenceScore; }
    
    public Boolean getIsApplied() { return isApplied; }
    public void setIsApplied(Boolean isApplied) { this.isApplied = isApplied; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
