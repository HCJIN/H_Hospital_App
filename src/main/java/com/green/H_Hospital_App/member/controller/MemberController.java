package com.green.H_Hospital_App.member.controller;


import com.green.H_Hospital_App.member.service.MemberService;
import com.green.H_Hospital_App.member.vo.MemberVO;
import jakarta.annotation.Resource;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/member")
public class MemberController {

    @Resource(name = "memberService")
    private MemberService memberService;

    @GetMapping("/getMember")
    public MemberVO getMember(
            @RequestParam("email") String email,
            @RequestParam("memPw") String memPw
    ){
        return memberService.getMember(email, memPw);
    }

    // 회원가입시 데이터를 받아오는 메서드
    @PostMapping("/insertMember")
    public void insertMember(@RequestBody MemberVO memberVO){
        System.out.println(111);
        memberService.insertMember(memberVO);
    }
}


