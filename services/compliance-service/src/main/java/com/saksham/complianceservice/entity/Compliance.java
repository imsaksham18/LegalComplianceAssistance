package com.saksham.complianceservice.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;

@Entity
@Table(name = "compliances")
public class Compliance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private Integer policyId;

    private Integer regulationId;

    @NotBlank(message = "Status cannot be empty")
    private String status;

    @NotBlank(message = "Remarks cannot be empty")
    private String remarks;

    public Compliance() {
    }

    public Compliance(Integer id,
                      Integer policyId,
                      Integer regulationId,
                      String status,
                      String remarks) {
        this.id = id;
        this.policyId = policyId;
        this.regulationId = regulationId;
        this.status = status;
        this.remarks = remarks;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getPolicyId() {
        return policyId;
    }

    public void setPolicyId(Integer policyId) {
        this.policyId = policyId;
    }

    public Integer getRegulationId() {
        return regulationId;
    }

    public void setRegulationId(Integer regulationId) {
        this.regulationId = regulationId;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }
}