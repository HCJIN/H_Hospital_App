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

  // 로그인에 성공 했을 시 받아오는 데이터
  const[memberData, setMemberData] = useState([])

  //상태를 업데이트 하는 핸들러 함수
  const handleChange = (field, value) => {
    setMember(prevState => ({
      ...prevState,
      [field] : value
    }));
  }

  useEffect(() => {
    if (memberData.memName) {
      alert(memberData.memName + ' 환영합니다.');
    }
  }, [memberData]);
  
  // 자바에서 데이터 받아오기
  function selectMemberInfo(){
    axios.get("http://localhost:8080/member/getMember", {
      params: {
        email: member.email,
        memPw: member.memPw
      }
    })
    .then((res) => {
      // 서버에서 반환된 데이터가 있는지 확인 (예: null, undefined, 빈 객체 체크)
      if (res.data && res.data.memName) {
        setMemberData(res.data); // 상태 업데이트
        navigation.navigate('Main'); // 로그인 성공 시 이동
      } else {
        alert('로그인에 실패하였습니다.'); // 데이터가 없을 경우 오류 메시지 출력
      }
    })
    .catch((error) => {
      alert('로그인에 실패하였습니다.');
      console.log(error);
    });
  };

  console.log(memberData)

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
          onPress={() => selectMemberInfo()}
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
