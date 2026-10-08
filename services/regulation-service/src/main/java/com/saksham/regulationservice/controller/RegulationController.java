package com.saksham.regulationservice.controller;

import com.saksham.regulationservice.entity.Regulation;
import com.saksham.regulationservice.service.RegulationService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class RegulationController {

    private final RegulationService regulationService;

    public RegulationController(RegulationService regulationService) {
        this.regulationService = regulationService;
    }

    @GetMapping("/regulations")
    public List<Regulation> getRegulations() {
        return regulationService.getRegulations();
    }

    @PostMapping("/regulations")
    public Regulation createRegulation(
            @Valid @RequestBody Regulation regulation) {

        return regulationService.saveRegulation(regulation);
    }

    @GetMapping("/regulations/{id}")
    public Regulation getRegulationById(
            @PathVariable Integer id) {

        return regulationService.getRegulationById(id);
    }

    @PutMapping("/regulations/{id}")
    public Regulation updateRegulation(
            @PathVariable Integer id,
            @Valid @RequestBody Regulation regulation) {

        return regulationService.updateRegulation(id, regulation);
    }

    @DeleteMapping("/regulations/{id}")
    public String deleteRegulation(
            @PathVariable Integer id) {

        regulationService.deleteRegulation(id);

        return "Regulation deleted successfully";
    }
}