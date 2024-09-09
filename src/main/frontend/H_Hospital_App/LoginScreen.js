import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Button, TextInput } from 'react-native';
import * as Device from 'expo-device';

export default function LoginScreen({ navigation }) {

  // 로그인 시 사용할 상태 정의 
  const [member, setMember] = useState({
    email : '',
    memPw : ''
  });

  //상태를 업데이트 하는 핸들러 함수
  const handleChange = (field, value) => {
    setMember(prevState => ({
      ...prevState,
      [field] : value
    }));
  }

  //자바에서 데이터 받아오기
  useEffect(() => {
    axios.get("http://192.168.30.77:8080/member/memberList")
      .then((res) => {
        console.log(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>로그인 화면</Text>

      {/* 사용자 이메일 입력 필드 */}
      <TextInput
        style={styles.input}
        placeholder='이메일을 입력하십시오.'
        value={member.email}
        onChangeText={(text) => handleChange('email', text)}
        keyboardType='default' 
      />

      {/* 비밀번호 입력 필드 */}
      <TextInput 
        style={styles.input}
        placeholder='비밀번호를 입력하십시오.'
        secureTextEntry={true} 
        value={member.memPw}
        onChangeText={(text) => handleChange('memPw', text)}
        keyboardType="default" 
      />

      {/* 버튼들을 감싸는 View */}
      <View style={styles.buttonContainer}>
        <Button
          title="로그인"
          onPress={() => navigation.navigate('Main')}
        />
        <Button
          title="회원가입으로 이동"
          onPress={() => navigation.navigate('SignUp')}
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
  },
  text: {
    fontSize: 24, 
    marginBottom: 20, 
  },
  input: {
    height: 40, 
    borderColor: 'gray', 
    borderWidth: 1, 
    marginBottom: 15, 
    width: '80%', 
    paddingHorizontal: 10, 
  },
  // 버튼 컨테이너 스타일 추가
  buttonContainer: {
    flexDirection: 'row', // 버튼들을 가로로 배치
    justifyContent: 'space-around', // 버튼 사이의 간격을 균등하게 설정
    width: '50%', // 전체 컨테이너의 너비 설정
  }
});
