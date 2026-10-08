package com.saksham.userservice.controller;

import com.saksham.userservice.entity.User;
import com.saksham.userservice.service.UserService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/users")
    public List<User> getUsers() {
        return userService.getUsers();
    }

    @PostMapping("/users")
    public User createUser(
            @Valid @RequestBody User user) {

        return userService.saveUser(user);
    }

    @GetMapping("/users/{id}")
    public User getUserById(
            @PathVariable Integer id) {

        return userService.getUserById(id);
    }

    @PutMapping("/users/{id}")
    public User updateUser(
            @PathVariable Integer id,
            @Valid @RequestBody User user) {

        return userService.updateUser(id, user);
    }

    @DeleteMapping("/users/{id}")
    public String deleteUser(
            @PathVariable Integer id) {

        userService.deleteUser(id);

        return "User deleted successfully";
    }
}