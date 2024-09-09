package com.green.H_Hospital_App.location.service;

import com.green.H_Hospital_App.location.model.Location;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LocationRepository extends JpaRepository<Location, Long> {
    // userId가 String 타입일 경우
    Location findTopByUserIdOrderByIdDesc(String userId);
}
