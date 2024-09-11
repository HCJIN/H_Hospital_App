package com.green.H_Hospital_App.member.service;

import com.green.H_Hospital_App.member.vo.MemberVO;

public interface MemberService {

    MemberVO getMember(String email, String memPw);

    // 회원가입시 데이터를 받아오는 메서드
    void insertMember(MemberVO memberVO);

    // 위치 업데이트 메서드 추가
    void updateLocation(String email, double latitude, double longitude);
}
