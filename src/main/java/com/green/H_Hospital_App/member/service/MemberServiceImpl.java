package com.green.H_Hospital_App.member.service;

import com.green.H_Hospital_App.member.vo.MemberVO;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service("memberService")
public class MemberServiceImpl implements MemberService{

    @Autowired
    private SqlSessionTemplate sqlSession;

    @Override
    public MemberVO getMember(String email, String memPw) {
        // 파라미터를 Map 객체로 묶기
        Map<String, Object> params = new HashMap<>();

        // params 변수에 email, memPw 데이터 넣기
        params.put("email", email);
        params.put("memPw", memPw);

        // selectOne 호출 시 파라미터로 Map 객체 전달
        return sqlSession.selectOne("memberMapper.getMember", params);
    }

    // 회원가입시 데이터를 받아오는 메서드
    @Override
    public void insertMember(MemberVO memberVO) {
        sqlSession.insert("memberMapper.insertMember", memberVO);
    }

}
