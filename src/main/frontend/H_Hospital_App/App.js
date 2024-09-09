import React, { useState, useEffect } from 'react';
import { StatusBar, StyleSheet, View, TouchableWithoutFeedback } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './LoginScreen';
import SignUpScreen from './SignUpScreen';
import MainScreen from './MainScreen';

const Stack = createStackNavigator();

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
            options={{title: '메인화면'}}
          />
        </Stack.Navigator>
        <StatusBar hidden={!statusBarVisible} />
      </NavigationContainer>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  
});
