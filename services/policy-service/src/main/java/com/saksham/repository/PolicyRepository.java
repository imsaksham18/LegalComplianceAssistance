package com.saksham.policyservice.repository;

import com.saksham.policyservice.entity.Policy;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PolicyRepository extends JpaRepository<Policy, Integer> {
}