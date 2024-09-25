package com.green.H_Hospital_App.location.controller;

import com.green.H_Hospital_App.location.model.LocationVO;
import com.green.H_Hospital_App.location.service.LocationService;
import com.green.H_Hospital_App.location.util.Haversine;
import com.green.H_Hospital_App.member.vo.MemberVO;
import jakarta.annotation.Resource;
import jakarta.servlet.http.HttpSession;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.HashMap;

@Slf4j
@RestController
@RequestMapping("/location")
public class LocationController {

    @Resource(name = "locationService")
    private LocationService locationService;

    @GetMapping("/get")
    public ResponseEntity<Map<String, Object>> getLocation() {
        try {
            // 예제용으로 임시 데이터 생성
            Map<String, Object> response = new HashMap<>();
            response.put("message", "위치 정보를 가져왔습니다.");
            response.put("location", "예제 데이터");

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("서버 오류 발생: ", e);
            return ResponseEntity.internalServerError().body(Map.of("error", "서버 오류가 발생했습니다."));
        }
    }

    @PostMapping("/getAllUserLocation")
    public List<LocationVO> getAllUserLocation(@RequestBody LocationVO locationVO) {
    //public void getAllUserLocation(@RequestBody LocationVO locationVO) {
        // 로그 추가
        log.info("Received LocationVO: {}", locationVO);

        // 위치 정보 업데이트
        locationService.updateLocation(locationVO);

        // 모든 사용자 위치 조회
        List<LocationVO> allLocations = locationService.getAllUserLocations();
        log.info("All User Locations: {}", allLocations);



        // ----------- 거리 계산 ----------//
        LocationVO myLocation = null; //나의 위치
        for(LocationVO location : allLocations){
            if(location.getDeviceId().equals(locationVO.getDeviceId())){
                myLocation = location;
                break;
            }
        }

        //나의 위도 경도
        for(LocationVO location : allLocations){
            //나를 제외한 사람들만 거리 계산
            if(!location.getDeviceId().equals(locationVO.getDeviceId())){
                //다른 사람의 위도 경도
                double distance = Haversine.calculateDistance(myLocation.getLatitude(), myLocation.getLongitude(), location.getLatitude(), location.getLongitude());
                location.setDistance(distance);
                System.out.println("거리 : " + distance);
            }
        }



        return allLocations;
    }

    @PostMapping("/sendNotification")
    public ResponseEntity<Map<String, String>> sendNotification(@RequestBody Map<String, String> payload) {
        String targetDeviceId = payload.get("targetDeviceId");
        String senderDeviceId = payload.get("senderDeviceId");
        System.out.println(targetDeviceId);
        System.out.println(senderDeviceId);

        try {
            locationService.sendNotification(targetDeviceId, senderDeviceId);
            return ResponseEntity.ok(Map.of("message", "알림이 성공적으로 전송되었습니다."));
        } catch (Exception e) {
            log.error("알림 전송 중 오류 발생: ", e);
            return ResponseEntity.internalServerError().body(Map.of("error", "알림 전송 중 오류가 발생했습니다."));
        }
    }
}
