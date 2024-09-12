import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Button, TextInput } from 'react-native';
import * as Location from 'expo-location';
import * as Crypto from 'expo-crypto';
import { WebView } from 'react-native-webview';

export default function MainScreen() {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [distance, setDistance] = useState(null);
  const [email, setEmail] = useState('');
  const [inputEmail, setInputEmail] = useState('');
  const [deviceId, setDeviceId] = useState('');
  const [isTracking, setIsTracking] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const webViewRef = useRef(null);

  // deviceId 생성
  useEffect(() => {
    const generateDeviceId = async () => {
      const randomBytes = await Crypto.getRandomBytesAsync(16);
      const id = Array.from(randomBytes, byte => ('0' + byte.toString(16)).slice(-2)).join('');
      setDeviceId(id);
    };
    generateDeviceId();
  }, []);

  // 위치 추적 시작/중지
  useEffect(() => {
    if (isTracking) {
      const intervalId = setInterval(() => {
        getLocation(); // 내 위치 가져오기
        if (inputEmail) {
          getTargetLocation(inputEmail); // 상대방 위치 가져오기
        }
      }, 5000); // 30초마다 위치 업데이트
      return () => clearInterval(intervalId);
    }
  }, [isTracking, inputEmail]);

  // 지도 및 마커 업데이트
  useEffect(() => {
    if (currentLocation && mapLoaded) {
      updateMapLocation(currentLocation.latitude, currentLocation.longitude);
    }
  }, [currentLocation, mapLoaded]);

  // 내 위치 가져오기
  const getLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert('위치 권한이 거부되었습니다.');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      console.log('Current location:', location);
      setCurrentLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      });

      sendLocationToServer(deviceId, email, location.coords.latitude, location.coords.longitude);
    } catch (error) {
      console.error('Error getting location:', error);
    }
  };

  // 상대방 위치 가져오기
  const getTargetLocation = async (targetEmail) => {
    try {
      const response = await fetch(`https://79f6-58-151-101-222.ngrok-free.app/location/get?email=${targetEmail}`);
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`HTTP error! status: ${response.status}, ${errorText}`);
        throw new Error(`HTTP error! status: ${response.status}, ${errorText}`);
      }
      const data = await response.json();
      if (data.latitude && data.longitude) {
        updateTargetLocation(data.latitude, data.longitude);
      } else {
        console.error('Target location data is missing in response');
      }
    } catch (error) {
      console.error('Error fetching target location:', error.message);
    }
  };

  // 서버에 내 위치 전송
  const sendLocationToServer = async (deviceId, email, latitude, longitude) => {
    try {
      const trimmedEmail = email.trim() || null;
      const trimmedInputEmail = inputEmail.trim() || null;

      if (!deviceId || !trimmedEmail || !latitude || !longitude) {
        throw new Error('필수 필드가 누락되었습니다.');
      }

      const requestBody = {
        location: {
          deviceId,
          email: trimmedEmail,
          latitude,
          longitude,
        },
        targetEmail: trimmedInputEmail
      };

      console.log('Sending request:', requestBody);

      const response = await fetch('https://79f6-58-151-101-222.ngrok-free.app/location/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`HTTP error! status: ${response.status}, ${errorText}`);
        throw new Error(`HTTP error! status: ${response.status}, ${errorText}`);
      }

      const data = await response.json();
      console.log('Response data:', data);

      if (data.distance !== undefined) {
        setDistance(data.distance);
      } else {
        console.error('Distance data is missing in response');
      }
    } catch (error) {
      console.error('Error:', error.message);
    }
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

  // 상대방 위치 지도에 업데이트
  const updateTargetLocation = (latitude, longitude) => {
    if (webViewRef.current && mapLoaded) {
      const script = `
        try {
          if (typeof kakao === 'undefined' || typeof kakao.maps === 'undefined') {
            throw new Error('Kakao Maps library is not loaded.');
          }
          var targetLatLng = new kakao.maps.LatLng(${latitude}, ${longitude});
          var targetMarker = new kakao.maps.Marker({
            position: targetLatLng
          });
          targetMarker.setMap(map);
          window.ReactNativeWebView.postMessage('Target location updated');
        } catch (error) {
          window.ReactNativeWebView.postMessage('Error updating target location: ' + error.message);
        }
      `;
      webViewRef.current.injectJavaScript(script);
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
        var map, marker;
        function initMap() {
          try {
            var container = document.getElementById('map');
            var options = {
              center: new kakao.maps.LatLng(37.5665, 126.978),
              level: 3
            };
            map = new kakao.maps.Map(container, options);
            marker = new kakao.maps.Marker({
              position: new kakao.maps.LatLng(37.5665, 126.978)
            });
            marker.setMap(map);
            window.ReactNativeWebView.postMessage('Map loaded successfully');
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

      <TextInput
        style={styles.input}
        placeholder="다른 사용자 이메일 입력"
        value={inputEmail}
        onChangeText={setInputEmail}
        keyboardType="default"
      />

      <Button title="내 위치 가져오기" onPress={getLocation} />

      <Button
        title={isTracking ? '위치 추적 중지' : '위치 추적 시작'}
        onPress={() => setIsTracking(!isTracking)}
      />

      {distance && <Text>거리: {distance.toFixed(2)} km</Text>}

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
