package com.green.H_Hospital_App.member.service;

import com.green.H_Hospital_App.member.vo.MemberVO;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service("memberService")
public class MemberServiceImpl implements MemberService{

    @Autowired
    private SqlSessionTemplate sqlSession;


    @Override
    public List<MemberVO> getMemberList() {
        return sqlSession.selectList("memberMapper.getMemberList");
    }

    // 회원가입시 데이터를 받아오는 메서드
    @Override
    public void insertMember(MemberVO memberVO) {
        sqlSession.insert("memberMapper.insertMember", memberVO);
    }
}
