package com.green.H_Hospital_App.member.controller;

import com.green.H_Hospital_App.member.service.MemberService;
import com.green.H_Hospital_App.member.vo.MemberVO;
import com.green.H_Hospital_App.location.model.LocationVO;
import com.green.H_Hospital_App.location.service.LocationService;
import jakarta.annotation.Resource;
import org.apache.logging.log4j.message.Message;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import javax.management.Notification;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/member")
public class MemberController {

    @Resource(name = "memberService")
    private MemberService memberService;

    @Resource(name = "locationService")
    private LocationService locationService;

    @PostMapping("/getMember")
    public MemberVO getMember(@RequestBody MemberVO memberVO) {
        // 로그인 진행
        MemberVO loggedInMember = memberService.getMember(memberVO);

        // 로그인 성공 시 위치 정보 업데이트
        if (loggedInMember != null) {
            // Create a LocationVO from the MemberVO
            LocationVO locationVO = new LocationVO();
            locationVO.setDeviceId(memberVO.getDeviceId());
            locationVO.setLatitude(memberVO.getLatitude());
            locationVO.setLongitude(memberVO.getLongitude());

            // Update location information
            locationService.updateLocation(locationVO);
            memberService.loginInsert(memberVO);

            // Optionally, return the MemberVO or a response indicating success
            return loggedInMember;
        }

        // 로그인 실패 시 null 반환
        return null;
    }

    @PostMapping("/insertMember")
    public void insertMember(@RequestBody MemberVO memberVO) {
        memberService.insertMember(memberVO);
    }

    @GetMapping("/getMemberInfo/{deviceId}")
    public List<MemberVO> getMemberInfo(@PathVariable("deviceId") String deviceId){
        return memberService.getMemberInfo(deviceId);
    }

}
