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

    // 디바이스 아이디를 키로 사용하여 LocationVO를 저장할 Map
    private final Map<String, LocationVO> locationMap = new ConcurrentHashMap<>();

    @Override
    public void updateLocation(LocationVO locationVO) {
        // 위치 정보 업데이트
        locationMap.put(locationVO.getDeviceId(), locationVO);
    }

    @Override
    public List<LocationVO> getAllUserLocations() {
        List<LocationVO> locations = new ArrayList<>(locationMap.values());
        log.info("Fetched all user locations: {}", locations);
        return locations;
    }

    @Override
    public void sendNotification(String targetDeviceId, String senderDeviceId) {
        // 여기에 실제 알림 전송 로직을 구현해야 합니다.
        // 예를 들어, FCM (Firebase Cloud Messaging)을 사용하거나
        // 웹소켓을 통해 실시간 알림을 전송할 수 있습니다.
        log.info("Sending notification from device {} to device {}", senderDeviceId, targetDeviceId);

        // 임시로 로그만 출력하는 예시:
        LocationVO targetLocation = locationMap.get(targetDeviceId);
        if (targetLocation != null) {
            log.info("Notification sent to device {} at location ({}, {})",
                    targetDeviceId, targetLocation.getLatitude(), targetLocation.getLongitude());
        } else {
            log.warn("Target device {} not found in location map", targetDeviceId);
        }
    }
}