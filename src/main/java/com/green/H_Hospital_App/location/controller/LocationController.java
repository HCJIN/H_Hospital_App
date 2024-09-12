package com.green.H_Hospital_App.location.controller;

import com.green.H_Hospital_App.location.model.LocationVO;
import com.green.H_Hospital_App.location.service.LocationServiceImpl;
import com.green.H_Hospital_App.member.vo.MemberVO;
import jakarta.servlet.http.HttpSession;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.SQLOutput;
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

    @PostMapping("/getAllUserLocation")
    public List<MemberVO> getAllUserLocation(@RequestBody MemberVO memberVO){ // 위도, 경도, 디비이스번호
        //위도 경도 업데이트
        //디비에 있는 모든 디바이스 번호 및 위도 경도 조회

        System.out.println("@@@" + memberVO);
        List<MemberVO> userAndLocationList = new ArrayList<>();

        return userAndLocationList;
    }


}
