package com.saksham.regulationservice.service;

import com.saksham.regulationservice.entity.Regulation;
import com.saksham.regulationservice.exception.ResourceNotFoundException;
import com.saksham.regulationservice.repository.RegulationRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RegulationService {

    private final RegulationRepository regulationRepository;

    public RegulationService(RegulationRepository regulationRepository) {
        this.regulationRepository = regulationRepository;
    }

    public List<Regulation> getRegulations() {
        return regulationRepository.findAll();
    }

    public Regulation saveRegulation(Regulation regulation) {
        return regulationRepository.save(regulation);
    }

    public Regulation getRegulationById(Integer id) {
        return regulationRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Regulation not found with id: " + id
                        )
                );
    }

    public Regulation updateRegulation(
            Integer id,
            Regulation updatedRegulation) {

        Regulation existingRegulation =
                regulationRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Regulation not found with id: " + id
                                )
                        );

        existingRegulation.setRegulationName(
                updatedRegulation.getRegulationName());

        existingRegulation.setCountry(
                updatedRegulation.getCountry());

        existingRegulation.setDescription(
                updatedRegulation.getDescription());

        return regulationRepository.save(existingRegulation);
    }

    public void deleteRegulation(Integer id) {

        Regulation regulation =
                regulationRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Regulation not found with id: " + id
                                )
                        );

        regulationRepository.delete(regulation);
    }
}