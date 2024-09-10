package com.green.H_Hospital_App.location.controller;

import com.green.H_Hospital_App.location.model.Location;
import com.green.H_Hospital_App.location.service.LocationServiceImpl;
import com.green.H_Hospital_App.location.util.Haversine;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/location")
public class LocationController {

    @Autowired
    private LocationServiceImpl locationService;

    @GetMapping("/test")
    public void aaa(){
        System.out.println("거리: " + Haversine.calculateDistance());
    }


    @PostMapping("/save")
    public ResponseEntity<Map<String, Object>> saveLocation(@RequestBody LocationRequest locationRequest) {
        try {
            Location location = locationRequest.getLocation();
            if (location == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Location entity must not be null or empty"));
            }

            String email = location.getEmail();
            if (email == null || email.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Email must not be null or empty"));
            }

            locationService.saveLocation(location);

            double distance = locationService.calculateDistance(email, email);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "위치 정보가 저장되었습니다.");
            response.put("distance", distance);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // 위치 업데이트
    @PostMapping("/updateLocation")
    public ResponseEntity<Map<String, String>> updateLocation(@RequestBody Location location) {
        try {
            locationService.updateLocation(location);
            return ResponseEntity.ok(Map.of("message", "위치 정보가 업데이트되었습니다."));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(500).body(Map.of("message", e.getMessage()));
        }
    }

    public static class LocationRequest {
        private Location location;
        private String email; // userId를 email로 변경

        // getters and setters
        public Location getLocation() {
            return location;
        }

        public void setLocation(Location location) {
            this.location = location;
        }

        public String getEmail() {
            return email; // userId를 email로 변경
        }

        public void setEmail(String email) {
            this.email = email; // userId를 email로 변경
        }
    }
}
