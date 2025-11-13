package com.poc.backend.dto.user;

import lombok.Data;

@Data
public class UserRequestDto {
    private String name;
    private String email;
    private String phone;
    private String password;
    private String licenseNo;
    private String role;

}
