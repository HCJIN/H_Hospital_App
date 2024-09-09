package com.green.H_Hospital_App.location.service;

import com.green.H_Hospital_App.location.model.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PatientRepository extends JpaRepository<Patient, Long> {
    // 필요한 메서드 추가 (예: 특정 환자 조회)
}
