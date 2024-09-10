import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, TextInput } from 'react-native';
import * as Location from 'expo-location';
import { v4 as uuidv4 } from 'uuid'; // UUID 생성기
import 'react-native-get-random-values';

export default function MainScreen() {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [distance, setDistance] = useState(null);
  const [userId, setUserId] = useState(''); // 사용자 ID 상태 추가
  const [deviceId, setDeviceId] = useState(''); // 디바이스 ID 상태 추가

  useEffect(() => {
    // UUID를 사용하여 기기 고유 ID 생성
    const fetchDeviceId = () => {
      try {
        const id = uuidv4(); // UUID 생성
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
      if (!deviceId || !userId || !latitude || !longitude) {
        throw new Error('필수 필드가 누락되었습니다.');
      }

      const requestBody = JSON.stringify({
        deviceId,
        userId,
        latitude,
        longitude,
      });

      console.log('Sending request:', requestBody);

      const response = await fetch('https://f98b-58-151-101-222.ngrok-free.app/location/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: requestBody,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`HTTP error! status: ${response.status}, ${errorText}`);
        throw new Error(`HTTP error! status: ${response.status}, ${errorText}`);
      }

      const data = await response.json();
      console.log('Response data:', data); // 확인 로그 추가

      if (data.distance !== undefined) {
        setDistance(data.distance); // 서버에서 계산된 거리 받기
      } else {
        console.error('Distance data is missing in response');
      }
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
