package com.saksham.complianceservice.controller;

import com.saksham.complianceservice.entity.Compliance;
import com.saksham.complianceservice.service.ComplianceService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class ComplianceController {

    private final ComplianceService complianceService;

    public ComplianceController(ComplianceService complianceService) {
        this.complianceService = complianceService;
    }

    @GetMapping("/compliances")
    public List<Compliance> getCompliances() {
        return complianceService.getCompliances();
    }

    @PostMapping("/compliances")
    public Compliance createCompliance(
            @Valid @RequestBody Compliance compliance) {

        return complianceService.saveCompliance(compliance);
    }

    @GetMapping("/compliances/{id}")
    public Compliance getComplianceById(
            @PathVariable Integer id) {

        return complianceService.getComplianceById(id);
    }

    @PutMapping("/compliances/{id}")
    public Compliance updateCompliance(
            @PathVariable Integer id,
            @Valid @RequestBody Compliance compliance) {

        return complianceService.updateCompliance(
                id,
                compliance
        );
    }

    @DeleteMapping("/compliances/{id}")
    public String deleteCompliance(
            @PathVariable Integer id) {

        complianceService.deleteCompliance(id);

        return "Compliance deleted successfully";
    }
}