import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Button, TextInput } from 'react-native';

export default function MainScreen({ navigation }) {

  const [currentLocation, setCurrentLocation] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setCurrentLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      });
    })();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>메인 화면</Text>
      <Text style={styles.text}>내 위치 확인</Text>
      {
        currentLocation ? (
          <Text style={styles.text}>
            {currentLocation.latitude} / {currentLocation.longitude}
          </Text>
        ) : (
          <Text style={styles.text}>위치 정보를 받지 못했습니다.</Text>
        )
      }
      <StatusBar style="auto" />
    </View>
  );
}

// 컴포넌트의 스타일을 정의합니다.
const styles = StyleSheet.create({
  container: {
    flex: 1, // 화면 전체를 사용합니다.
    justifyContent: 'center', // 수직 방향으로 중앙 정렬합니다.
    alignItems: 'center', // 수평 방향으로 중앙 정렬합니다.
  },
  text: {
    fontSize: 24, // 텍스트의 크기를 설정합니다.
    marginBottom: 20, // 텍스트와 버튼 사이의 간격을 설정합니다.
  },
  input: {
    height: 40, // 입력 필드의 높이 설정
    borderColor: 'gray', // 입력 필드의 테두리 색상 설정
    borderWidth: 1, // 입력 필드의 테두리 두께 설정
    marginBottom: 15, // 각 입력 필드 사이의 간격 설정
    width: '80%', // 입력 필드의 너비 설정
    paddingHorizontal: 10, // 입력 필드의 좌우 패딩 설정
  },
});
