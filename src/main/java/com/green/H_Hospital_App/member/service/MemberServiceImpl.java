package com.green.H_Hospital_App.member.service;

import com.green.H_Hospital_App.member.vo.MemberVO;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service("memberService")
public class MemberServiceImpl implements MemberService{

    @Autowired
    private SqlSessionTemplate sqlSession;

    @Override
    public MemberVO getMember(String email, String memPw) {
        Map<String, Object> params = new HashMap<>();
        params.put("email", email);
        params.put("memPw", memPw);
        return sqlSession.selectOne("memberMapper.getMember", params);
    }

    @Override
    public void insertMember(MemberVO memberVO) {
        sqlSession.insert("memberMapper.insertMember", memberVO);
    }

    @Override
    public void updateLocation(String email, double latitude, double longitude) {
        System.out.println("Updating location with: email=" + email + ", latitude=" + latitude + ", longitude=" + longitude);
        Map<String, Object> params = new HashMap<>();
        params.put("email", email);
        params.put("latitude", latitude);
        params.put("longitude", longitude);
        int rowsAffected = sqlSession.update("memberMapper.updateLocation", params);
        System.out.println("Rows affected: " + rowsAffected);
    }
}
