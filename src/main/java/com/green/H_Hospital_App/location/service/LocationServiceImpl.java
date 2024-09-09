package com.green.H_Hospital_App.location.service;

import com.green.H_Hospital_App.location.util.Haversine;
import com.green.H_Hospital_App.location.model.Location;
import com.green.H_Hospital_App.location.service.LocationRepository; // Repository 추가
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class LocationServiceImpl {
    @Autowired
    private LocationRepository locationRepository;

    // 위치 저장
    public void saveLocation(Location location) {
        locationRepository.save(location);
    }

    // 거리 계산
    public double calculateDistance(String patientUserId, String nurseUserId) {
        Location patientLocation = locationRepository.findTopByUserIdOrderByIdDesc(patientUserId);
        Location nurseLocation = locationRepository.findTopByUserIdOrderByIdDesc(nurseUserId);

        if (patientLocation != null && nurseLocation != null) {
            return Haversine.calculateDistance(
                    patientLocation.getLatitude(),
                    patientLocation.getLongitude(),
                    nurseLocation.getLatitude(),
                    nurseLocation.getLongitude()
            );
        } else {
            throw new IllegalArgumentException("Locations for the given user IDs not found.");
        }
    }
}
