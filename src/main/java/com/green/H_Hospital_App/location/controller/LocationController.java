package com.green.H_Hospital_App.location.controller;

import com.green.H_Hospital_App.location.service.LocationServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/location")
public class LocationController {

    @Autowired
    private LocationServiceImpl locationService;

    // 위치 정보 저장
    @PostMapping("/save")
    public String saveLocation(@RequestBody LocationRequest locationRequest) {
        // 위치 저장
        locationService.saveLocation(
                locationRequest.getDeviceId(), // 디바이스 ID 추가
                locationRequest.getUserId(),
                locationRequest.getLatitude(),
                locationRequest.getLongitude()
        );
        return "위치 정보가 저장되었습니다.";
    }

    // 환자와 간호사 간의 거리 계산
    @GetMapping("/distance")
    public String calculateDistance(
            @RequestParam Long patientId,
            @RequestParam Long nurseId) {
        double distance = locationService.calculateDistance(patientId, nurseId);
        return "환자와 간호사 간의 거리: " + distance + " km";
    }
}

class LocationRequest {
    private String deviceId; // 디바이스 ID 추가
    private Long userId;
    private Double latitude;
    private Double longitude;

    public String getDeviceId() {
        return deviceId;
    }

    public void setDeviceId(String deviceId) {
        this.deviceId = deviceId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }
}
