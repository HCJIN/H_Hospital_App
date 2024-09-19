import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Button, TextInput, Alert } from 'react-native';
import * as Location from 'expo-location';
import { WebView } from 'react-native-webview';
import axios from 'axios';
import * as Device from 'expo-device';
import { exteral_ip } from './exteral_ip';

export default function MainScreen() {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [email, setEmail] = useState('');
  const [memberInfo, setMemberInfo] = useState({});
  const [mapLoaded, setMapLoaded] = useState(false);
  const [webViewError, setWebViewError] = useState(null);
  const webViewRef = useRef(null);
  const [deviceId, setDeviceId] = useState('');

  useEffect(() => {
    (async () => {
      const id = await Device.getDeviceIdAsync() || 'default-device-id';
      setDeviceId(id);
      await getLocation();
    })();
  }, []);

  useEffect(() => {
    if (mapLoaded && currentLocation) {
      updateMapLocation(currentLocation.latitude, currentLocation.longitude);
      getAllUserLocations();
    }
  }, [mapLoaded, currentLocation]);

  const getLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('위치 권한이 거부되었습니다.');
        return;
      }
      const location = await Location.getCurrentPositionAsync({});
      setCurrentLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      });
    } catch (error) {
      console.error('Error getting location:', error);
      Alert.alert('위치 정보를 가져오는 데 실패했습니다.');
    }
  };

  const updateMapLocation = (latitude, longitude) => {
    if (webViewRef.current) {
      const script = `
        try {
          var newLatLng = new kakao.maps.LatLng(${latitude}, ${longitude});
          if (typeof map !== 'undefined') {
            map.setCenter(newLatLng);
            if (typeof myLocationMarker === 'undefined') {
              myLocationMarker = new kakao.maps.Marker({
                position: newLatLng,
                map: map,
                title: '내 위치'
              });
            } else {
              myLocationMarker.setPosition(newLatLng);
            }
          } else {
            console.error('Map is undefined');
            window.ReactNativeWebView.postMessage(JSON.stringify({type: 'error', message: 'Map is undefined'}));
          }
        } catch (error) {
          console.error('Error in updateMapLocation:', error);
          window.ReactNativeWebView.postMessage(JSON.stringify({type: 'error', message: error.toString()}));
        }
      `;
      webViewRef.current.injectJavaScript(script);
    }
  };

  function getAllUserLocations() {
    if (!currentLocation) return;

    axios.post(`${exteral_ip}/location/getAllUserLocation`, {
      latitude: currentLocation.latitude,
      longitude: currentLocation.longitude,
      deviceId: deviceId,
      email: email
    }, { withCredentials: true })
    .then((res) => {
      if (webViewRef.current) {
        const markersScript = res.data.map((user, index) => `
          var userLatLng = new kakao.maps.LatLng(${user.latitude}, ${user.longitude});
          var userMarker = new kakao.maps.Marker({
            position: userLatLng,
            title: '${user.deviceId}'
          });
          userMarker.setMap(map);
          markersArray.push(userMarker);

          kakao.maps.event.addListener(userMarker, 'click', function() {
            showInfoWindow(userMarker, '${user.deviceId}', '${user.deviceId}', '알 수 없음');
          });
        `).join('\n');

        const script = `
          try {
            if (typeof markersArray !== 'undefined') {
              markersArray.forEach(marker => marker.setMap(null));
            }
            markersArray = [];
            ${markersScript}
          } catch (error) {
            console.error('Error in getAllUserLocations:', error);
            window.ReactNativeWebView.postMessage(JSON.stringify({type: 'error', message: error.toString()}));
          }
        `;
        webViewRef.current.injectJavaScript(script);
      }
    })
    .catch((error) => {
      console.log('Error fetching all user locations:', error);
      Alert.alert('사용자 위치 정보를 가져오는 데 실패했습니다.');
    });
  }

  const onWebViewMessage = (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'sendNotification') {
        sendNotification(data.targetDeviceId);
      } else if (data.type === 'mapLoaded') {
        setMapLoaded(true);
      } else if (data.type === 'error') {
        setWebViewError(data.message);
        Alert.alert('맵 오류', data.message);
      }
    } catch (error) {
      console.error('Error parsing WebView message:', error);
    }
  };

  const sendNotification = (targetDeviceId) => {
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

    function initMap() {
      try {
        var container = document.getElementById('map');
        var options = {
          center: new kakao.maps.LatLng(37.5665, 126.978), // Default to Seoul
          level: 5
        };

        map = new kakao.maps.Map(container, options);

        kakao.maps.event.addListener(map, 'click', function() {
          if (infowindow) {
            infowindow.close();
          }
        });

        window.ReactNativeWebView.postMessage(JSON.stringify({type: 'mapLoaded'}));
      } catch (error) {
        console.error('Error initializing map:', error);
        window.ReactNativeWebView.postMessage(JSON.stringify({type: 'error', message: error.toString()}));
      }
    }

    function showInfoWindow(marker, deviceId, name, tel) {
      if (infowindow) {
        infowindow.close();
      }
      var iwContent = '<div style="padding:5px;">기기 ID: ' + deviceId + '<br>이름: ' + name + '<br>전화번호: ' + tel + '<br><button onclick="sendNotification(\'' + deviceId + '\')">알림 보내기</button></div>';
      infowindow = new kakao.maps.InfoWindow({
        content: iwContent
      });
      infowindow.open(map, marker);
    }

    function sendNotification(targetDeviceId) {
      window.ReactNativeWebView.postMessage(JSON.stringify({type: 'sendNotification', targetDeviceId: targetDeviceId}));
    }

    window.onerror = function(message, source, lineno, colno, error) {
      console.error('JavaScript error:', message, source, lineno, colno, error);
      window.ReactNativeWebView.postMessage(JSON.stringify({type: 'error', message: message}));
    };

    kakao.maps.load(initMap);
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

      <Button title="내 위치 가져오기" onPress={getLocation} />

      {webViewError && (
        <Text style={styles.errorText}>에러: {webViewError}</Text>
      )}

      <WebView
        ref={webViewRef}
        originWhitelist={['*']}
        source={{ html: htmlContent }}
        onMessage={onWebViewMessage}
        style={{ flex: 1 }}
        onError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.error('WebView error:', nativeEvent);
        }}
        onHttpError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.error('WebView HTTP error:', nativeEvent);
        }}
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
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
});