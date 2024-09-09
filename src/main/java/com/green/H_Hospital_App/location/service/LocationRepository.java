package com.green.H_Hospital_App.location.service;

import com.green.H_Hospital_App.location.model.Location;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LocationRepository extends JpaRepository<Location, Long> {
    // 최근의 위치 정보를 가져오기 위한 메서드
    Location findTopByUserIdOrderByIdDesc(Long userId);
}
