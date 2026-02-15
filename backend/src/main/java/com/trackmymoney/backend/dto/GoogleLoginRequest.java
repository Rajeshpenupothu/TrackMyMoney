package com.trackmymoney.backend.dto;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class GoogleLoginRequest {
    @NotBlank(message = "Token is required")
    private String token;
}
