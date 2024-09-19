import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Button, TextInput } from 'react-native';
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

  const [distance, setDistance] = useState(null); 
  const [email, setEmail] = useState('');

  const [mapLoaded, setMapLoaded] = useState(false);
  const webViewRef = useRef(null);
  const [deviceId, setDeviceId] = useState('');

  // 디바이스 아이디
  useEffect(() => {
    setDeviceId(Device.osBuildId || 'default-device-id');
  }, []);

  // 위치 추적 시작/중지
  useEffect(() => {
    const intervalId = setInterval(() => {
      getLocation(); // 내 위치 가져오기
      getAllUserLocations(); // 전체 사용자 위치 가져오기
    }, 30000); // 30초마다 위치 업데이트

    return () => clearInterval(intervalId);
  }, [currentLocation]);

  // 전체 사용자 위치 가져오기
  function getAllUserLocations() {
    console.log('Device ID: ' + deviceId);
    axios.post(`${exteral_ip}/location/getAllUserLocation`, {
      latitude: currentLocation.latitude,
      longitude: currentLocation.longitude,
      deviceId: deviceId,
      email: email
    }, { withCredentials: true })
    .then((res) => {
      console.log('All user locations:', res.data.length);
      // 웹뷰에 사용자 위치를 업데이트합니다.
      if (webViewRef.current) {
        // 사용자 위치 정보를 기반으로 마커 추가 JavaScript 코드 생성
        const markers = res.data.map(user => `
          var userLatLng = new kakao.maps.LatLng(${user.latitude}, ${user.longitude});
          var userMarker = new kakao.maps.Marker({
            position: userLatLng,
            title: '${user.deviceId}'
          });
          userMarker.setMap(map);
        `).join('\n');
        
        const script = `
          try {
            if (typeof kakao === 'undefined' || typeof kakao.maps === 'undefined') {
              throw new Error('Kakao Maps library is not loaded.');
            }
            // 현재 위치 마커 업데이트
            var newLatLng = new kakao.maps.LatLng(${currentLocation.latitude}, ${currentLocation.longitude});
            marker.setPosition(newLatLng);
            map.setCenter(newLatLng);
            // 모든 사용자 마커 추가
            ${markers}
            window.ReactNativeWebView.postMessage('All user locations updated');
          } catch (error) {
            window.ReactNativeWebView.postMessage('Error updating user locations: ' + error.message);
          }
        `;
        webViewRef.current.injectJavaScript(script);
      }
    })
    .catch((error) => {
      console.log('Error fetching all user locations:', error);
    });
  }

  // 내 위치 가져오기
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
      console.log('Current location:', location);
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

  // 내 위치 지도에 업데이트
  const updateMapLocation = (latitude, longitude) => {
    if (webViewRef.current && mapLoaded) {
      const script = `
        try {
          if (typeof kakao === 'undefined' || typeof kakao.maps === 'undefined') {
            throw new Error('Kakao Maps library is not loaded.');
          }
          var newLatLng = new kakao.maps.LatLng(${latitude}, ${longitude});
          map.setCenter(newLatLng);
          marker.setPosition(newLatLng);
          window.ReactNativeWebView.postMessage('Location updated');
        } catch (error) {
          window.ReactNativeWebView.postMessage('Error updating location: ' + error.message);
        }
      `;
      webViewRef.current.injectJavaScript(script);
    } else {
      console.log('WebView or map not ready for location update');
    }
  };

  // 카카오맵 초기화
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
    var map, marker, infowindow;

    function initMap() {
      try {
        var container = document.getElementById('map');
        var options = {
          center: new kakao.maps.LatLng(${currentLocation.latitude}, ${currentLocation.longitude}),
          level: 5
        };

        map = new kakao.maps.Map(container, options);

        // 현재 위치 마커 추가
        marker = new kakao.maps.Marker({
          position: new kakao.maps.LatLng(${currentLocation.latitude}, ${currentLocation.longitude}),
          title: '현재 위치'
        });
        marker.setMap(map);

        var iwContent = '<div style="padding:5px;">Hello World! <br>' +
                      '<a href="https://map.kakao.com/link/map/Hello World!${currentLocation.latitude}, ${currentLocation.longitude}" style="color:blue" target="_blank">큰지도보기</a> ' +
                      '<a href="https://map.kakao.com/link/to/Hello World!${currentLocation.latitude}, ${currentLocation.longitude}" style="color:blue" target="_blank">길찾기</a></div>';

        infowindow = new kakao.maps.InfoWindow({
          position: new kakao.maps.LatLng(${currentLocation.latitude}, ${currentLocation.longitude}),
          content: iwContent
        });
        infowindow.open(map, marker);

        console.log('Markers added successfully');
        window.ReactNativeWebView.postMessage('Map loaded successfully with markers');
      } catch (error) {
        console.error('Error initializing map:', error.message);
        window.ReactNativeWebView.postMessage('Error initializing map: ' + error.message);
      }
    }
    kakao.maps.load(initMap);
  </script>
</body>
</html>
`;

  const onWebViewMessage = (event) => {
    const message = event.nativeEvent.data;
    console.log('Message from WebView:', message);
    if (message === 'Map loaded successfully with markers') {
      setMapLoaded(true);
      if (currentLocation) {
        updateMapLocation(currentLocation.latitude, currentLocation.longitude);
      }
    } else if (message.startsWith('Error')) {
      console.error('WebView error:', message);
    } else if (message === 'All user locations updated') {
      console.log('All user locations updated successfully');
    }
  };

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

      {distance !== null && <Text>거리: {distance.toFixed(2)} km</Text>}

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
