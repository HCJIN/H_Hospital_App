package com.green.H_Hospital_App.location.service;

import com.green.H_Hospital_App.location.util.Haversine; // Haversine 클래스 임포트
import com.green.H_Hospital_App.location.model.Location;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class LocationServiceImpl {

    @Autowired
    private LocationRepository locationRepository;

    // 위치 저장
    public void saveLocation(Long userId, Double latitude, Double longitude) {
        Location newLocation = new Location();
        newLocation.setUserId(userId); // 사용자 ID를 위치에 설정
        newLocation.setLatitude(latitude);
        newLocation.setLongitude(longitude);
        locationRepository.save(newLocation);
    }

    // 환자와 간호사 간의 거리 계산
    public double calculateDistance(Long patientId, Long nurseId) {
        // 환자의 최신 위치 정보 가져오기
        Location patientLocation = locationRepository.findTopByUserIdOrderByIdDesc(patientId);
        // 간호사의 최신 위치 정보 가져오기
        Location nurseLocation = locationRepository.findTopByUserIdOrderByIdDesc(nurseId);

        if (patientLocation != null && nurseLocation != null) {
            // 거리 계산
            return Haversine.calculateDistance(
                    patientLocation.getLatitude(),
                    patientLocation.getLongitude(),
                    nurseLocation.getLatitude(),
                    nurseLocation.getLongitude()
            );
        } else {
            // 위치 정보가 없는 경우
            return 0.0;
        }
    }
}
