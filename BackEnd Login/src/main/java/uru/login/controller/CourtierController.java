package uru.login.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import uru.login.entity.King;
import uru.login.service.CourtierService;

import java.util.List;

@RestController
@RequestMapping("/api/kings/{kingId}/courtiers")
@CrossOrigin(origins = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE})
public class CourtierController {
    @Autowired
    private CourtierService courtierService;

    @GetMapping
    public List<King.Courtier> getAllCourtiers(@PathVariable String kingId) {
        return courtierService.getAllCourtiers(kingId);
    }

    @PostMapping
    public King addCourtier(@PathVariable String kingId, @RequestBody King.Courtier courtier) {
        return courtierService.addCourtier(kingId, courtier);
    }

    @PutMapping("/{courtierName}")
    public King updateCourtier(@PathVariable String kingId, @PathVariable String courtierName, @RequestBody King.Courtier updatedCourtier) {
        return courtierService.updateCourtier(kingId, courtierName, updatedCourtier);
    }

    @DeleteMapping("/{courtierName}")
    public King removeCourtier(@PathVariable String kingId, @PathVariable String courtierName) {
        return courtierService.removeCourtier(kingId, courtierName);
    }
}
