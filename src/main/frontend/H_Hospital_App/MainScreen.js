import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Button, TextInput } from 'react-native';
import * as Location from 'expo-location';
import * as Crypto from 'expo-crypto';
import { WebView } from 'react-native-webview';

export default function MainScreen() {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [allLocations, setAllLocations] = useState([]);
  const [distance, setDistance] = useState(null);
  const [email, setEmail] = useState('');
  const [deviceId, setDeviceId] = useState('');
  const [isTracking, setIsTracking] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const webViewRef = useRef(null);

  useEffect(() => {
    const generateDeviceId = async () => {
      const randomBytes = await Crypto.getRandomBytesAsync(16);
      const id = Array.from(randomBytes, byte => ('0' + byte.toString(16)).slice(-2)).join('');
      setDeviceId(id);
    };
    generateDeviceId();
  }, []);

  useEffect(() => {
    if (isTracking) {
      const intervalId = setInterval(() => {
        getLocation();
        fetchAllLocations();
      }, 10000);
      return () => clearInterval(intervalId);
    }
  }, [isTracking]);

  useEffect(() => {
    if (currentLocation && mapLoaded) {
      updateMapLocation(currentLocation.latitude, currentLocation.longitude);
    }
    if (allLocations.length > 0 && mapLoaded) {
      allLocations.forEach(loc => {
        addMarker(loc.latitude, loc.longitude);
      });
    }
  }, [currentLocation, allLocations, mapLoaded]);

  const getLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert('위치 권한이 거부되었습니다.');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setCurrentLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      });

      sendLocationToServer(deviceId, email, location.coords.latitude, location.coords.longitude);
    } catch (error) {
      console.error('Error getting location:', error);
    }
  };

  const fetchAllLocations = async () => {
    try {
      const response = await fetch('https://79f6-58-151-101-222.ngrok-free.app/location/all');
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`HTTP error! status: ${response.status}, ${errorText}`);
        throw new Error(`HTTP error! status: ${response.status}, ${errorText}`);
      }
      const data = await response.json();
      setAllLocations(data);
    } catch (error) {
      console.error('Error fetching all locations:', error.message);
    }
  };

  const sendLocationToServer = async (deviceId, email, latitude, longitude) => {
    try {
      const trimmedEmail = email.trim() || null;
  
      if (!deviceId || !trimmedEmail || !latitude || !longitude) {
        throw new Error('필수 필드가 누락되었습니다.');
      }
  
      const requestBody = {
        location: {
          deviceId,
          email: trimmedEmail,
          latitude,
          longitude,
        }
      };
  
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
  
      if (data.distance !== undefined) {
        setDistance(data.distance);
      } else {
        console.error('Distance data is missing in response');
      }
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  const updateMapLocation = (latitude, longitude) => {
    if (webViewRef.current && mapLoaded) {
      const message = { latitude, longitude };
      webViewRef.current.postMessage(JSON.stringify(message));
    } else {
      console.log('WebView or map not ready for location update');
    }
  };

  const addMarker = (latitude, longitude) => {
    if (webViewRef.current && mapLoaded) {
      const message = { latitude, longitude };
      webViewRef.current.postMessage(JSON.stringify(message));
    } else {
      console.log('WebView or map not ready for marker addition');
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
            console.log("Map loaded successfully.");
            window.ReactNativeWebView.postMessage('Map loaded');

            // 마커 클릭 이벤트 추가
            kakao.maps.event.addListener(marker, 'click', function() {
              var message = 'Marker clicked at latitude: ' + marker.getPosition().getLat() + ', longitude: ' + marker.getPosition().getLng();
              window.ReactNativeWebView.postMessage(message);
            });
          } catch (error) {
            console.error("Error initializing map:", error);
            window.ReactNativeWebView.postMessage('Error initializing map: ' + error.message);
          }
        }

        initMap();
        
        function updateMapLocation(latitude, longitude) {
          try {
            if (map) {
              var newLatLng = new kakao.maps.LatLng(latitude, longitude);
              map.setCenter(newLatLng);

              if (marker) {
                marker.setPosition(newLatLng);
              } else {
                marker = new kakao.maps.Marker({
                  position: newLatLng
                });
                marker.setMap(map);
                
                // 새로 추가된 마커에 클릭 이벤트 추가
                kakao.maps.event.addListener(marker, 'click', function() {
                  var message = 'Marker clicked at latitude: ' + marker.getPosition().getLat() + ', longitude: ' + marker.getPosition().getLng();
                  window.ReactNativeWebView.postMessage(message);
                });
              }

              console.log("Map location updated.");
              window.ReactNativeWebView.postMessage('Location updated');
            } else {
              console.error("Map is not initialized.");
              window.ReactNativeWebView.postMessage('Map is not initialized');
            }
          } catch (error) {
            console.error("Error updating location:", error);
            window.ReactNativeWebView.postMessage('Error updating location: ' + error.message);
          }
        }

        window.addEventListener('message', function(event) {
          var data = JSON.parse(event.data);
          if (data.latitude && data.longitude) {
            updateMapLocation(data.latitude, data.longitude);
          }
        });
      </script>
    </body>
    </html>
  `;

  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        originWhitelist={['*']}
        source={{ html: htmlContent }}
        onMessage={event => {
          const message = event.nativeEvent.data;
          console.log('Message from WebView:', message);
          if (message === 'Map loaded') {
            setMapLoaded(true);
          } else if (message.startsWith('Marker clicked')) {
            // 마커 클릭 이벤트 처리
            alert(message);
          }
        }}
        onLoadEnd={() => {
          console.log('WebView has finished loading');
        }}
        onLoadError={(error) => {
          console.error('WebView loading error:', error);
        }}
        style={{ flex: 1 }}
      />
      <TextInput
        placeholder="Enter email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />
      <Button
        title={isTracking ? "Stop Tracking" : "Start Tracking"}
        onPress={() => setIsTracking(prev => !prev)}
      />
      {distance && <Text>Distance: {distance} meters</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    width: '80%',
    paddingHorizontal: 10,
  },
});
