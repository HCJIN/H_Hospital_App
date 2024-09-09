import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, TextInput } from 'react-native';
import * as Location from 'expo-location';
import * as Device from 'expo-device';
import 'react-native-get-random-values';

export default function MainScreen() {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [distance, setDistance] = useState(null);
  const [userId, setUserId] = useState(''); // 사용자 ID 상태 추가
  const [deviceId, setDeviceId] = useState(''); // 디바이스 ID 상태 추가

  useEffect(() => {
    // expo-device를 사용하여 기기 고유 ID 생성
    const fetchDeviceId = async () => {
      try {
        const id = await Device.getDeviceId(); // 또는 다른 기기 식별 방법
        setDeviceId(id);
      } catch (error) {
        console.error('Error fetching device ID:', error);
      }
    };
    
    fetchDeviceId();
  }, []);

  const getLocation = async () => {
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

    // 위치 정보를 서버에 저장
    sendLocationToServer(deviceId, userId, location.coords.latitude, location.coords.longitude);
  };

  const sendLocationToServer = async (deviceId, userId, latitude, longitude) => {
    try {
      const response = await fetch('http://localhost:8081/location/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          deviceId,
          userId,
          latitude,
          longitude,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setDistance(data.distance); // 서버에서 계산된 거리 받기
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>기기 간 거리 계산</Text>
      
      <TextInput
        style={styles.input}
        placeholder="사용자 ID 입력"
        value={userId}
        onChangeText={setUserId}
        keyboardType="numeric"
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
});
