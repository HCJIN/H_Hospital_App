import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Button, TextInput } from 'react-native';
import * as Location from 'expo-location';
import { v4 as uuidv4 } from 'uuid';
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
  const [mapLoaded, setMapLoaded] = useState(false);
  const webViewRef = useRef(null);

  useEffect(() => {
    const id = uuidv4();
    setDeviceId(id);
  }, []);

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
      
      if (mapLoaded) {
        updateMapLocation(location.coords.latitude, location.coords.longitude);
      } else {
        console.log('Map not loaded yet, location update queued');
      }
    } catch (error) {
      console.error('Error getting location:', error);
    }
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

  useEffect(() => {
    if (isTracking) {
      const intervalId = setInterval(() => {
        getLocation();
      }, 5000);
      return () => clearInterval(intervalId);
    }
  }, [isTracking, mapLoaded]);

  const updateMapLocation = (latitude, longitude) => {
    if (webViewRef.current && mapLoaded) {
      const script = `
        try {
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

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
      <title>카카오 맵</title>
      <script src="https://dapi.kakao.com/v2/maps/sdk.js?appkey=fcaac90717961c96e110a08056effef4"></script>
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

      {currentLocation && (
        <Text style={styles.text}>
          내 위치: {currentLocation.latitude.toFixed(6)}, {currentLocation.longitude.toFixed(6)}
        </Text>
      )}

      {distance !== null && (
        <Text style={styles.text}>
          다른 기기와의 거리: {distance} km
        </Text>
      )}

      <Button
        title={isTracking ? "위치 추적 중지" : "위치 추적 시작"}
        onPress={() => setIsTracking(!isTracking)}
      />

      <View style={styles.mapContainer}>
        <WebView
          ref={webViewRef}
          originWhitelist={['*']}
          source={{ html: htmlContent }}
          style={styles.webview}
          onError={(e) => console.error('WebView error:', e.nativeEvent)}
          onMessage={onWebViewMessage}
          javaScriptEnabled={true}
          domStorageEnabled={true}
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
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    width: '100%',
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  mapContainer: {
    width: '100%',
    height: '40%',
    marginTop: 10,
  },
  webview: {
    flex: 1,
  },
});