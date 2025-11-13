package com.poc.backend.dto.user;

import lombok.Data;

@Data
public class UserResponse {
    private Long id;
    private String name;
    private String email;
    private String phone;
    private String role;
    public String licenseNo;
    private Boolean active;
}
