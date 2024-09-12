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
<<<<<<< HEAD
            @RequestBody MemberVO memberVO
            //위도, 경도
    ) {
        //로그인 진행
        boolean result = memberService.getMember(memberVO) != null;

        //로그인 성공 시 위도경도 아이디 디바이스번호 insert
        if(result){
            memberService.insertMember(memberVO);
        }else{

        }
        return null;
=======
            @RequestParam("email") String email,
            @RequestParam("memPw") String memPw,
            @RequestParam("deviceId") String deviceId
            //위도, 경도
    ) {

        //로그인 진행
        //로그인 성공 시 위도경도 아이디 디바이스번호 insert

        return memberService.getMember(email, memPw);
>>>>>>> ldh
    }

    // 회원가입시 데이터를 받아오는 메서드
    @PostMapping("/insertMember")
    public void insertMember(@RequestBody MemberVO memberVO){
        memberService.insertMember(memberVO);
    }


}
