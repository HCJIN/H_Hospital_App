import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Button, TextInput, Alert } from 'react-native';
import * as Location from 'expo-location'; // 위치 서비스 API
import { WebView } from 'react-native-webview'; // 웹 뷰를 사용하여 Kakao Maps를 표시하기 위한 라이브러리
import axios from 'axios'; // HTTP 요청을 처리하기 위한 라이브러리
import * as Device from 'expo-device'; // 기기 정보를 가져오기 위한 라이브러리
import { exteral_ip } from './exteral_ip'; // 서버와 통신할 외부 IP 주소

export default function MainScreen() {
  // 현재 사용자의 위치를 저장하는 상태 (기본값: 서울 시청 좌표)
  const [currentLocation, setCurrentLocation] = useState({
    latitude: 37.5665,
    longitude: 126.978
  });

  // 이메일 입력 필드의 값을 저장하는 상태
  const [email, setEmail] = useState('');

  // 현재 로그인된 사용자의 정보를 저장하는 상태
  const [memberInfo, setMemberInfo] = useState(null);

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

  // 위치 정보를 주기적으로 업데이트하기 위한 useEffect (30초 간격)
  useEffect(() => {
    const intervalId = setInterval(() => {
      getLocation();
    }, 10000); // 30초마다 getLocation() 호출

    return () => clearInterval(intervalId); // 컴포넌트 언마운트 시 interval 해제
  }, []);

  // 서버에서 모든 사용자 위치를 가져오는 함수
  const getAllUserLocations = () => {
    console.log('11111' + deviceId);
    axios.post(`${exteral_ip}/location/getAllUserLocation`, {
      latitude: currentLocation.latitude,
      longitude: currentLocation.longitude,
      deviceId: deviceId,
      email: memberInfo ? memberInfo.email : email,
      memName: memberInfo ? memberInfo.memName : '',
      memTel : memberInfo ? memberInfo.memTel : ''
    }, { withCredentials: true })
    .then((res) => {

      // 서버로부터 받은 위치 데이터를 콘솔에 출력
      console.log('Received user locations from server:', res.data);
      //myLocationMarker.setMap(null);
      // 서버로부터 받은 위치 데이터를 바탕으로 Kakao Maps에 마커 추가
      if (webViewRef.current && res.data) {
        const markersScript = res.data.map((user) => {
        
          // deviceId가 없는 경우를 처리
          const markerTitle = user.deviceId || 'Unknown Device';

          // 위치 데이터가 유효한지 확인
          if (user.latitude && user.longitude) {
            console.log('sss' + deviceId, user.deviceId);

            const isSameDevice = deviceId.trim() == user.deviceId.trim();

            return `
              var userLatLng = new kakao.maps.LatLng(${user.latitude}, ${user.longitude});

              // 마커 이미지의 이미지 주소입니다
              var imageSrc1 = 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markers_sprites2.png'
              
              var imageSrc2 = "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png"; 

              // 마커 이미지의 이미지 크기 입니다
              var imageSize = new kakao.maps.Size(24, 35); 

              // 마커 이미지를 생성합니다    
              var markerImage1 = new kakao.maps.MarkerImage(imageSrc1, imageSize); 
              var markerImage2 = new kakao.maps.MarkerImage(imageSrc2, imageSize); 

              if(!${isSameDevice}){
                alert('11')

                var userMarker = new kakao.maps.Marker({
                  map:map,
                  position: userLatLng,
                  title: '${markerTitle}',
                  image : markerImage1 // 마커 이미지 
                });
              }
              else{
                alert('12')

                var userMarker = new kakao.maps.Marker({
                  map:map,
                  position: userLatLng,
                  title: '${markerTitle}',
                  image : markerImage2 // 마커 이미지 
                });
              }

              //userMarker.setMap(map);
              markersArray.push(userMarker);

              var iwContent = '<div style="padding:5px;">이름: ${user.memName}<br> 전화번호: ${user.memTel}<button onclick="sendNotification(${user.deviceId})">알림 보내기2</button></div>';
              //var iwContent = '<div style="padding:5px;">환자 이름: ${memberInfo ? memberInfo.memName : '정보 없음'}<br><button type="button">알림 보내기</button></div>';

              // 인포윈도우를 생성합니다
              var infowindow = new kakao.maps.InfoWindow({
                content : iwContent,
                removable : true
              });

              function aaa(map, marker, infowindow) {
                return function() {
                  infowindow.open(map, marker);
                };
              }

              kakao.maps.event.addListener(userMarker, 'click', aaa(map, userMarker, infowindow));
            `;
          } else {
            return ''; // 위치 정보가 없으면 마커를 생성하지 않음
          }
        }).join('\n');

        const script = `
          // 기존 마커가 있으면 모두 제거
          if (typeof markersArray !== 'undefined') {
          console.log('삭제중');
            markersArray.forEach(marker => marker.setMap(null));
          }
          //markersArray = [];
          //${markersScript}
          //console.log('Markers script injected and executed.');
        `;
        webViewRef.current.injectJavaScript(script); // Kakao Maps에 마커 업데이트
      }
    })
    .catch((error) => {
      console.log('Error fetching all user locations:', error);
    });
  };

  // 현재 사용자의 위치를 가져오는 함수
  const getLocation = () => {
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
      updateMapLocation(location.coords.latitude, location.coords.longitude); // 지도에 새 위치 반영
      getAllUserLocations();  // 모든 사용자 위치 가져오기
    })
    .catch(error => {
      console.error('Error getting location:', error);
    });
  };

  // 지도에서 현재 위치를 업데이트하는 함수
  const updateMapLocation = (latitude, longitude) => {
    if (webViewRef.current && mapLoaded) {
      const script = `
        var newLatLng = new kakao.maps.LatLng(${latitude}, ${longitude});
        map.setCenter(newLatLng); // 지도의 중심을 새 위치로 이동
        if (myLocationMarker) {
          myLocationMarker.setPosition(newLatLng); // 내 위치 마커 업데이트
        }
      `;
      webViewRef.current.injectJavaScript(script); // 지도에 업데이트된 스크립트 주입
    }
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
    <style>
      body, html { height: 100%; margin: 0; padding: 0; }
      #map { width: 100%; height: 100%; }
    </style>
  </head>
  <body>
    <div id="map"></div>
    <script>
      var map, myLocationMarker, infowindow, markersArray = [];

      // 지도를 초기화하는 함수
      function initMap() {
        var container = document.getElementById('map');
        var options = {
          center: new kakao.maps.LatLng(${currentLocation.latitude}, ${currentLocation.longitude}),
          level: 2
        };

        map = new kakao.maps.Map(container, options);

        


//////////////////////

///////////////////


        // 지도 클릭 시 인포윈도우 닫기
        kakao.maps.event.addListener(map, 'click', function() {
          if (infowindow) {
            infowindow.close();
          }
        });

        // 맵 로드 완료 시 React Native로 메시지 전송
        window.ReactNativeWebView.postMessage('Map loaded successfully');
      }
      kakao.maps.load(initMap);

      // 알림 전송 함수targetDeviceId
      function sendNotification(deviceId) {
        alert(11);
        window.ReactNativeWebView.postMessage(JSON.stringify({type: 'sendNotification', targetDeviceId: '21G93'}));
      }
    </script>
  </body>
  </html>
  `;

  // WebView에서 메시지 수신 시 처리하는 함수
  const onWebViewMessage = (event) => {
    
    const message = event.nativeEvent.data;
    
    try {
      const data = JSON.parse(message);
      alert(message);
      if (data.type === 'sendNotification') {
        alert(22);
        sendNotification1(data.targetDeviceId); // 알림 보내기
      }
    } catch (error) {
      if (message === 'Map loaded successfully') {
        setMapLoaded(true); // 맵 로드 상태 업데이트
        if (currentLocation) {
          updateMapLocation(currentLocation.latitude, currentLocation.longitude); // 초기 위치 업데이트
        }
        //getAllUserLocations(); // 사용자 위치 가져오기
      }
    }
  };

  // 알림을 서버로 전송하는 함수
  const sendNotification1 = (targetDeviceId) => {
    alert(33);
    const requestData = { targetDeviceId, senderDeviceId: deviceId };
    console.log('Sending notification with data:', requestData);
    axios.post(`${exteral_ip}/location/sendNotification`, requestData)
      .then((res) => {
        Alert.alert('알림이 전송되었습니다.');
      })
      .catch((error) => {
        Alert.alert('알림 전송 실패: ' + error.message);
        console.error('Error sending notification:', error);
      });
  };

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

      {/* 이메일 입력 필드 */}
      <TextInput
        style={styles.input}
        placeholder="내 이메일 입력"
        value={email}
        onChangeText={setEmail}
        keyboardType="default"
      />

      {/* 위치 가져오기 버튼 */}
      <Button title="내 위치 가져오기" onPress={getLocation} />

      {/* Kakao Maps를 표시하는 WebView */}
      <WebView
        ref={webViewRef}
        originWhitelist={['*']}
        source={{ html: htmlContent }}
        //onMessage={(e) => {onWebViewMessage(e)}}
        onMessage={onWebViewMessage}
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
      />
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
