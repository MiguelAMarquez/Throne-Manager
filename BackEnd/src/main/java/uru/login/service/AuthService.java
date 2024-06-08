package uru.login.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import uru.login.entity.King;
import uru.login.repository.KingRepository;

@Service
public class AuthService {
    @Autowired
    private KingRepository kingRepository;

    public King registerKing(King king) {
        return kingRepository.save(king);
    }

    public King authenticateKing(String title, String password) {
        King king = kingRepository.findByTitle(title);
        if (king != null && king.getPassword().equals(password)) {
            return king;
        }
        return null;
    }
}
