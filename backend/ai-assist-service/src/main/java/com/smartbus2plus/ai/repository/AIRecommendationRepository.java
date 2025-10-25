package com.smartbus2plus.ai.repository;

import com.smartbus2plus.ai.model.AIRecommendation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Repository for AI recommendations
 */
@Repository
public interface AIRecommendationRepository extends JpaRepository<AIRecommendation, Long> {
    
    List<AIRecommendation> findByUserIdOrderByCreatedAtDesc(Long userId);
    
    List<AIRecommendation> findByRecommendationTypeOrderByCreatedAtDesc(String recommendationType);
    
    @Query("SELECT r FROM AIRecommendation r WHERE r.userId = :userId AND r.recommendationType = :type ORDER BY r.createdAt DESC")
    List<AIRecommendation> findByUserIdAndRecommendationTypeOrderByCreatedAtDesc(@Param("userId") Long userId, @Param("type") String type);
    
    @Query("SELECT r FROM AIRecommendation r WHERE r.createdAt > :cutoff ORDER BY r.createdAt DESC")
    List<AIRecommendation> findRecentRecommendations(@Param("cutoff") LocalDateTime cutoff);
    
    @Query("SELECT r FROM AIRecommendation r WHERE r.isApplied = false ORDER BY r.createdAt DESC")
    List<AIRecommendation> findUnappliedRecommendations();
    
    @Query("SELECT COUNT(r) FROM AIRecommendation r WHERE r.userId = :userId AND r.isApplied = true")
    Long countAppliedRecommendationsByUser(@Param("userId") Long userId);
}

