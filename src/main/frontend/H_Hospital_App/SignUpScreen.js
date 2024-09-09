import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Button, TextInput } from 'react-native';

// SignUpScreen 컴포넌트를 정의합니다.
export default function SignUpScreen({ navigation }) {

  // 회원 가입할 때 사용할 상태를 정의합니다.
  const [regMember, setRegMember] = useState({
    memName: '',
    email: '',
    memTel: '',
    memPw: ''
  });

  // 상태를 업데이트하는 핸들러 함수입니다.
  const handleChange = (field, value) => {
    // prevState를 이용해 이전 상태를 가져옵니다. 이전 상태의 모든 필드를 유지하면서 특정 필드만 업데이트합니다.
    setRegMember(prevState => ({
      // spread 연산자를 사용하여 이전 상태 객체를 복사합니다.
      ...prevState,
      
      // 전달받은 field 파라미터를 키로 사용하고, 전달받은 value 파라미터를 값으로 설정하여 상태를 업데이트합니다.
      [field]: value
    }));
  };
  console.log(regMember)

  useEffect(()=>{
    axios
    .get()
    .then()
    .catch()
  },[])

  return (
    <View style={styles.container}>
      {/* 회원가입 화면을 나타내는 텍스트입니다. */}
      <Text style={styles.text}>회원 정보를 입력하십시오.</Text>

      {/* 사용자 이름 입력 필드 */}
      <TextInput 
        style={styles.input}
        placeholder='이름을 입력하십시오.'
        value={regMember.memName}
        onChangeText={(text) => handleChange('memName', text)}
        keyboardType="default" // 기본 키보드 타입 설정 (한글 포함) 
      />

      {/* 이메일 입력 필드 */}
      <TextInput 
        style={styles.input}
        placeholder='이메일을 입력하십시오.'
        value={regMember.email}
        onChangeText={(text) => handleChange('email', text)}
        keyboardType="email-address" // 이메일 입력에 적합한 키보드 설정 
      />

      {/* 전화번호 입력 필드 */}
      <TextInput 
        style={styles.input}
        placeholder='전화번호를 입력하십시오.'
        value={regMember.memTel}
        onChangeText={(text) => handleChange('memTel', text)}
        keyboardType="phone-pad" // 전화번호 입력에 적합한 키보드 설정 
      />

      {/* 비밀번호 입력 필드 */}
      <TextInput 
        style={styles.input}
        placeholder='비밀번호를 입력하십시오.'
        secureTextEntry={true} // 비밀번호 입력 시 문자를 숨깁니다.
        value={regMember.memPw}
        onChangeText={(text) => handleChange('memPw', text)}
        keyboardType="default" // 기본 키보드 설정
      />

      {/* 회원가입 버튼 */}
      <Button
        title="회원가입"
        // 버튼 클릭 시 'Login' 화면으로 이동합니다.
        onPress={() => navigation.navigate('Login')}
      />
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