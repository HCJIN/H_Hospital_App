package com.green.H_Hospital_App.location.model;

import lombok.Data;

@Data
public class NurseVO {
    private Long id;
    private String name; // 예: 간호사 이름
    private LocationVO location; // 위치 정보와의 연관 관계
}
