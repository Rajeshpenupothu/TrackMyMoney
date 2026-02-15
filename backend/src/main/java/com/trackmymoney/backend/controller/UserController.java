package com.trackmymoney.backend.controller;

import com.trackmymoney.backend.dto.UpdateNameRequest;
import com.trackmymoney.backend.dto.UpdatePasswordRequest;
import com.trackmymoney.backend.dto.UserResponse;
import com.trackmymoney.backend.service.UserService;
import java.security.Principal;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import org.springframework.validation.annotation.Validated;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@Validated
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping
    public ResponseEntity<UserResponse> createUser(
            @Valid @RequestBody com.trackmymoney.backend.dto.CreateUserRequest request) {

        return new ResponseEntity<>(
                userService.createUser(request),
                HttpStatus.CREATED
        );
    }

    @GetMapping("/{id}")
        public ResponseEntity<UserResponse> getUserById(
            @PathVariable @Positive(message = "Id must be a positive number") Long id) {

        return ResponseEntity.ok(userService.getUserById(id));
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<UserResponse> getUserByEmail(
            @PathVariable @NotBlank(message = "Email is required") @Email(message = "Invalid email format") String email) {

        return ResponseEntity.ok(userService.getUserByEmail(email));
    }

    @PutMapping("/profile/name")
    public ResponseEntity<Void> updateName(Principal principal, @Valid @RequestBody UpdateNameRequest request) {
        userService.updateName(principal.getName(), request.getName());
        return ResponseEntity.ok().build();
    }

    @PutMapping("/profile/password")
    public ResponseEntity<Void> changePassword(Principal principal, @Valid @RequestBody UpdatePasswordRequest request) {
        userService.changePassword(principal.getName(), request.getOldPassword(), request.getNewPassword());
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/reset")
    public ResponseEntity<Void> resetAccount(java.security.Principal principal) {
        userService.resetAccount(principal.getName());
        return ResponseEntity.noContent().build();
    }
}
