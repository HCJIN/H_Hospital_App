package com.green.H_Hospital_App.location.service;

import com.green.H_Hospital_App.location.util.Haversine; // Haversine 클래스 임포트
import com.green.H_Hospital_App.location.model.Location;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
// LocationServiceImpl.java
public class LocationServiceImpl {
    @Autowired
    private LocationRepository locationRepository;

    // 위치 저장
    public void saveLocation(String deviceId, Long userId, Double latitude, Double longitude) {
        Location newLocation = new Location();
        newLocation.setDeviceId(deviceId); // 디바이스 ID를 위치에 설정
        newLocation.setUserId(userId);
        newLocation.setLatitude(latitude);
        newLocation.setLongitude(longitude);
        locationRepository.save(newLocation);
    }

    // 거리 계산
    public double calculateDistance(Long patientId, Long nurseId) {
        Location patientLocation = locationRepository.findTopByUserIdOrderByIdDesc(patientId);
        Location nurseLocation = locationRepository.findTopByUserIdOrderByIdDesc(nurseId);

        if (patientLocation != null && nurseLocation != null) {
            return Haversine.calculateDistance(
                    patientLocation.getLatitude(),
                    patientLocation.getLongitude(),
                    nurseLocation.getLatitude(),
                    nurseLocation.getLongitude()
            );
        } else {
            return 0.0;
        }
    }
}

