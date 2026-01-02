package com.onlineshopping.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.onlineshopping.dao.AddressDao;
import com.onlineshopping.dao.UserDao;
import com.onlineshopping.dto.AddUserRequest;
import com.onlineshopping.dto.UserLoginRequest;
import com.onlineshopping.model.Address;
import com.onlineshopping.model.User;

@RestController
@RequestMapping("api/user")
@CrossOrigin(origins = "http://localhost:5173") // match frontend origin
public class UserController {

    @Autowired
    private UserDao userDao;

    @Autowired
    private AddressDao addressDao;

    @PostMapping("register")
    public ResponseEntity<?> registerUser(@RequestBody AddUserRequest userRequest) {
        System.out.println("Received register request: " + userRequest);

        Address address = new Address();
        address.setCity(userRequest.getCity());
        address.setPincode(userRequest.getPincode());
        address.setStreet(userRequest.getStreet());
        Address savedAddress = addressDao.save(address);

        User user = new User();
        user.setAddress(savedAddress);
        user.setEmailId(userRequest.getEmailId());
        user.setFirstName(userRequest.getFirstName());
        user.setLastName(userRequest.getLastName());
        user.setPhoneNo(userRequest.getPhoneNo());
        user.setPassword(userRequest.getPassword());
        user.setRole(userRequest.getRole());
        User savedUser = userDao.save(user);

        System.out.println("User registered: " + savedUser);
        return ResponseEntity.ok(savedUser);
    }

    @PostMapping("login")
    public ResponseEntity<?> loginUser(@RequestBody UserLoginRequest loginRequest) {
        System.out.println("Received login request: " + loginRequest);

        User user = userDao.findByEmailIdAndPasswordAndRole(
            loginRequest.getEmailId(),
            loginRequest.getPassword(),
            loginRequest.getRole()
        );

        if (user == null) return ResponseEntity.badRequest().body("Invalid credentials!");
        return ResponseEntity.ok(user);
    }
}
