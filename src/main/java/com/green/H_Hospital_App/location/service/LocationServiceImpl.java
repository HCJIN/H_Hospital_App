package com.green.H_Hospital_App.location.service;

import com.green.H_Hospital_App.location.model.LocationVO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Slf4j
@Service("locationService")
public class LocationServiceImpl implements LocationService {

    private final Map<String, LocationVO> locationMap = new ConcurrentHashMap<>();

    @Override
    public void updateLocation(LocationVO locationVO) {
        locationMap.put(locationVO.getDeviceId(), locationVO);
    }

    @Override
    public List<LocationVO> getAllUserLocations() {
        List<LocationVO> locations = new ArrayList<>(locationMap.values());
        log.info("Fetched all user locations: {}", locations);
        return locations;
    }

    @Override
    public void sendNotification(String targetDeviceId, String senderDeviceId, String message) {
        log.info("Sending notification from device {} to device {}: {}", senderDeviceId, targetDeviceId, message);

        // 실제 알림 전송 로직 구현
        LocationVO targetLocation = locationMap.get(targetDeviceId);
        if (targetLocation != null) {
            log.info("Notification sent to device {}: {}", targetDeviceId, message);
        } else {
            log.warn("Target device {} not found in location map", targetDeviceId);
        }
    }
}
