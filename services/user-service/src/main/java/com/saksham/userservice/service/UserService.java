package com.saksham.userservice.service;

import com.saksham.userservice.entity.User;
import com.saksham.userservice.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<User> getUsers() {
        return userRepository.findAll();
    }

    public User saveUser(User user) {
        return userRepository.save(user);
    }

    public User getUserById(Integer id) {
        return userRepository.findById(id)
                .orElse(null);
    }

    public User updateUser(Integer id, User updatedUser) {

        User existingUser =
                userRepository.findById(id)
                        .orElse(null);

        if (existingUser != null) {

            existingUser.setUsername(
                    updatedUser.getUsername());

            existingUser.setEmail(
                    updatedUser.getEmail());

            existingUser.setRole(
                    updatedUser.getRole());

            return userRepository.save(existingUser);
        }

        return null;
    }

    public void deleteUser(Integer id) {
        userRepository.deleteById(id);
    }
}