package com.saksham.reportservice.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;

@Entity
@Table(name = "reports")
public class Report {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @NotBlank(message = "Report name cannot be empty")
    private String reportName;

    @NotBlank(message = "Report type cannot be empty")
    private String reportType;

    @NotBlank(message = "Status cannot be empty")
    private String status;

    private String generatedDate;

    public Report() {
    }

    public Report(Integer id,
                  String reportName,
                  String reportType,
                  String status,
                  String generatedDate) {
        this.id = id;
        this.reportName = reportName;
        this.reportType = reportType;
        this.status = status;
        this.generatedDate = generatedDate;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getReportName() {
        return reportName;
    }

    public void setReportName(String reportName) {
        this.reportName = reportName;
    }

    public String getReportType() {
        return reportType;
    }

    public void setReportType(String reportType) {
        this.reportType = reportType;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getGeneratedDate() {
        return generatedDate;
    }

    public void setGeneratedDate(String generatedDate) {
        this.generatedDate = generatedDate;
    }
}