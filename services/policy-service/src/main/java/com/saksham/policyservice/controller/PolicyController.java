package com.saksham.policyservice.controller;

import com.saksham.policyservice.dto.PolicyResponseDTO;
import com.saksham.policyservice.entity.Policy;
import com.saksham.policyservice.service.PolicyService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class PolicyController {

    private final PolicyService policyService;

    public PolicyController(PolicyService policyService) {
        this.policyService = policyService;
    }

    @Operation(summary = "Get all policies")
    @GetMapping("/policies")
    public List<Policy> getPolicies() {
        return policyService.getPolicies();
    }

    @Operation(summary = "Create a new policy")
    @PostMapping("/policies")
    public Policy createPolicy(@Valid @RequestBody Policy policy) {
        return policyService.savePolicy(policy);
    }

    @Operation(summary = "Get policy by ID")
    @GetMapping("/policies/{id}")
    public PolicyResponseDTO getPolicyById(@PathVariable Integer id) {
        return policyService.getPolicyDtoById(id);
    }

    @Operation(summary = "Update a policy")
    @PutMapping("/policies/{id}")
    public Policy updatePolicy(
            @PathVariable Integer id,
            @Valid @RequestBody Policy policy) {

        return policyService.updatePolicy(id, policy);
    }

    @Operation(summary = "Delete a policy")
    @DeleteMapping("/policies/{id}")
    public String deletePolicy(@PathVariable Integer id) {

        policyService.deletePolicy(id);

        return "Policy deleted successfully";
    }
}