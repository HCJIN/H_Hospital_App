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
    public ResponseEntity<Map<String, Object>> saveLocation(@RequestBody Location location) {
        locationService.saveLocation(location);

        // 거리 계산을 위해서 예시로 간호사와 환자의 ID를 하드코딩
        // 실제로는 이 부분을 조정하여 동적으로 값을 가져오거나 클라이언트에서 전달받을 수 있도록 해야 함
        String nurseUserId = "nurseUserId"; // 예시 ID, 실제로는 적절한 값을 사용해야 함
        double distance = locationService.calculateDistance(location.getUserId(), nurseUserId);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "위치 정보가 저장되었습니다.");
        response.put("distance", distance);

        return ResponseEntity.ok(response);
    }

    // 환자와 간호사 간의 거리 계산
    @GetMapping("/distance")
    public String calculateDistance(
            @RequestParam String patientUserId,
            @RequestParam String nurseUserId) {
        double distance = locationService.calculateDistance(patientUserId, nurseUserId);
        return "환자와 간호사 간의 거리: " + distance + " km";
    }

    // 위치 업데이트
    @PostMapping("/updateLocation")
    public void updateLocation(@RequestBody Location location) {
        locationService.saveLocation(location);
    }
}
