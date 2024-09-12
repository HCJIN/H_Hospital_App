package com.green.H_Hospital_App.member.vo;

import lombok.Data;

@Data
public class MemberVO {
    private int memNum;
    private String email;
    private String memPw;
    private String memName;
    private String memTel;
    private String memRole;
    private Double latitude;
    private Double longitude;

    //기기번호를 가져오기 위해 선언한 변수
    private String deviceId;
}
