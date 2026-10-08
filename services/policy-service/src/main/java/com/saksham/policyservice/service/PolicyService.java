package com.saksham.policyservice.service;

import com.saksham.policyservice.dto.PolicyResponseDTO;
import com.saksham.policyservice.entity.Policy;
import com.saksham.policyservice.exception.ResourceNotFoundException;
import com.saksham.policyservice.repository.PolicyRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PolicyService {

    private final PolicyRepository policyRepository;

    public PolicyService(PolicyRepository policyRepository) {
        this.policyRepository = policyRepository;
    }

    public List<Policy> getPolicies() {
        return policyRepository.findAll();
    }

    public Policy savePolicy(Policy policy) {
        return policyRepository.save(policy);
    }

    public Policy getPolicyById(Integer id) {

        return policyRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Policy not found with id: " + id
                        )
                );
    }

    public Policy updatePolicy(Integer id, Policy updatedPolicy) {

        Policy existingPolicy = policyRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Policy not found with id: " + id
                        )
                );

        existingPolicy.setTitle(updatedPolicy.getTitle());
        existingPolicy.setDescription(updatedPolicy.getDescription());

        return policyRepository.save(existingPolicy);
    }

    public void deletePolicy(Integer id) {

        Policy policy = policyRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Policy not found with id: " + id
                        )
                );

        policyRepository.delete(policy);
    }

    public PolicyResponseDTO getPolicyDtoById(Integer id) {

        Policy policy = getPolicyById(id);

        return new PolicyResponseDTO(
                policy.getId(),
                policy.getTitle(),
                policy.getDescription()
        );
    }
}