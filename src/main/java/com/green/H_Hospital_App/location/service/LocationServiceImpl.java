package com.green.H_Hospital_App.location.service;

import com.green.H_Hospital_App.location.util.Haversine;
import com.green.H_Hospital_App.location.model.Location;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class LocationServiceImpl {

    @Autowired
    private LocationRepository locationRepository;

    // 위치 저장
    public void saveLocation(Location location) {
        if (location == null) {
            throw new IllegalArgumentException("Location entity must not be null");
        }
        locationRepository.save(location);
    }

    // 위치 업데이트
    public void updateLocation(Location location) {
        if (location == null || location.getUserId() == null) {
            throw new IllegalArgumentException("Location entity or User ID must not be null");
        }

        Location existingLocation = locationRepository.findTopByUserIdOrderByIdDesc(location.getUserId());
        if (existingLocation != null) {
            existingLocation.setLatitude(location.getLatitude());
            existingLocation.setLongitude(location.getLongitude());
            locationRepository.save(existingLocation);
        } else {
            // 위치가 존재하지 않으면 새로운 위치 저장
            saveLocation(location);
        }
    }

    // 거리 계산
    public double calculateDistance(String patientUserId, String nurseUserId) {
        if (patientUserId == null || nurseUserId == null) {
            throw new IllegalArgumentException("User IDs must not be null");
        }

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
