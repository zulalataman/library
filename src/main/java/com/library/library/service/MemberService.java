package com.library.library.service;

import com.library.library.model.Book;
import com.library.library.model.Member;
import com.library.library.repository.MemberRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MemberService {

    private final MemberRepository memberRepository;

    @Autowired
    public MemberService(MemberRepository memberRepository) {
        this.memberRepository = memberRepository;
    }

    public List<Member> getAllMembers() {
        return memberRepository.findAll();
    }

    public Member addMember(Member member) {
        return memberRepository.save(member);
    }

    public String deleteMembers(List<Long> memberIds) {
        for (Long memberId : memberIds) {
            memberRepository.deleteById(memberId);
        }
        return "{\"message\":\"Seçilen üye(ler) silindi!!\"}";
    }

    public Optional<Member> getMemberById(Long memberId) {
        return memberRepository.findById(memberId);
    }

    public Member updateMember(Long memberId, Member newMember) {
        Member currentMember = memberRepository.getReferenceById(memberId);
        currentMember.setMemberName(newMember.getMemberName());
        currentMember.setMemberLastName(newMember.getMemberLastName());
        currentMember.setMemberAge(newMember.getMemberAge());
        return memberRepository.save(currentMember);
    }

    public List<Member> searchMembersByPartialName(String partialMemberName) {
        return memberRepository.findByMemberNameContainingIgnoreCase(partialMemberName);
    }

    public List<Member> searchMembersByPartialNameOrLastName(String searchTerm) {
        return memberRepository.findByMemberNameOrMemberLastNameContainingIgnoreCase(searchTerm);
    }

}
