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

            Location location = locationRequest.getLocation();
            String targetEmail = locationRequest.getTargetEmail();

            locationService.saveLocation(location);

            // Calculate the distance and retrieve target location
            double distance = locationService.calculateDistanceFromInputLocation(targetEmail, location.getLatitude(), location.getLongitude());
            Location targetLocation = locationService.getLocationByEmail(targetEmail);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "위치 정보가 저장되었습니다.");
            response.put("distance", distance);
            if (targetLocation != null) {
                response.put("targetLocation", targetLocation);
            } else {
                response.put("targetLocation", "Target location not found");
            }

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

            locationService.updateLocation(location);

            double distance = locationService.calculateDistanceFromInputLocation(location.getEmail(), inputLatitude, inputLongitude);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "위치 정보가 업데이트되었습니다.");
            response.put("distance", distance);

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

    @GetMapping("/get")
    public ResponseEntity<Map<String, Object>> getLocation() {
        try {
            // 예제용으로 임시 데이터 생성
            Map<String, Object> response = new HashMap<>();
            response.put("message", "위치 정보를 가져왔습니다.");
            response.put("location", "예제 데이터");

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Server error in getLocation: ", e);
            return ResponseEntity.internalServerError().body(Map.of("error", "서버 오류가 발생했습니다."));
        }
    }

    public static class LocationRequest {
        private Location location;
        private String targetEmail;

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

    public static class LocationUpdateRequest {
        private Location location;
        private double inputLatitude;
        private double inputLongitude;

        public LocationUpdateRequest() {}

        public LocationUpdateRequest(Location location, double inputLatitude, double inputLongitude) {
            this.location = location;
            this.inputLatitude = inputLatitude;
            this.inputLongitude = inputLongitude;
        }

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
