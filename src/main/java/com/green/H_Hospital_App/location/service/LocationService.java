package com.green.H_Hospital_App.location.service;

import com.green.H_Hospital_App.location.model.LocationVO;
import org.springframework.stereotype.Repository;

import java.util.List;

public interface LocationService {
    void updateLocation(LocationVO locationVO);
    List<LocationVO> getAllUserLocations();
}
