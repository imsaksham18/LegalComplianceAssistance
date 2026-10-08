package com.saksham.policyservice.dto;

public class PolicyResponseDTO {

    private Integer id;
    private String policyName;
    private String policyDescription;

    public PolicyResponseDTO() {
    }

    public PolicyResponseDTO(
            Integer id,
            String policyName,
            String policyDescription) {

        this.id = id;
        this.policyName = policyName;
        this.policyDescription = policyDescription;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getPolicyName() {
        return policyName;
    }

    public void setPolicyName(String policyName) {
        this.policyName = policyName;
    }

    public String getPolicyDescription() {
        return policyDescription;
    }

    public void setPolicyDescription(String policyDescription) {
        this.policyDescription = policyDescription;
    }
}