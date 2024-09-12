package com.green.H_Hospital_App.location.service;

import com.green.H_Hospital_App.location.model.Location;
import com.green.H_Hospital_App.location.service.LocationRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class LocationServiceImpl {

    private static final Logger logger = LoggerFactory.getLogger(LocationServiceImpl.class);

    @Autowired
    private LocationRepository locationRepository;

    // 위치 정보 저장
    public void saveLocation(Location location) {
        if (location == null || location.getEmail() == null) {
            throw new IllegalArgumentException("Location entity and email must not be null");
        }
        locationRepository.save(location);
        logger.info("Location saved for email: {}", location.getEmail());
    }

    // 특정 사용자의 최신 위치 정보 가져오기
    public Optional<Location> getLatestLocation(String email) {
        return locationRepository.findTopByEmailOrderByIdDesc(email);
    }

    // 모든 사용자 위치 정보 가져오기
    public List<Location> getAllLocations() {
        return locationRepository.findAllByOrderByIdDesc();
    }

}
