package com.green.H_Hospital_App.location.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Location {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId; // 사용자 ID를 추가
    private Double latitude;
    private Double longitude;

    // 기본 생성자
    public Location() {}

    // 매개변수를 받는 생성자
    public Location(Long userId, Double latitude, Double longitude) {
        this.userId = userId;
        this.latitude = latitude;
        this.longitude = longitude;
    }

    // Getter 및 Setter
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }
}
