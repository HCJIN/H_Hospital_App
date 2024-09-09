package com.green.H_Hospital_App.member.controller;

import com.green.H_Hospital_App.member.service.MemberService;
import com.green.H_Hospital_App.member.vo.MemberVO;
import com.green.H_Hospital_App.location.model.Location;
import com.green.H_Hospital_App.location.service.LocationServiceImpl; // 위치 서비스 추가
import jakarta.annotation.Resource;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/member")
public class MemberController {

    @Resource(name = "memberService")
    private MemberService memberService;

    @Resource(name = "locationServiceImpl")
    private LocationServiceImpl locationService;

    @GetMapping("/getMember")
    public MemberVO getMember(
            @RequestParam("email") String email,
            @RequestParam("memPw") String memPw
    ) {
        return memberService.getMember(email, memPw);
    }

    // 회원가입시 데이터를 받아오는 메서드
    @PostMapping("/insertMember")
    public void insertMember(@RequestBody MemberVO memberVO){
        memberService.insertMember(memberVO);
    }

    // 위치 업데이트 엔드포인트 추가
    @PostMapping("/updateLocation")
    public void updateLocation(@RequestBody Location location){
        locationService.updateLocation(location);
    }
}
