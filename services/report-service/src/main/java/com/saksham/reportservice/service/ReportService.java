package com.saksham.reportservice.service;

import com.saksham.reportservice.entity.Report;
import com.saksham.reportservice.repository.ReportRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReportService {

    private final ReportRepository reportRepository;

    public ReportService(ReportRepository reportRepository) {
        this.reportRepository = reportRepository;
    }

    public List<Report> getReports() {
        return reportRepository.findAll();
    }

    public Report saveReport(Report report) {
        return reportRepository.save(report);
    }

    public Report getReportById(Integer id) {
        return reportRepository.findById(id)
                .orElse(null);
    }

    public Report updateReport(
            Integer id,
            Report updatedReport) {

        Report existingReport =
                reportRepository.findById(id)
                        .orElse(null);

        if (existingReport != null) {

            existingReport.setReportName(
                    updatedReport.getReportName());

            existingReport.setReportType(
                    updatedReport.getReportType());

            existingReport.setStatus(
                    updatedReport.getStatus());

            existingReport.setGeneratedDate(
                    updatedReport.getGeneratedDate());

            return reportRepository.save(existingReport);
        }

        return null;
    }

    public void deleteReport(Integer id) {
        reportRepository.deleteById(id);
    }
}