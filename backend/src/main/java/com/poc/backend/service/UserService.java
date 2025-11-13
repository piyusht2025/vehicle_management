package com.poc.backend.service;

import com.poc.backend.dto.user.UserResponse;
import com.poc.backend.dto.user.UserRequestDto;
import com.poc.backend.entity.User;
import com.poc.backend.exception.ResourceNotFoundException;
import com.poc.backend.mapper.UserMapper;
import com.poc.backend.repository.RoleRepo;
import com.poc.backend.repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class  UserService {
    @Autowired
    UserRepo userRepo;
    @Autowired
    UserMapper userMapper;
    public UserResponse registerUser(UserRequestDto userRequestDto) {
        User user= userMapper.toEntity(userRequestDto);
        user=userRepo.save(user);
        return userMapper.toDto(user);
    }
    public UserResponse getUserById(Long id){
        User user = userRepo.findById(id).orElseThrow(()-> new ResourceNotFoundException("User not found with id: " + id));
        return userMapper.toDto(user);

    }
    public List<UserResponse> getAllUsers(){
        List<User> user = userRepo.findAll();
        List<UserResponse> users= user.stream().map(userMapper::toDto).collect(Collectors.toList());
        return users;

    }

}






















