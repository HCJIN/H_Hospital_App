package com.green.H_Hospital_App.member.controller;

import com.green.H_Hospital_App.member.service.MemberService;
import com.green.H_Hospital_App.member.vo.MemberVO;
import jakarta.annotation.Resource;
import jakarta.servlet.http.HttpSession;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.Enumeration;
import java.util.List;

@RestController
@RequestMapping("/member")
public class MemberController {

    @Resource(name = "memberService")
    private MemberService memberService;

    @GetMapping("/getMember")
    public MemberVO getMember(
            @RequestParam("email") String email,
            @RequestParam("memPw") String memPw,
            @RequestParam("deviceId") String deviceId,
            @RequestParam("latitude") double latitude,
            @RequestParam("longitude") double longitude,
            HttpSession session
    ) {
        System.out.println("@@@@@" + deviceId);

        //로그인 유저 조회
        MemberVO member = memberService.getMember(email, memPw);

        //로그인 유저가 조회되면 스프링 세션에 로그인 정보 저장
        if(member != null){
            MemberVO loginInfo = new MemberVO();
            loginInfo.setEmail(member.getEmail());
            loginInfo.setMemRole(member.getMemRole());
            loginInfo.setMemTel(member.getMemTel());
            loginInfo.setDeviceId(deviceId);
            loginInfo.setLatitude(latitude);
            loginInfo.setLongitude(longitude);
            session.setAttribute(deviceId, loginInfo);
        }

        return member;
    }

    // 회원가입시 데이터를 받아오는 메서드
    @PostMapping("/insertMember")
    public void insertMember(@RequestBody MemberVO memberVO){
        memberService.insertMember(memberVO);
    }


}
