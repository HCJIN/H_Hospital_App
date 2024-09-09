package com.green.H_Hospital_App.location.service;

import com.green.H_Hospital_App.location.model.Nurse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NurseRepository extends JpaRepository<Nurse, Long> {
    // 예: 특정 간호사 ID로 간호사 조회
}
