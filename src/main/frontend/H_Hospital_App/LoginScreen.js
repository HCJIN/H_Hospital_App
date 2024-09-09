import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Button, TextInput } from 'react-native';
import * as Location from 'expo-location';

export default function LoginScreen({ navigation }) {
  const [member, setMember] = useState({ email: '', memPw: '' });
  const [memberData, setMemberData] = useState({});
  const [currentLocation, setCurrentLocation] = useState(null);

  const handleChange = (field, value) => {
    setMember(prevState => ({ ...prevState, [field]: value }));
  };

  useEffect(() => {
    if (memberData && memberData.memName) {
      alert(memberData.memName + ' 환영합니다.');
    }
  }, [memberData]);

  useEffect(() => {
    if (currentLocation && memberData.userId) {
      updateLocation(memberData.userId, currentLocation.latitude, currentLocation.longitude);
    }
  }, [currentLocation]);

  const selectMemberInfo = async () => {
    try {
      const response = await axios.get("https://ab7a-58-151-101-222.ngrok-free.app/member/getMember", {
        params: { email: member.email, memPw: member.memPw }
      });

      if (response.data && response.data.memName) {
        setMemberData(response.data);
        await getLocation(); // 위치 가져오기
        navigation.navigate('Main'); // 로그인 성공 시 이동
      } else {
        alert('로그인에 실패하였습니다.');
      }
    } catch (error) {
      alert('로그인에 실패하였습니다.');
      console.log('Error:', error.response ? error.response.data : error.message);
    }
  };

  const getLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      alert('위치 권한이 거부되었습니다.');
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    setCurrentLocation({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude
    });
  };

  const updateLocation = async (userId, latitude, longitude) => {
    try {
      const response = await axios.post("https://ab7a-58-151-101-222.ngrok-free.app/location/updateLocation", {
        deviceId: 'your-device-id', // 실제 디바이스 ID로 교체 필요
        userId: userId,
        latitude: latitude,
        longitude: longitude
      });

      if (response.status === 200) {
        console.log('Location updated successfully');
      } else {
        alert('위치 업데이트 실패');
      }
    } catch (error) {
      console.error('Error updating location:', error);
    }
  };

  

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
        <Button
          title="회원가입으로 이동"
          onPress={() => navigation.navigate('SignUp')}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 24, marginBottom: 20 },
  input: { height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 15, width: '80%', paddingHorizontal: 10 },
  buttonContainer: { flexDirection: 'row', justifyContent: 'space-around', width: '50%' }
});
