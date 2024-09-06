import React, { useState, useEffect } from 'react';
import { StatusBar, StyleSheet, Text, View, TouchableWithoutFeedback } from 'react-native';

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
        <View style={styles.headerContainer}>
          <View style={styles.spanWrapper}>
            <Text style={styles.span}>로그인</Text>
          </View>
          <View style={styles.spanWrapper}>
            <Text style={styles.span}>회원가입</Text>
          </View>
        </View>
        <Text>Open up App.js to start working on your app!</Text>
        <StatusBar hidden={!statusBarVisible} />
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerContainer: {
    width: '100%', // 헤더가 화면의 전체 너비를 차지하도록 설정
    backgroundColor: '#f0f0f0', // 헤더의 배경색
    padding: 10, // 패딩을 추가하여 헤더와 내용 사이에 여백 추가
    position: 'absolute',
    top: 0,
    left: 0,
    alignItems: 'center', // 텍스트를 가운데 정렬
    flexDirection: 'row', // 텍스트가 가로로 정렬되도록 설정
  },
  header: {
    width: '90%',
    fontSize: 24,
    fontWeight: 'bold',
    flexDirection: 'row', // 텍스트가 가로로 정렬되도록 설정
  },
  spanWrapper: {
    marginLeft: 10, // 왼쪽에만 마진 추가
  },
  span: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
