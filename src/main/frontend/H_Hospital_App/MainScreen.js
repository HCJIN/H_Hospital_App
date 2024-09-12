import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Button, TextInput } from 'react-native';
import * as Location from 'expo-location';
import { WebView } from 'react-native-webview';
import axios from 'axios';
import * as Device from 'expo-device';

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
  const [mapLoaded, setMapLoaded] = useState(false);
  const webViewRef = useRef(null);
  const [allUserLocations, setAllUserLocations] = useState([]); // 여러 위치 데이터를 저장하는 state
  const [deviceId, setDeviceId] = useState(''); // 추가된 부분

  //디바이스 아이디 
  useEffect(() => {
   // console.log('111' + Device.osBuildId);
    //setDeviceId(Device.osBuildId || 'default-device-id'); // 디바이스 ID가 없을 경우 대체 값 설정
  }, []);

  // 위치 추적 시작/중지
  useEffect(() => {
    const intervalId = setInterval(() => {
      
      getLocation(); // 내 위치 가져오기
      getAllUserLocations(); // 전체 사용자 위치 가져오기
    }, 50000); // 100초마다 위치 업데이트
    return () => clearInterval(intervalId);
  }, []);

  function getAllUserLocations() {
    console.log('Device ID: ' + deviceId);
    axios.post('https://79f6-58-151-101-222.ngrok-free.app/location/getAllUserLocation', {
      latitude: currentLocation.latitude,
      longitude: currentLocation.longitude,
      deviceId: deviceId
    }, { withCredentials: true })
    .then((res) => {
      console.log('All user locations:', res.data.length);
      // 웹뷰에 사용자 위치를 업데이트합니다.
      if (webViewRef.current) {
        const markers = res.data.map(user => `
          var userLatLng = new kakao.maps.LatLng(${user.latitude}, ${user.longitude});
          var userMarker = new kakao.maps.Marker({
            position: userLatLng
          });
          userMarker.setMap(map);
        `).join('\n');
        
        const script = `
          try {
            if (typeof kakao === 'undefined' || typeof kakao.maps === 'undefined') {
              throw new Error('Kakao Maps library is not loaded.');
            }
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

  // 모든 유저 위치 가져오기
  function getAllUserLocation(){
    console.log('11111' + Device.osBuildId);
    axios.post('https://79f6-58-151-101-222.ngrok-free.app/location/getAllUserLocation', {
      latitude : currentLocation.latitude,
      longitude : currentLocation.longitude,
      deviceId : Device.osBuildId
    }, {withCredentials: true})
    .then((res) => {
      console.log(res.data)
      setAllUserLocations(res.data); // 서버로부터 받은 위치 데이터를 상태로 저장
      updateAllMarkers(res.data); // 위치 데이터를 기반으로 마커 업데이트
    })
    .catch((error) => {console.log(error)});
  }


  // 지도 및 마커 업데이트
  useEffect(() => {
    if (currentLocation && mapLoaded) {
      updateMapLocation(currentLocation.latitude, currentLocation.longitude);
    }
  }, [currentLocation, mapLoaded]);


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
          center: new kakao.maps.LatLng(35.5420093, 129.3382968),
          level: 5
        };

        map = new kakao.maps.Map(container, options);

        // 테스트 마커 추가
        var testLatLng = new kakao.maps.LatLng(${currentLocation.latitude}, ${currentLocation.longitude});
        var testMarker = new kakao.maps.Marker({
          position: testLatLng,
          title: '테스트 마커'
        });
        testMarker.setMap(map);

        // 현재 위치 마커 추가
        var currentLatLng = new kakao.maps.LatLng(${currentLocation.latitude}, ${currentLocation.longitude}+0.01);
        var currentMarker = new kakao.maps.Marker({
          position: currentLatLng,
          title: '현재 위치'
        });
        currentMarker.setMap(map);

        var iwContent = '<div style="padding:5px;">Hello World! <br>' +
                      '<a href="https://map.kakao.com/link/map/Hello World!${currentLocation.latitude}, ${currentLocation.longitude}" style="color:blue" target="_blank">큰지도보기</a> ' +
                      '<a href="https://map.kakao.com/link/to/Hello World!${currentLocation.latitude}, ${currentLocation.longitude}" style="color:blue" target="_blank">길찾기</a></div>';

        infowindow = new kakao.maps.InfoWindow({
          position: currentLatLng,
          content: iwContent
        });
        infowindow.open(map, currentMarker);

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
    if (message === 'Map loaded successfully') {
      setMapLoaded(true);
      if (currentLocation) {
        updateMapLocation(currentLocation.latitude, currentLocation.longitude);
      }
    } else if (message.startsWith('Error')) {
      console.error('WebView error:', message);
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
