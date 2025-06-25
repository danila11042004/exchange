package com.example.webapp.repository;
import java.util.List;
import com.example.webapp.entity.Deal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.EntityGraph;

@Repository
public interface DealRepository extends JpaRepository<Deal, Long> {
    List<Deal> findByBuyerId(Long buyerId);
}