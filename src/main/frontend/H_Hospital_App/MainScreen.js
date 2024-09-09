import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import * as Location from 'expo-location'; // expo-location 모듈 임포트

export default function MainScreen({ navigation }) {

  const [currentLocation, setCurrentLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  // 버튼 클릭 시 위치 정보를 요청하는 함수
  const getLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setErrorMsg('위치 권한이 거부되었습니다.');
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    setCurrentLocation({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>메인 화면</Text>
      <Text style={styles.text}>내 위치 확인</Text>
      <Button
        title="내 위치 가져오기"
        onPress={getLocation} // 버튼 클릭 시 위치 정보 요청
      />
      {currentLocation ? (
        <Text style={styles.text}>
          위도: {currentLocation.latitude} / 경도: {currentLocation.longitude}
        </Text>
      ) : (
        <Text style={styles.text}>
          {errorMsg ? errorMsg : '위치 정보를 가져오려면 버튼을 클릭하세요.'}
        </Text>
      )}
      <StatusBar style="auto" />
    </View>
  );
}

// 컴포넌트의 스타일을 정의합니다.
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    marginBottom: 20,
  },
});
