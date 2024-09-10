package com.green.H_Hospital_App.location.service;

import com.green.H_Hospital_App.location.model.Location;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface LocationRepository extends JpaRepository<Location, Long> {
    Optional<Location> findTopByEmailOrderByIdDesc(String email);

    @Query("SELECT l FROM Location l WHERE l.email != :email ORDER BY l.id DESC")
    Optional<Location> findTopByEmailNotOrderByIdDesc(@Param("email") String email);
}