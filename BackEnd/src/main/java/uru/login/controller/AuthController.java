package uru.login.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import uru.login.entity.King;
import uru.login.service.AuthService;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE})
public class AuthController {
    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public King registerKing(@RequestBody King king) {
        return authService.registerKing(king);
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticateKing(@RequestBody King king) {
        King authenticatedKing = authService.authenticateKing(king.getTitle(), king.getPassword());
        if (authenticatedKing != null) {
            return ResponseEntity.ok(authenticatedKing);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid title or password");
        }
    }
}
