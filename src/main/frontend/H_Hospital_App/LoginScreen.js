import React, { useState } from 'react';
import { StyleSheet, Text, View, Button, TextInput } from 'react-native';

export default function LoginScreen({ navigation }) {

  // 로그인 시 사용할 상태 정의 
  const [member, setMember] = useState({
    email : '',
    memPw : ''
  });

  //상태를 업데이트 하는 핸들러 함수
  const handleChange = (field, value) => {
    //prevState를 이용해 이전 상태를 가져옴. 이전 상태의 모든 필드를 유지하면서 특정 필드만 업데이트
    setMember(prevState => ({
      //전개연산자를 사용하여 이전 상태 객체를 복사
      ...prevState,

      //전달받은 field 파라미터를 키로 사용하고, 전달받은 value 파라미터를 값으로 설정하여 상태를 업데이트
      [field] : value
    }))
  }

  console.log(member)


  return (
    <View style={styles.container}>
      <Text style={styles.text}>로그인 화면</Text>

      {/* 사용자 이메일 입력 필드 */}
      <TextInput
        style={styles.input}
        placeholder='이메일을 입력하십시오.'
        value={member.email}
        onChangeText={(text) => handleChange('email', text)}
        keyboardType='default' //기본 쿼티키보드
      />

      {/* 비밀번호 입력 필드 */}
      <TextInput 
        style={styles.input}
        placeholder='비밀번호를 입력하십시오.'
        secureTextEntry={true} // 비밀번호 입력 시 문자를 숨깁니다.
        value={member.memPw}
        onChangeText={(text) => handleChange('memPw', text)}
        keyboardType="default" // 기본 키보드 설정
      />

      <Button
        title="회원가입으로 이동"
        onPress={() => navigation.navigate('SignUp')}
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
