package com.green.H_Hospital_App.location.service;

import com.green.H_Hospital_App.location.util.Haversine;
import com.green.H_Hospital_App.location.model.Location;
import com.green.H_Hospital_App.location.service.LocationRepository;  // Import 추가
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class LocationServiceImpl {

    private static final Logger logger = LoggerFactory.getLogger(LocationServiceImpl.class);

    @Autowired
    private LocationRepository locationRepository;

    // 위치 저장 메서드
    public void saveLocation(Location location) {
        if (location == null || location.getEmail() == null) {
            throw new IllegalArgumentException("Location entity and email must not be null");
        }
        locationRepository.save(location);
        logger.info("Location saved for email: {}", location.getEmail());
    }

    // 위치 업데이트 메서드
    public void updateLocation(Location location) {
        if (location == null || location.getEmail() == null) {
            throw new IllegalArgumentException("Location entity or Email must not be null");
        }

        locationRepository.findTopByEmailOrderByIdDesc(location.getEmail())
                .ifPresentOrElse(
                        existingLocation -> {
                            existingLocation.setLatitude(location.getLatitude());
                            existingLocation.setLongitude(location.getLongitude());
                            locationRepository.save(existingLocation);
                            logger.info("Location updated for email: {}", location.getEmail());
                        },
                        () -> {
                            saveLocation(location);
                            logger.info("New location created for email: {}", location.getEmail());
                        }
                );
    }

    // 거리 계산 메서드
    public double calculateDistanceFromInputLocation(String email, double inputLatitude, double inputLongitude) {
        logger.info("Calculating distance for email: {} with input location: {}, {}", email, inputLatitude, inputLongitude);

        // 이메일로 최근 위치를 조회
        Location currentLocation = locationRepository.findTopByEmailOrderByIdDesc(email)
                .orElseThrow(() -> {
                    logger.error("No location found for email: {}", email);
                    return new IllegalArgumentException("No location found for the given email");
                });

        logger.info("Current location found: {}", currentLocation);

        // 거리 계산
        double distance = Haversine.calculateDistance(
                currentLocation.getLatitude(),
                currentLocation.getLongitude(),
                inputLatitude,
                inputLongitude
        );

        logger.info("Calculated distance: {} km", distance);
        return distance;
    }

    // 특정 이메일을 제외한 최근 위치 조회 메서드
    public Location getRecentLocationExceptEmail(String excludedEmail) {
        return locationRepository.findTopByEmailNotOrderByIdDesc(excludedEmail)
                .orElseThrow(() -> {
                    logger.error("No location found except for email: {}", excludedEmail);
                    return new IllegalArgumentException("No location found for any email except the given email");
                });
    }

    // 이메일로 위치 조회 메서드
    public Location getLocationByEmail(String email) {
        return locationRepository.findTopByEmailOrderByIdDesc(email)
                .orElseThrow(() -> {
                    logger.error("No location found for email: {}", email);
                    return new IllegalArgumentException("No location found for the given email: " + email);
                });
    }
}
