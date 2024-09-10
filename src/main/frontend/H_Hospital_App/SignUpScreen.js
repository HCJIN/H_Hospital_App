import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import React, { useState } from 'react';
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

  // 회원가입시 자바로 데이터를 보내는 함수
  function insertMemberData(){
    // const apiUrl = 'https://192.168.30.77:8080/member/insertMember'; // HTTPS 주소
  
    axios.post('https://5463-58-151-101-222.ngrok-free.app/member/insertMember', regMember)
    .then((res) => {
      alert('회원가입이 완료되었습니다.');
      navigation.navigate('Login');
    })
    .catch((error) => {
      console.log(error)
    })  
  }

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
        autoCapitalize='none'
        spellCheck={false}
        autoCorrect={false}
        keyboardType="default" // 기본 키보드 타입 설정 (한글 포함) 
      />

      {/* 이메일과 버튼을 가로로 배치하는 View */}
      <View style={styles.emailContainer}>
        <TextInput 
          style={styles.emailInput}
          placeholder='이메일을 입력하십시오.'
          value={regMember.email}
          onChangeText={(text) => handleChange('email', text)}
          autoCapitalize='none'
          spellCheck={false}
          autoCorrect={false}
          keyboardType="email-address"
        />
        <Button 
          title="확인" 
          // onPress={() => console.log('이메일 확인 버튼 클릭')}
        />
      </View>

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
        autoCapitalize='none'
        spellCheck={false}
        autoCorrect={false}
        keyboardType="default" // 기본 키보드 설정
      />

      {/* 회원가입 버튼 */}
      <Button
        title="회원가입"
        // 버튼 클릭 시 'Login' 화면으로 이동합니다.
        onPress={() => insertMemberData()}
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
  emailContainer: {
    flexDirection: 'row', // 이메일 입력 필드와 버튼을 가로로 배치
    alignItems: 'center', // 세로 방향으로 정렬
    width: '80%', // 컨테이너의 너비 설정
    marginBottom: 15
  },
  emailInput: {
    flex: 1, // 입력 필드가 가능한 많은 공간을 차지하도록 설정
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginRight: 10, // 입력 필드와 버튼 사이의 간격 설정
    paddingHorizontal: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
  },
});