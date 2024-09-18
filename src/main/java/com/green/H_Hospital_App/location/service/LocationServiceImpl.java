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
}
