package uru.login.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import uru.login.entity.King;
import uru.login.repository.KingRepository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class CourtierService {
    @Autowired
    private KingRepository kingRepository;

    public List<King.Courtier> getAllCourtiers(String kingId) {
        Optional<King> optionalKing = kingRepository.findById(kingId);
        return optionalKing.map(King::getCourtiers).orElse(null);
    }

    public King addCourtier(String kingId, King.Courtier courtier) {
        Optional<King> optionalKing = kingRepository.findById(kingId);
        if (optionalKing.isPresent()) {
            King king = optionalKing.get();
            if (king.getCourtiers() == null) {
                king.setCourtiers(new ArrayList<>());
            }
            king.getCourtiers().add(courtier);
            return kingRepository.save(king);
        }
        return null;
    }

    public King updateCourtier(String kingId, String courtierName, King.Courtier updatedCourtier) {
        Optional<King> optionalKing = kingRepository.findById(kingId);
        if (optionalKing.isPresent()) {
            King king = optionalKing.get();
            List<King.Courtier> courtiers = king.getCourtiers();
            if (courtiers != null) {
                for (int i = 0; i < courtiers.size(); i++) {
                    if (courtiers.get(i).getName().equals(courtierName)) {
                        courtiers.set(i, updatedCourtier);
                        break;
                    }
                }
                return kingRepository.save(king);
            }
        }
        return null;
    }

    public King removeCourtier(String kingId, String courtierName) {
        Optional<King> optionalKing = kingRepository.findById(kingId);
        if (optionalKing.isPresent()) {
            King king = optionalKing.get();
            List<King.Courtier> courtiers = king.getCourtiers();
            if (courtiers != null) {
                courtiers.removeIf(courtier -> courtier.getName().equals(courtierName));
                return kingRepository.save(king);
            }
        }
        return null;
    }
}
