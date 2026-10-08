package com.saksham.complianceservice.repository;

import com.saksham.complianceservice.entity.Compliance;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ComplianceRepository
        extends JpaRepository<Compliance, Integer> {
}