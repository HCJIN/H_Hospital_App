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

    private String deviceId;
    private String email; // userId를 email로 변경
    private Double latitude;
    private Double longitude;

    // 기본 생성자
    public Location() {}

    // 매개변수를 받는 생성자
    public Location(String deviceId, String email, Double latitude, Double longitude) {
        this.deviceId = deviceId;
        this.email = email;
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

    public String getDeviceId() {
        return deviceId;
    }

    public void setDeviceId(String deviceId) {
        this.deviceId = deviceId;
    }

    public String getEmail() {
        return email; // userId를 email로 변경
    }

    public void setEmail(String email) {
        this.email = email; // userId를 email로 변경
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
