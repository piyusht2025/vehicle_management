package com.poc.backend.dto.user;

import lombok.Data;

@Data
public class UserResponse {
    public String licenseNo;
    private Long id;
    private String name;
    private String email;
    private String phone;
    private String role;
    private Boolean active;
}
