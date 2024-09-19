import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Button, TextInput, Alert } from 'react-native';
import * as Location from 'expo-location';
import { WebView } from 'react-native-webview';
import axios from 'axios';
import * as Device from 'expo-device';
import { exteral_ip } from './exteral_ip';

export default function MainScreen() {
  const [currentLocation, setCurrentLocation] = useState({
    latitude: 37.5665,
    longitude: 126.978
  });

  const [email, setEmail] = useState('');
  const [memberInfo, setMemberInfo] = useState([]);
  const [mapLoaded, setMapLoaded] = useState(false);
  const webViewRef = useRef(null);
  const [deviceId, setDeviceId] = useState('');

  useEffect(() => {
    setDeviceId(Device.osBuildId || 'default-device-id');
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      getLocation();
      getAllUserLocations();
    }, 60000);

    return () => clearInterval(intervalId);
  }, [currentLocation]);

  function getAllUserLocations() {
    axios.post(`${exteral_ip}/location/getAllUserLocation`, {
      latitude: currentLocation.latitude,
      longitude: currentLocation.longitude,
      deviceId: deviceId,
      email: email
    }, { withCredentials: true })
    .then((res) => {
      if (webViewRef.current) {
        const markers = res.data.map(user => `
          var userLatLng = new kakao.maps.LatLng(${user.latitude}, ${user.longitude});
          var userMarker = new kakao.maps.Marker({
            position: userLatLng,
            title: '${user.deviceId}'
          });
          userMarker.setMap(map);
  
          kakao.maps.event.addListener(userMarker, 'click', function() {
            if (infowindow) {
              infowindow.close();
            }
            var iwContent = '<div style="padding:5px;">기기 ID: ${user.deviceId}<br><button onclick="sendNotification(\\'${user.deviceId}\\')">알림 보내기</button></div>';
            infowindow = new kakao.maps.InfoWindow({
              content: iwContent
            });
            infowindow.open(map, userMarker);
          });
          return userMarker;
        `).join('\n');
  
        const script = `
          // 이전 마커 제거
          if (window.markersArray) {
            window.markersArray.forEach(marker => marker.setMap(null));
          }
          
          window.markersArray = []; // 마커 배열 초기화
          
          // 새로운 마커 추가
          ${markers}
          
          // 마커를 배열에 추가
          window.markersArray = [${res.data.map((_, index) => `userMarker${index}`).join(', ')}];
          
          // 현재 위치 마커 업데이트
          var currentLatLng = new kakao.maps.LatLng(${currentLocation.latitude}, ${currentLocation.longitude});
          if (window.currentMarker) {
            window.currentMarker.setPosition(currentLatLng);
          } else {
            window.currentMarker = new kakao.maps.Marker({
              position: currentLatLng,
              title: '현재 위치'
            });
            window.currentMarker.setMap(map);
          }
          map.setCenter(currentLatLng);
        `;
        webViewRef.current.injectJavaScript(script);
      }
    })
    .catch((error) => {
      console.log('Error fetching all user locations:', error);
    });
  }

  const getLocation = () => {
    Location.requestForegroundPermissionsAsync()
    .then(({ status }) => {
      if (status !== 'granted') {
        alert('위치 권한이 거부되었습니다.');
        return;
      }
      return Location.getCurrentPositionAsync({});
    })
    .then(location => {
      setCurrentLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      });
      updateMapLocation(location.coords.latitude, location.coords.longitude);
    })
    .catch(error => {
      console.error('Error getting location:', error);
    });
  };

  const updateMapLocation = (latitude, longitude) => {
    if (webViewRef.current && mapLoaded) {
      const script = `
        var newLatLng = new kakao.maps.LatLng(${latitude}, ${longitude});
        map.setCenter(newLatLng);
        if (window.currentMarker) {
          window.currentMarker.setPosition(newLatLng);
        }
      `;
      webViewRef.current.injectJavaScript(script);
    }
  };

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
    var map, infowindow;
    window.markersArray = [];

    function initMap() {
      var container = document.getElementById('map');
      var options = {
        center: new kakao.maps.LatLng(${currentLocation.latitude}, ${currentLocation.longitude}),
        level: 5
      };

      map = new kakao.maps.Map(container, options);

      window.currentMarker = new kakao.maps.Marker({
        position: new kakao.maps.LatLng(${currentLocation.latitude}, ${currentLocation.longitude}),
        title: '현재 위치'
      });
      window.currentMarker.setMap(map);

<<<<<<< HEAD
      kakao.maps.event.addListener(map, 'click', function() {
        if (infowindow) {
          infowindow.close();
        }
      });
=======
        // 정보 창에 표시할 내용 생성
        var iwContent = '<div style="padding:5px;">';

        // memberInfo 데이터가 있는 경우
        if (window.__initialProps && window.__initialProps.memberInfo) {
          var memberInfoList = JSON.parse(window.__initialProps.memberInfo);
          memberInfoList.forEach(function(memberInfo) {
            iwContent += '<div style="padding:5px;">' +
              '환자 이름: ' + (memberInfo.memName ? memberInfo.memName : '알 수 없음') + '<br>' +
              '전화번호: ' + (memberInfo.memTel ? memberInfo.memTel : '알 수 없음') + '<br>' +
              '</div>';
          });
        } else {
          iwContent += '<div>회원 정보 없음</div>';
        }

        iwContent += '</div>';

>>>>>>> ldh

      window.ReactNativeWebView.postMessage('Map loaded successfully');
    }
    kakao.maps.load(initMap);

    function sendNotification(targetDeviceId) {
      window.ReactNativeWebView.postMessage(JSON.stringify({type: 'sendNotification', targetDeviceId: targetDeviceId}));
    }
  </script>
</body>
</html>
  `;

  const onWebViewMessage = (event) => {
    const message = event.nativeEvent.data;
    try {
      const data = JSON.parse(message);
      if (data.type === 'sendNotification') {
        sendNotification(data.targetDeviceId);
      }
    } catch (error) {
      if (message === 'Map loaded successfully') {
        setMapLoaded(true);
        if (currentLocation) {
          updateMapLocation(currentLocation.latitude, currentLocation.longitude);
        }
      }
    }
  };

  // useEffect에서 HTML과 함께 memberInfo를 주입합니다.
  useEffect(() => {
    if (webViewRef.current) {
      const data = JSON.stringify(memberInfo);
      const script = `
        window.__initialProps = {
          memberInfo: '${data}'
        };
      `;
      webViewRef.current.injectJavaScript(script);
    }
  }, [memberInfo]);

  const sendNotification = (targetDeviceId) => {
    console.log(targetDeviceId, deviceId)
    axios.post(`${exteral_ip}/location/sendNotification`, { targetDeviceId, senderDeviceId: deviceId })
    .then((res) => {
      Alert.alert('알림이 전송되었습니다.');
    })
    .catch((error) => {
      Alert.alert('알림 전송 실패: ' + error.message);
    });
  };

  useEffect(() => {
    if (deviceId) {
      axios.get(`${exteral_ip}/member/getMemberInfo/${deviceId}`)
        .then((res) => {
          setMemberInfo(res.data);
        })
        .catch((error) => {
          console.log('Error fetching member info:', error);
        });
    }
  }, [deviceId]);

  console.log(memberInfo)

  return (
    <View style={styles.container}>
      <Text style={styles.text}>기기 간 거리 계산</Text>

      <TextInput
        style={styles.input}
        placeholder="내 이메일 입력"
        value={email}
        onChangeText={setEmail}
        keyboardType="default"
      />

      <Button title="내 위치 가져오기" onPress={getLocation} />

      <WebView
        ref={webViewRef}
        originWhitelist={['*']}
        source={{ html: htmlContent }}
        onMessage={onWebViewMessage}
        style={{ flex: 1 }}
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