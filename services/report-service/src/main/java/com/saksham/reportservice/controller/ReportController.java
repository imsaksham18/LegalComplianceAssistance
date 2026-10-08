package com.saksham.reportservice.controller;

import com.saksham.reportservice.entity.Report;
import com.saksham.reportservice.service.ReportService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class ReportController {

    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    @GetMapping("/reports")
    public List<Report> getReports() {
        return reportService.getReports();
    }

    @PostMapping("/reports")
    public Report createReport(
            @Valid @RequestBody Report report) {

        return reportService.saveReport(report);
    }

    @GetMapping("/reports/{id}")
    public Report getReportById(
            @PathVariable Integer id) {

        return reportService.getReportById(id);
    }

    @PutMapping("/reports/{id}")
    public Report updateReport(
            @PathVariable Integer id,
            @Valid @RequestBody Report report) {

        return reportService.updateReport(id, report);
    }

    @DeleteMapping("/reports/{id}")
    public String deleteReport(
            @PathVariable Integer id) {

        reportService.deleteReport(id);

        return "Report deleted successfully";
    }
}