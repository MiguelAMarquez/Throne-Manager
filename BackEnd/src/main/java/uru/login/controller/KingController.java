package uru.login.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import uru.login.entity.King;
import uru.login.service.KingService;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/kings")
@CrossOrigin(origins = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE})
public class KingController {
    @Autowired
    private KingService kingService;

    @GetMapping
    public List<King> getAllKings() {
        return kingService.getAllKings();
    }

    @GetMapping("/{id}")
    public Optional<King> getKingById(@PathVariable String id) {
        return kingService.getKingById(id);
    }

    @PutMapping("/{id}")
    public King updateKing(@PathVariable String id, @RequestBody King kingDetails) {
        return kingService.updateKing(id, kingDetails);
    }

    @DeleteMapping("/{id}")
    public String deleteKing(@PathVariable String id) {
        kingService.deleteKing(id);
        return "King removed from the throne.";
    }
}
