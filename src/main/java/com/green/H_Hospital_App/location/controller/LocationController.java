package com.green.H_Hospital_App.location.controller;

import com.green.H_Hospital_App.location.model.Location;
import com.green.H_Hospital_App.location.service.LocationServiceImpl;
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

    // 위치 정보 저장
    @PostMapping("/save")
    public ResponseEntity<Map<String, Object>> saveLocation(@RequestBody LocationRequest locationRequest) {
        try {
            Location location = locationRequest.getLocation();
            locationService.saveLocation(location);

            String userId = locationRequest.getUserId();
            double distance = -1; // 기본값

            // 거리 계산은 선택적 작업으로 처리
            if (locationRequest.getUserId() != null && location.getUserId() != null) {
                distance = locationService.calculateDistance(location.getUserId(), userId);
            }

            Map<String, Object> response = new HashMap<>();
            response.put("message", "위치 정보가 저장되었습니다.");
            response.put("distance", distance);

            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(500).body(Map.of("message", e.getMessage()));
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
        private String userId;

        // getters and setters
        public Location getLocation() {
            return location;
        }

        public void setLocation(Location location) {
            this.location = location;
        }

        public String getUserId() {
            return userId;
        }

        public void setUserId(String userId) {
            this.userId = userId;
        }
    }
}
