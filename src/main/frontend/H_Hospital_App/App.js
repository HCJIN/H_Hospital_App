import React, { useState, useEffect } from 'react';
import { StatusBar, StyleSheet, View, TouchableWithoutFeedback, Text, Image } from 'react-native'; // Image 추가
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './LoginScreen';
import SignUpScreen from './SignUpScreen';
import MainScreen from './MainScreen';
import AdminScreen from './AdminScreen';

const Stack = createStackNavigator();

// 이미지 경로를 import합니다.
const adImage = require('./assets/ad.PNG');

export default function App() {
  const [statusBarVisible, setStatusBarVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setStatusBarVisible(false);
    }, 3000); // 3초 후에 상태 표시줄 숨기기

    return () => clearTimeout(timer); // 컴포넌트 언마운트 시 타이머 정리
  }, []);

  const handleTouch = () => {
    setStatusBarVisible(true);
    const timer = setTimeout(() => {
      setStatusBarVisible(false);
    }, 3000); // 3초 후에 상태 표시줄 숨기기
  };

  return (
    <TouchableWithoutFeedback onPress={handleTouch}>
      <View style={styles.container}>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ title: '로그인' }}
            />
            <Stack.Screen
              name="SignUp"
              component={SignUpScreen}
              options={{ title: '회원가입' }}
            />
            <Stack.Screen 
              name='Main'
              component={MainScreen}
              options={{ title: '메인화면' }}
            />
            <Stack.Screen 
              name="AdminScreen"
              component={AdminScreen}
              options={{ title: '관리자 페이지' }}
            />
          </Stack.Navigator>
          <StatusBar hidden={!statusBarVisible} />
        </NavigationContainer>
        
        {/* 광고창 */}
        <View style={styles.adContainer}>
          <Image source={adImage} style={styles.adImage} />
          <View style={styles.adContent}>
            <Text style={styles.adText}>여기 광고가 들어갑니다!</Text>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  adContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100, // 광고창 높이
    backgroundColor: '#ffcc00', // 광고창 배경색
    justifyContent: 'center',
    alignItems: 'center'
  },
  adImage: {
    width: '100%', // 이미지 너비를 광고창에 맞춥니다.
    height: '100%', // 이미지 높이를 광고창에 맞춥니다.
    resizeMode: 'cover', // 이미지를 커버 모드로 설정
  },
  adContent: {
    // 광고 내용을 위한 스타일
  },
  adText: {
    fontSize: 16,
    color: '#000',
  },
});
