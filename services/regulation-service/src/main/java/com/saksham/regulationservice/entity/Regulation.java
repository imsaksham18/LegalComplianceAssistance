package com.saksham.regulationservice.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;

@Entity
@Table(name = "regulations")
public class Regulation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @NotBlank(message = "Regulation name cannot be empty")
    private String regulationName;

    @NotBlank(message = "Country cannot be empty")
    private String country;

    @NotBlank(message = "Description cannot be empty")
    private String description;

    public Regulation() {
    }

    public Regulation(Integer id,
                      String regulationName,
                      String country,
                      String description) {
        this.id = id;
        this.regulationName = regulationName;
        this.country = country;
        this.description = description;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getRegulationName() {
        return regulationName;
    }

    public void setRegulationName(String regulationName) {
        this.regulationName = regulationName;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}