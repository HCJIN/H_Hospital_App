package com.green.H_Hospital_App.location.controller;

import com.green.H_Hospital_App.location.model.LocationVO;
import com.green.H_Hospital_App.location.service.LocationServiceImpl;
import lombok.extern.slf4j.Slf4j;
import com.green.H_Hospital_App.member.vo.MemberVO;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.*;

@Slf4j
@RestController
@RequestMapping("/location")
public class LocationController {

    @Autowired
    private LocationServiceImpl locationService;

    @GetMapping("/get")
    public ResponseEntity<Map<String, Object>> getLocation() {
        try {
            // 예제용으로 임시 데이터 생성
            Map<String, Object> response = new HashMap<>();
            response.put("message", "위치 정보를 가져왔습니다.");
            response.put("location", "예제 데이터");

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Server error in getLocation: ", e);
            return ResponseEntity.internalServerError().body(Map.of("error", "서버 오류가 발생했습니다."));
        }
    }

    @GetMapping("/getAllUserLocation")
    public List<LocationVO> getAllUserLocation(HttpSession session){
        List<LocationVO> locaionList = new ArrayList<>();

        Enumeration<String> sessionDatas = session.getAttributeNames();

        while (sessionDatas.hasMoreElements()) {
            String attributeName = sessionDatas.nextElement();
            MemberVO attributeValue = (MemberVO) session.getAttribute(attributeName);
            System.out.println("@@@@@@@@@@@@@@@@@@@@@@@@@@@");
            System.out.println(attributeName + " : " + attributeValue);

            LocationVO location = new LocationVO();
            location.setDeviceId(attributeValue.getDeviceId());
            location.setEmail(attributeValue.getEmail());
            location.setLatitude(attributeValue.getLatitude());
            location.setLongitude(attributeValue.getLongitude());
            locaionList.add(location);
        }

        System.out.println(locaionList.toString());
        return locaionList;
    }

}
