package com.saksham.userservice.repository;

import com.saksham.userservice.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository
        extends JpaRepository<User, Integer> {
}