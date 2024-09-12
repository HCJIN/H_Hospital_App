package com.green.H_Hospital_App.location.controller;

import com.green.H_Hospital_App.location.model.Location;
import com.green.H_Hospital_App.location.service.LocationServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/location")
public class LocationController {

    @Autowired
    private LocationServiceImpl locationService;

    // 위치 정보 저장
    @PostMapping("/save")
    public ResponseEntity<String> saveLocation(@RequestBody Location location) {
        try {
            locationService.saveLocation(location);
            return ResponseEntity.ok("위치 정보가 저장되었습니다.");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("위치 정보 저장에 실패했습니다.");
        }
    }

    // 특정 사용자의 최신 위치 정보 가져오기
    @GetMapping("/latest/{email}")
    public ResponseEntity<Location> getLatestLocation(@PathVariable String email) {
        Optional<Location> location = locationService.getLatestLocation(email);
        if (location.isPresent()) {
            return ResponseEntity.ok(location.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // 모든 사용자 위치 정보 가져오기
    @GetMapping("/all")
    public ResponseEntity<List<Location>> getAllLocations() {
        List<Location> locations = locationService.getAllLocations();
        return ResponseEntity.ok(locations);
    }


}
