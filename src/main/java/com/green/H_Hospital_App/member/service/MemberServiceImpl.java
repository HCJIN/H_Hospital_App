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
    public void insertMember(MemberVO memberVO) {
        sqlSession.insert("memberMapper.insertMember", memberVO);
    }

    @Override
    public MemberVO getMember(MemberVO memberVO) {
        return sqlSession.selectOne("memberMapper.getMember",memberVO);
    }

    @Override
    public boolean selectEmail(String email) {
        int count = sqlSession.selectOne("memberMapper.selectEmail", email);
        return count > 0;  // 이메일이 있으면 true 반환
    }

    @Override
    public void loginInsert(MemberVO memberVO) {
        sqlSession.update("memberMapper.loginInsert",memberVO);
    }

    @Override
    public MemberVO getMemberByEmail(String email) {
        return sqlSession.selectOne("memberMapper.getMemberByEmail", email);
    }

    @Override
    public List<MemberVO> getMemberInfo(String deviceId) {
        return sqlSession.selectList("memberMapper.getMemberInfo", deviceId);
    }

}
