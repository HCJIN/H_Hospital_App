import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Button, TextInput } from 'react-native';
import * as Location from 'expo-location';
import * as Device from 'expo-device'; // 추가된 부분
import { exteral_ip } from './exteral_ip';
import { mainBG } from './backgroundImage';

export default function LoginScreen({ navigation }) {
  const [member, setMember] = useState({ email: '', memPw: '' });
  const [memberData, setMemberData] = useState({});
  const [deviceId, setDeviceId] = useState(''); // 추가된 부분
  const [currentLocation, setCurrentLocation] = useState({
    latitude: 37.5665,
    longitude: 126.978
  });

  const handleChange = (field, value) => {
    setMember(prevState => ({ ...prevState, [field]: value }));
  };

  useEffect(() => {
    if (memberData && memberData.memName) {
      alert(memberData.memName + ' 환영합니다.');
    }
  }, [memberData]);


  useEffect(() => {
    setDeviceId(Device.osBuildId || 'default-device-id');
    getLocation();
  }, []);
  
  // 내 위치 가져오기
  const getLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert('위치 권한이 거부되었습니다.');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      console.log('Current location:', location);
      setCurrentLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      });
    } catch (error) {
      console.error('Error getting location:', error);
    }
  };

  // 로그인 버튼 클릭 시 실행 함수
const selectMemberInfo = async () => {
  // 이메일과 비밀번호가 비어 있으면 알림 표시
  if (!member.email || !member.memPw) {
    alert('이메일과 비밀번호를 입력해주세요.');
    return;
  }

  // 로그인 기능 시작 (POST 요청)
  axios.post(`${exteral_ip}/member/getMember`, {
    email: member.email, 
    memPw: member.memPw,
    deviceId: deviceId,
    latitude: currentLocation.latitude,
    longitude: currentLocation.longitude
  }, {
    withCredentials: true
  })
  .then((res) => {
    // 로그인 성공
    if (res.data != null) {
      // 조회한 로그인 정보를 memberData 변수에 저장
      setMemberData(res.data);

      // 로그인한 유저의 권한에 따라 페이지 이동
      if (res.data.memRole === 'ADMIN') {
        console.log('go AdminScreen');
        navigation.navigate('AdminScreen');
      } else {
        console.log('go Main');
        navigation.navigate('Main');
      }
    } 
    // 로그인 실패
    else {
      alert('로그인에 실패하였습니다.');
    }
  })
  .catch((error) => {
    console.log('로그인 에러:', error);
  });
};


  // const getLocation = async () => {
  //   let { status } = await Location.requestForegroundPermissionsAsync();
  //   if (status !== 'granted') {
  //     alert('위치 권한이 거부되었습니다.');
  //     return;
  //   }

  //   let location = await Location.getCurrentPositionAsync({});
  //   console.log('Current location:', location.coords); // 위치 확인
  //   setCurrentLocation({
  //     latitude: location.coords.latitude,
  //     longitude: location.coords.longitude
  //   });
  // };


return (
    <View style={styles.container}>
      <Text style={styles.text}>로그인 화면</Text>
      <TextInput
        style={styles.input}
        placeholder='이메일을 입력하십시오.'
        value={member.email}
        onChangeText={(text) => handleChange('email', text)}
        keyboardType='default'
      />
      <TextInput
        style={styles.input}
        placeholder='비밀번호를 입력하십시오.'
        secureTextEntry={true}
        value={member.memPw}
        onChangeText={(text) => handleChange('memPw', text)}
        keyboardType="default"
      />
      <View style={styles.buttonContainer}>
        <Button
          title="로그인"
          onPress={() => selectMemberInfo()}
        />
      </View>
      <View style={styles.buttonContainer}>
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
    padding: 20, // 여백 추가
    backgroundColor: '#fff' // 배경색 추가 (iOS 기본 색상)
  },
  text: {
    fontSize: 28, // 폰트 크기 증가
    marginBottom: 30, // 간격 증가
    fontWeight: 'bold', // 두꺼운 글꼴
    textAlign: 'center' // 중앙 정렬
  },
  input: {
    height: 50,
    borderColor: '#ccc', // 경계 색상 변경
    borderWidth: 1,
    borderRadius: 8, // 모서리 둥글게
    marginBottom: 15,
    width: '100%', // 입력 필드 너비 100%
    paddingHorizontal: 15, // 안쪽 여백 추가
    fontSize: 16 // 폰트 크기 증가
  },
  buttonContainer: {
    width: '100%', // 버튼 컨테이너 너비 100%
    marginVertical: 10, // 버튼 간격 추가
  }
});
