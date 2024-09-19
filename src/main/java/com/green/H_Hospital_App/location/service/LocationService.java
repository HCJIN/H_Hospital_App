package com.green.H_Hospital_App.location.service;

import com.green.H_Hospital_App.location.model.LocationVO;

import java.util.List;

public interface LocationService {
    void updateLocation(LocationVO locationVO);
    List<LocationVO> getAllUserLocations();
    void sendNotification(String targetDeviceId, String senderDeviceId, String message);
}
