package com.green.H_Hospital_App.location.controller;

import com.green.H_Hospital_App.location.model.Location;
import com.green.H_Hospital_App.location.service.LocationServiceImpl;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/location")
public class LocationController {

    private static final Logger logger = LoggerFactory.getLogger(LocationController.class);

    @Autowired
    private LocationServiceImpl locationService;

    @PostMapping("/save")
    public ResponseEntity<Map<String, Object>> saveLocation(@RequestBody LocationRequest locationRequest) {
        logger.info("Received LocationRequest: {}", locationRequest);

        try {
            if (locationRequest.getLocation() == null ||
                    locationRequest.getLocation().getDeviceId() == null ||
                    locationRequest.getLocation().getDeviceId().isEmpty() ||
                    locationRequest.getLocation().getEmail() == null ||
                    locationRequest.getLocation().getEmail().isEmpty()) {
                throw new IllegalArgumentException("Location entity and email must not be null or empty");
            }

            // 필드 가져오기
            Location location = locationRequest.getLocation();
            String targetEmail = locationRequest.getTargetEmail();

            // 위치 정보 저장
            locationService.saveLocation(location);

            // 거리 계산
            double distance = locationService.calculateDistanceFromInputLocation(targetEmail, location.getLatitude(), location.getLongitude());

            // 응답 데이터 생성
            Map<String, Object> response = new HashMap<>();
            response.put("message", "위치 정보가 저장되었습니다.");
            response.put("distance", distance);

            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            logger.error("Bad request in saveLocation: ", e);
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            logger.error("Server error in saveLocation: ", e);
            return ResponseEntity.internalServerError().body(Map.of("error", "서버 오류가 발생했습니다."));
        }
    }

    @PostMapping("/updateLocation")
    public ResponseEntity<Map<String, Object>> updateLocation(@RequestBody LocationUpdateRequest updateRequest) {
        try {
            Location location = updateRequest.getLocation();
            double inputLatitude = updateRequest.getInputLatitude();
            double inputLongitude = updateRequest.getInputLongitude();

            // 위치 정보 업데이트
            locationService.updateLocation(location);

            // 거리 계산
            double distance = locationService.calculateDistanceFromInputLocation(location.getEmail(), inputLatitude, inputLongitude);

            // 응답 데이터 생성
            Map<String, Object> response = new HashMap<>();
            response.put("message", "위치 정보가 업데이트되었습니다.");
            response.put("distance", distance);

            // 로그 기록
            logger.info("Location updated for email: {}, Latitude: {}, Longitude: {}", location.getEmail(), location.getLatitude(), location.getLongitude());

            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            logger.error("Bad request in updateLocation: ", e);
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            logger.error("Server error in updateLocation: ", e);
            return ResponseEntity.internalServerError().body(Map.of("error", "서버 오류가 발생했습니다."));
        }
    }

    // -- 여기를 static으로 수정
    public static class LocationRequest {
        private Location location;
        private String targetEmail;

        // Getters and setters
        public Location getLocation() {
            return location;
        }

        public void setLocation(Location location) {
            this.location = location;
        }

        public String getTargetEmail() {
            return targetEmail;
        }

        public void setTargetEmail(String targetEmail) {
            this.targetEmail = targetEmail;
        }
    }

    // 이 클래스는 static으로 선언되어 있음
    public static class LocationUpdateRequest {
        private Location location;
        private double inputLatitude;
        private double inputLongitude;

        // 기본 생성자
        public LocationUpdateRequest() {}

        // 매개변수를 받는 생성자
        public LocationUpdateRequest(Location location, double inputLatitude, double inputLongitude) {
            this.location = location;
            this.inputLatitude = inputLatitude;
            this.inputLongitude = inputLongitude;
        }

        // Getter 및 Setter
        public Location getLocation() {
            return location;
        }

        public void setLocation(Location location) {
            this.location = location;
        }

        public double getInputLatitude() {
            return inputLatitude;
        }

        public void setInputLatitude(double inputLatitude) {
            this.inputLatitude = inputLatitude;
        }

        public double getInputLongitude() {
            return inputLongitude;
        }

        public void setInputLongitude(double inputLongitude) {
            this.inputLongitude = inputLongitude;
        }
    }

}
