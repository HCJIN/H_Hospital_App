package com.green.H_Hospital_App.member.controller;

import com.green.H_Hospital_App.member.service.MemberService;
import com.green.H_Hospital_App.member.vo.MemberVO;
import jakarta.annotation.Resource;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/member")
public class MemberController {

    @Resource(name = "memberService")
    private MemberService memberService;

    @GetMapping("/getMember")
    public MemberVO getMember(
            @RequestParam("email") String email,
            @RequestParam("memPw") String memPw,
            @RequestParam(value = "deviceId", required = false, defaultValue = "default-device-id") String deviceId
    ) {
        // 이메일과 비밀번호를 기반으로 멤버를 가져오는 로직
        return memberService.getMember(email, memPw);
    }

    @PostMapping("/insertMember")
    public void insertMember(@RequestBody MemberVO memberVO){
        memberService.insertMember(memberVO);
    }

    @PostMapping("/updateLocation")
    public void updateLocation(@RequestBody MemberVO memberVO) {
        memberService.updateLocation(memberVO.getEmail(), memberVO.getLatitude(), memberVO.getLongitude());
    }
}
