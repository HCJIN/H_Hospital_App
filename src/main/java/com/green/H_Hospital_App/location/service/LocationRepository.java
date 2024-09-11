package com.green.H_Hospital_App.location.service;

import com.green.H_Hospital_App.location.model.Location;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface LocationRepository extends JpaRepository<Location, Long> {

    // 이메일로 가장 최근의 위치를 가져오는 메서드
    Optional<Location> findTopByEmailOrderByIdDesc(String email);

    // 특정 이메일을 제외한 가장 최근의 위치를 가져오는 메서드
    @Query("SELECT l FROM Location l WHERE l.email != :email ORDER BY l.id DESC")
    Optional<Location> findTopByEmailNotOrderByIdDesc(@Param("email") String email);

    // 특정 이메일과 가장 최근의 위치를 가져오는 메서드 추가
    @Query("SELECT l FROM Location l WHERE l.email = :email ORDER BY l.id DESC")
    Optional<Location> findLatestLocationByEmail(@Param("email") String email);
}
