// LocationRepository.java
package com.green.H_Hospital_App.location.service;

import com.green.H_Hospital_App.location.model.Location;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface LocationRepository extends JpaRepository<Location, Long> {

    Optional<Location> findTopByEmailOrderByIdDesc(String email);

    List<Location> findAllByOrderByIdDesc();

}
