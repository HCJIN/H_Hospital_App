import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Button, TextInput, Alert, Platform } from 'react-native';
import * as Location from 'expo-location'; // 위치 서비스 API
import { WebView } from 'react-native-webview'; // 웹 뷰를 사용하여 Kakao Maps를 표시하기 위한 라이브러리
import axios from 'axios'; // HTTP 요청을 처리하기 위한 라이브러리
import * as Device from 'expo-device'; // 기기 정보를 가져오기 위한 라이브러리
import { exteral_ip } from './exteral_ip'; // 서버와 통신할 외부 IP 주소
import useInterval from 'use-interval';

import * as Notifications from 'expo-notifications';


export default function MainScreen() {
  
  // 현재 사용자의 위치를 저장하는 상태 (기본값: 서울 시청 좌표)
  const [currentLocation, setCurrentLocation] = useState({
    latitude: 35.54208372658168,
    longitude: 129.33785186095912
  });

  // 웹 뷰에 Kakao Maps가 로드 완료되었는지 여부를 저장하는 상태
  const [mapLoaded, setMapLoaded] = useState(false);

  // WebView에 대한 참조
  const webViewRef = useRef(null);

  // 현재 기기의 ID를 저장하는 상태
  const [deviceId, setDeviceId] = useState(Device.osBuildId);

  // 컴포넌트가 처음 렌더링될 때 기기의 ID를 설정
  useEffect(() => {
    setDeviceId(Device.osBuildId);
  }, []);

  useEffect(() => {
    getLocation();
  }, []);

  //위치 정보를 주기적으로 업데이트하기 위한 useEffect (10초 간격)
  useInterval(() => {
    getLocation();
  }, 10000);

  const [allUserData, setAllUserData] = useState('');
//   const [deviceToken, setDeviceToken] = useState('');


//   //알림을 위해 기기의 토큰을 받아오는 함수
//   async function registerForPushNotificationsAsync() {
//     let token;
    
//     if (Platform.OS === 'android') {
//       await Notifications.setNotificationChannelAsync('default', {
//         name: 'default',
//         importance: Notifications.AndroidImportance.MAX,
//         vibrationPattern: [0, 250, 250, 250],
//         lightColor: '#FF231F7C',
//       });
//     }
    
//     const { status: existingStatus } = await Notifications.getPermissionsAsync();
//     let finalStatus = existingStatus.granted;
//     if (!finalStatus) {
//       const { status } = await Notifications.requestPermissionsAsync();
//       finalStatus = status;
//     }
    
//     if (!finalStatus) {
//       alert('Failed to get push token for push notification!');
//       return;
//     }
    
//     token = (await Notifications.getExpoPushTokenAsync()).data;
//     console.log(token);
//     console.log(typeof(token));
//     setDeviceToken(token);
//     //return token;
//   }

//   async function sendMessage(){
//     const message = {
//       to: deviceToken, // 받은 토큰
//       sound: 'default',
//       title: '알림 제목',
//       body: '알림 내용',
//       data: { someData: 'goes here' },
//     };

// console.log(message);
//     const response = await fetch('https://exp.host/--/api/v2/push/send', {
//       method: 'POST',
//       headers: {
//         Accept: 'application/json',
//         'Accept-encoding': 'gzip, deflate',
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(message),
//     });

//     // 응답의 JSON 데이터를 추출
//     const data = await response.json();

//     // 응답 내용 출력 (확인용)
//     console.log(data);
//   }

//   setTimeout(() => {
//     console.log('메세지 보내기 시작!~');
//     //console.log(createMessage());
//     sendMessage();
//   }, 5000);



  // 서버에서 모든 사용자 위치를 가져오는 함수
  const getAllUserLocations = () => {
    axios.post(`${exteral_ip}/location/getAllUserLocation`, {
      latitude: currentLocation.latitude, // 현재 위치의 위도
      longitude: currentLocation.longitude, // 현재 위치의 경도
      deviceId: deviceId, // 현재 사용자의 디바이스 ID
      email: memberInfo ? memberInfo.email : '', // 로그인된 사용자의 이메일
      memName: memberInfo ? memberInfo.memName : '', // 로그인된 사용자의 이름
      memTel: memberInfo ? memberInfo.memTel : '' // 로그인된 사용자의 전화번호
    }, { withCredentials: true })
    .then((res) => {
      // 서버로부터 받은 위치 데이터를 콘솔에 출력
      console.log('Received user locations from server:', res.data);
      const loadData = JSON.stringify(res.data);
      setAllUserData(loadData);

      // Kakao 지도에 사용자 위치를 반영하는 JavaScript 코드를 생성
      const script = `
        const testData = JSON.parse('${loadData}');

        // 현재 사용자의 위치를 중심으로 지도 이동
        const newLatLng = new kakao.maps.LatLng(${currentLocation.latitude}, ${currentLocation.longitude});
        map.setCenter(newLatLng);
        
        // 각 사용자 위치에 맞춰 마커를 이동시킴
        for(let i = 0 ; i < testData.length ; i++){
          const newLatLng = new kakao.maps.LatLng(testData[i].latitude, testData[i].longitude)
          
          markersArray[i].setPosition(newLatLng);  
        }
      `;
      webViewRef.current.injectJavaScript(script);
    })
    .catch((error) => {
      console.log('Error fetching all user locations:', error);
    });
  };

  // 현재 사용자의 위치를 가져오는 함수
  const getLocation = () => {
    // 위치 권한 요청
    Location.requestForegroundPermissionsAsync()
    .then(({ status }) => {
      if (status !== 'granted') {
        alert('위치 권한이 거부되었습니다.');
        return;
      }
      return Location.getCurrentPositionAsync({}); // 현재 위치 가져오기
    })
    .then(location => {
      // 위치 상태 업데이트
      setCurrentLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      });
      getAllUserLocations();  // 모든 사용자 위치 가져오기
    
    })
    .catch(error => {
      console.error('Error getting location:', error);
    });
  };

  // Kakao Maps HTML 및 JavaScript 콘텐츠
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
      <title>카카오 맵</title>
      <script src="https://dapi.kakao.com/v2/maps/sdk.js?appkey=acb92b206b6bd053c6440e8e1db3ff2a"></script>
      <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
      <style>
        body, html { height: 100%; margin: 0; padding: 0; }
        #map { width: 100%; height: 100%; }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script>
        var map;
        var markersArray = [];
        var infowindow;

        //------------------- 기본 지도 띄우기 ----------------//
      
        var mapContainer = document.getElementById('map');
        mapOption = { 
            center: new kakao.maps.LatLng(${currentLocation.latitude}, ${currentLocation.longitude}), // 지도의 중심좌표
            level: 2 
        };

        // 지도를 표시할 div와  지도 옵션으로  지도를 생성합니다
        map = new kakao.maps.Map(mapContainer, mapOption);

        //마커 생성
        setMarker();

        // 지도 클릭 시 인포윈도우 닫기
        kakao.maps.event.addListener(map, 'click', function() {
          if (infowindow) {
            infowindow.close();
          }
        });

        //-------------------- 함수 선언 영역 -----------------------//
        //--- 내 위치 마커 생성 ---//
        function setMarker(){
          // 마커 이미지의 이미지 주소입니다
          var imageSrc = "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png"; 

          // 마커 이미지의 이미지 크기 입니다
          var imageSize = new kakao.maps.Size(24, 35); 

          // 마커 이미지를 생성합니다    
          var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize); 

          //현재 어플을 사용중인 유저
          const userList = JSON.parse('${allUserData}');
          
          //유저수만큼 마커 생성
          for(const user of userList){
            const marker = new kakao.maps.Marker({
              position: new kakao.maps.LatLng(user.latitude, user.longitude),
              title: '내 위치',
              image: '${deviceId}' == user.deviceId ? markerImage : null
            });
            marker.setMap(map);
            markersArray.push(marker);

            // 내 위치 마커 클릭 시 인포윈도우 표시
            kakao.maps.event.addListener(marker, 'click', function() {
              if (infowindow) {
                infowindow.close();
              }
              
              //나를 제외한 사용자에게만 거리 정보 띄우기
              var iwContent;

              if('${deviceId}' == user.deviceId){
                iwContent = '<div style="padding:5px;">' +
                  '환자 이름: ' + user.memName + '<br>' +
                  '전화번호: ' + user.memTel + '<br>' +
                  '</div>';
              }
              else{
                iwContent = '<div style="padding:5px;">' +
                  '환자 이름: ' + user.memName + '<br>' +
                  '전화번호: ' + user.memTel + '<br>' +
                  '나와의 거리: ' + user.distance + 'M<br>' +
                  '</div>';
              }
              // 인포윈도우 생성 및 표시
              infowindow = new kakao.maps.InfoWindow({
                content: iwContent
              });
              infowindow.open(map, marker);
            });

          }
        }
      </script>
    </body>
    </html>
  `;

  // 현재 로그인된 사용자의 정보를 저장하는 상태
  const [memberInfo, setMemberInfo] = useState(null);

  // 기기 ID에 해당하는 사용자 정보를 서버에서 가져오는 useEffect
  useEffect(() => {
    if (deviceId) {
      axios.get(`${exteral_ip}/member/getMemberInfo/${deviceId}`)
        .then((res) => {
          console.log(res.data[0])
          setMemberInfo(res.data[0]); // 사용자 정보 상태 업데이트
        })
        .catch((error) => {
          console.log('Error fetching member info:', error);
        });
    }
  }, [deviceId]);

  // 화면 구성
  return (
    <View style={styles.container}>
      <Text style={styles.text}>기기 간 거리 계산</Text>

      {/* Kakao Maps를 표시하는 WebView */}
      {
        allUserData.length != 0 ?
        <WebView
        ref={webViewRef}
        originWhitelist={['*']}
        source={{ html: htmlContent }}
        style={{ flex: 1 }}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        scalesPageToFit={true}
        mixedContentMode="compatibility"
        allowFileAccess={true}
        useWebKit={true}
        cacheEnabled={true}
        cacheMode="LOAD_DEFAULT"
        allowsInlineMediaPlayback={true}
        scrollEnabled={false} // 스크롤을 막고 줌을 가능하게 함
        onShouldStartLoadWithRequest={() => true} // 모든 요청 허용
        nestedScrollEnabled={true} // 내장된 스크롤 기능 허용
      />:
      null
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  text: {
    fontSize: 20,
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
});
