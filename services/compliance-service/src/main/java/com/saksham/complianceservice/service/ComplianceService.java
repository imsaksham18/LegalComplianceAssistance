package com.saksham.complianceservice.service;

import com.saksham.complianceservice.entity.Compliance;
import com.saksham.complianceservice.exception.ResourceNotFoundException;
import com.saksham.complianceservice.repository.ComplianceRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ComplianceService {

    private final ComplianceRepository complianceRepository;

    public ComplianceService(ComplianceRepository complianceRepository) {
        this.complianceRepository = complianceRepository;
    }

    public List<Compliance> getCompliances() {
        return complianceRepository.findAll();
    }

    public Compliance saveCompliance(Compliance compliance) {
        return complianceRepository.save(compliance);
    }

    public Compliance getComplianceById(Integer id) {
        return complianceRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Compliance not found with id: " + id
                        )
                );
    }

    public Compliance updateCompliance(
            Integer id,
            Compliance updatedCompliance) {

        Compliance existingCompliance =
                complianceRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Compliance not found with id: " + id
                                )
                        );

        existingCompliance.setPolicyId(
                updatedCompliance.getPolicyId());

        existingCompliance.setRegulationId(
                updatedCompliance.getRegulationId());

        existingCompliance.setStatus(
                updatedCompliance.getStatus());

        existingCompliance.setRemarks(
                updatedCompliance.getRemarks());

        return complianceRepository.save(existingCompliance);
    }

    public void deleteCompliance(Integer id) {

        Compliance compliance =
                complianceRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Compliance not found with id: " + id
                                )
                        );

        complianceRepository.delete(compliance);
    }
}