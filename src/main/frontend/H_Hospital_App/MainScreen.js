import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, TextInput } from 'react-native';
import * as Location from 'expo-location';
import { v4 as uuidv4 } from 'uuid'; // UUID 생성기
import 'react-native-get-random-values';
import { WebView } from 'react-native-webview';
import useInterval from 'use-interval';

export default function MainScreen() {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [distance, setDistance] = useState(null);
  const [email, setEmail] = useState('');
  const [inputEmail, setInputEmail] = useState('');
  const [deviceId, setDeviceId] = useState('');
  const [isTracking, setIsTracking] = useState(false);

  useEffect(() => {
    const id = uuidv4();
    setDeviceId(id);
  }, []);

  

  const getLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      alert('위치 권한이 거부되었습니다.');
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    console.log(location);
    setCurrentLocation({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude
    });

    sendLocationToServer(deviceId, email, location.coords.latitude, location.coords.longitude);
  };

  const sendLocationToServer = async (deviceId, email, latitude, longitude) => {
    try {
      // 빈 문자열을 null로 변환
      const trimmedEmail = email.trim() || null;
      const trimmedInputEmail = inputEmail.trim() || null;

      // 유효성 검사
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

      const response = await fetch('https://9cd5-58-151-101-222.ngrok-free.app/location/save', {
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

  // useInterval을 사용해 주기적으로 getLocation 호출(실시간으로 위치 업데이트)
  useInterval(() => {
    if (isTracking) {  // 위치 추적이 활성화된 경우에만 getLocation을 실행
      getLocation();
    }
  }, isTracking ? 5000 : null); // isTracking이 true일 때만 5초 간격으로 위치 업데이트

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>카카오 맵</title>
      <script src="https://dapi.kakao.com/v2/maps/sdk.js?appkey=fcaac90717961c96e110a08056effef4"></script>
      <style>
        body, html { height: 100%; margin: 0; }
        #map { width: 100%; height: 100%; }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script>
        document.addEventListener('DOMContentLoaded', function () {
          var mapContainer = document.getElementById('map'),
              mapOption = {
                center: new kakao.maps.LatLng(37.5665, 126.978),
                level: 3
              };
          
          var map = new kakao.maps.Map(mapContainer, mapOption);
        });
      </script>
    </body>
    </html>
  `;

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

      {currentLocation && (
        <Text style={styles.text}>
          내 위치: {currentLocation.latitude}, {currentLocation.longitude}
        </Text>
      )}

      {distance !== null && (
        <Text style={styles.text}>
          다른 기기와의 거리: {distance} km
        </Text>
      )}

       {/* 위치 추적 시작/중지 버튼 */}
      <Button
        title={isTracking ? "위치 추적 중지" : "위치 추적 시작"}
        onPress={() => setIsTracking(!isTracking)} // 버튼 클릭 시 추적 상태 변경
      />

      {/* 카카오맵 웹 뷰 */}
      <View style={styles.mapContainer}>
        <WebView
          originWhitelist={['*']}
          source={{ html: htmlContent }}
          style={styles.webview}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    width: '100%',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  mapContainer: {
    width: '100%',
    height: '50%', // 웹 뷰 높이 조정
    marginTop: 20,
  },
  webview: {
    flex: 1,
  },
});
