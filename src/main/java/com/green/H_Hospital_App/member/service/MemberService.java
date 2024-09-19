package com.green.H_Hospital_App.member.service;

import com.green.H_Hospital_App.member.vo.MemberVO;

public interface MemberService {

    // 회원가입시 데이터를 받아오는 메서드
    void insertMember(MemberVO memberVO);

    //로그인 진행
    MemberVO getMember(MemberVO memberVO);

    void loginInsert(MemberVO memberVO);

    // 이메일로 멤버 찾기 메서드 추가
    MemberVO getMemberByEmail(String email);
}
