package com.saksham.regulationservice.repository;

import com.saksham.regulationservice.entity.Regulation;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RegulationRepository
        extends JpaRepository<Regulation, Integer> {
}