package uru.login.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import uru.login.entity.King;
import uru.login.repository.KingRepository;

import java.util.List;
import java.util.Optional;

@Service
public class KingService {
    @Autowired
    private KingRepository kingRepository;

    public List<King> getAllKings() {
        return kingRepository.findAll();
    }

    public Optional<King> getKingById(String id) {
        return kingRepository.findById(id);
    }

    public King updateKing(String id, King kingDetails) {
        Optional<King> optionalKing = kingRepository.findById(id);
        if (optionalKing.isPresent()) {
            King king = optionalKing.get();
            king.setTitle(kingDetails.getTitle());
            king.setName(kingDetails.getName());
            king.setLastname(kingDetails.getLastname());
            king.setHorn(kingDetails.getHorn());
            king.setScroll(kingDetails.getScroll());
            king.setCourtiers(kingDetails.getCourtiers());
            king.setCourts(kingDetails.getCourts());
            return kingRepository.save(king);
        }
        return null;
    }

    public void deleteKing(String id) {
        kingRepository.deleteById(id);
    }
}
