package com.green.H_Hospital_App.location.model;

import lombok.Data;

@Data
public class LocationVO {
    private Long id;
    private String deviceId;
    private String email;
    private double latitude;
    private double longitude;
    private String memName;
    private String memTel;
    private double distance;
}
