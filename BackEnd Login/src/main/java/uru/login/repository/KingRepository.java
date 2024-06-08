package uru.login.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import uru.login.entity.King;

public interface KingRepository extends MongoRepository<King, String> {
    King findByTitle(String title);
}
