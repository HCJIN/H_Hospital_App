import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import React, { useState } from 'react';
import { StyleSheet, Text, View, Button, TextInput, Alert } from 'react-native';
import { exteral_ip } from './exteral_ip';

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
    setRegMember(prevState => ({
      ...prevState,
      [field]: value
    }));
  };

  console.log(regMember); // 현재 상태를 콘솔에 출력합니다.

  // 유효성 검사 함수
  const validateInputs = () => {
    const { memName, email, memTel, memPw } = regMember;

    // 이름 유효성 검사
    if (!memName) {
      Alert.alert('이름을 입력하십시오.'); // 이름이 비어있는 경우 경고
      return false;
    }

    // 이메일 유효성 검사
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // 이메일 정규 표현식
    if (!email || !emailRegex.test(email)) {
      Alert.alert('유효한 이메일 주소를 입력하십시오.'); // 유효하지 않은 이메일의 경우 경고
      return false;
    }

    // 전화번호 유효성 검사
    if (!memTel || memTel.length < 10) {
      Alert.alert('유효한 전화번호를 입력하십시오. 최소 10자리 숫자여야 합니다.'); // 전화번호가 유효하지 않은 경우 경고
      return false;
    }

    // 비밀번호 유효성 검사 (8자리 이상)
    if (!memPw || memPw.length < 8) {
      Alert.alert('비밀번호는 최소 8자 이상이어야 합니다.'); // 비밀번호가 8자리 미만인 경우 경고
      return false;
    }

    return true; // 모든 유효성 검사를 통과하면 true 반환
  };

  // 회원가입시 자바로 데이터를 보내는 함수
  const insertMemberData = () => {
    if (!validateInputs()) return; // 유효성 검사를 통과하지 않으면 종료

    // 회원가입 요청을 서버에 전송합니다.
    axios.post(`${exteral_ip}/member/insertMember`, regMember)
      .then((res) => {
        alert('회원가입이 완료되었습니다.'); // 성공 메시지
        navigation.navigate('Login'); // 로그인 화면으로 이동
      })
      .catch((error) => {
        console.log(error); // 오류 로그
        Alert.alert('회원가입에 실패했습니다. 다시 시도해 주세요.'); // 실패 메시지
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>회원 정보를 입력하십시오.</Text>

      {/* 사용자 이름 입력 필드 */}
      <TextInput 
        style={styles.input}
        placeholder='이름을 입력하십시오.'
        value={regMember.memName}
        onChangeText={(text) => handleChange('memName', text)} // 이름 변경 시 상태 업데이트
        autoCapitalize='none'
        spellCheck={false}
        autoCorrect={false}
        keyboardType="default"
      />

      {/* 이메일 입력 필드와 확인 버튼을 가로로 배치 */}
      <View style={styles.emailContainer}>
        <TextInput 
          style={styles.emailInput}
          placeholder='이메일을 입력하십시오.'
          value={regMember.email}
          onChangeText={(text) => handleChange('email', text)} // 이메일 변경 시 상태 업데이트
          autoCapitalize='none'
          spellCheck={false}
          autoCorrect={false}
          keyboardType="email-address"
        />
        <Button 
          title="확인" // 이메일 확인 버튼
        />
      </View>

      {/* 전화번호 입력 필드 */}
      <TextInput 
        style={styles.input}
        placeholder='전화번호를 입력하십시오.'
        value={regMember.memTel}
        onChangeText={(text) => handleChange('memTel', text)} // 전화번호 변경 시 상태 업데이트
        keyboardType="phone-pad"
      />

      {/* 비밀번호 입력 필드 */}
      <TextInput 
        style={styles.input}
        placeholder='비밀번호를 입력하십시오.'
        secureTextEntry={true} // 비밀번호 입력 시 문자를 숨깁니다.
        value={regMember.memPw}
        onChangeText={(text) => handleChange('memPw', text)} // 비밀번호 변경 시 상태 업데이트
        autoCapitalize='none'
        spellCheck={false}
        autoCorrect={false}
        keyboardType="default"
      />

      {/* 회원가입 버튼 */}
      <Button
        title="회원가입"
        onPress={() => insertMemberData()} // 버튼 클릭 시 회원가입 데이터 전송
      />
    </View>
  );
}

// 컴포넌트의 스타일을 정의합니다.
const styles = StyleSheet.create({
  container: {
    flex: 1, // 전체 화면 사용
    justifyContent: 'center', // 수직 방향 중앙 정렬
    alignItems: 'center', // 수평 방향 중앙 정렬
  },
  text: {
    fontSize: 24, // 텍스트 크기 설정
    marginBottom: 20, // 텍스트와 버튼 사이의 간격 설정
  },
  input: {
    height: 40, // 입력 필드 높이 설정
    borderColor: 'gray', // 입력 필드 테두리 색상 설정
    borderWidth: 1, // 입력 필드 테두리 두께 설정
    marginBottom: 15, // 입력 필드 사이 간격 설정
    width: '80%', // 입력 필드 너비 설정
    paddingHorizontal: 10, // 좌우 패딩 설정
  },
  emailContainer: {
    flexDirection: 'row', // 이메일 입력 필드와 버튼 가로 배치
    alignItems: 'center', // 세로 방향 정렬
    width: '80%', // 컨테이너 너비 설정
    marginBottom: 15, // 간격 설정
  },
  emailInput: {
    flex: 1, // 입력 필드가 가능한 많은 공간 차지
    height: 40, // 입력 필드 높이 설정
    borderColor: 'gray', // 입력 필드 테두리 색상 설정
    borderWidth: 1, // 입력 필드 테두리 두께 설정
    marginRight: 10, // 입력 필드와 버튼 사이의 간격 설정
    paddingHorizontal: 10, // 좌우 패딩 설정
  },
});
