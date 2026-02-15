package com.trackmymoney.backend.service;

import com.trackmymoney.backend.dto.CreateUserRequest;
import com.trackmymoney.backend.dto.UserResponse;

public interface UserService {

    UserResponse createUser(CreateUserRequest request);

    UserResponse getUserById(Long id);

    UserResponse getUserByEmail(String email);
    
    Long findIdByEmail(String email);

    void updateName(String email, String newName);

    void changePassword(String email, String oldPassword, String newPassword);

    void resetAccount(String email);
}
