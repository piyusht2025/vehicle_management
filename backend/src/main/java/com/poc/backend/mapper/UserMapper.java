package com.poc.backend.mapper;

import com.poc.backend.dto.user.UserRequestDto;
import com.poc.backend.dto.user.UserResponse;
import com.poc.backend.entity.Role;
import com.poc.backend.entity.User;
import com.poc.backend.exception.ResourceNotFoundException;
import com.poc.backend.repository.RoleRepo;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {
    @Autowired
    private ModelMapper modelMapper;
    @Autowired
    private RoleRepo roleRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public UserResponse toDto(User user) {
        UserResponse userResponse = modelMapper.map(user, UserResponse.class);
        userResponse.setRole(user.getRole().getName());
        return userResponse;
    }

    public User toEntity(UserRequestDto userRequestDto) {
        User user = modelMapper.map(userRequestDto, User.class);

        Role role = roleRepo.findByName(userRequestDto.getRole().toUpperCase())
                .orElseThrow(() -> new ResourceNotFoundException("Invalid Role " + userRequestDto.getRole()));

        user.setRole(role);

        user.setPassword(passwordEncoder.encode(userRequestDto.getPassword()));
        return user;

    }
}
