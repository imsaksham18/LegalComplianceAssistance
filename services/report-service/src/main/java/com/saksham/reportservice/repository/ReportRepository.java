package com.saksham.reportservice.repository;

import com.saksham.reportservice.entity.Report;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReportRepository
        extends JpaRepository<Report, Integer> {
}