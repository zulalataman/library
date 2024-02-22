package com.library.library.controller;

import com.library.library.model.Member;
import com.library.library.service.MemberService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/member")
public class MemberController {

    private final MemberService memberService;

    @Autowired
    public MemberController(MemberService memberService) {
        this.memberService = memberService;
    }

    @GetMapping("/members")
    public List<Member> listMembers() {
        return memberService.getAllMembers();
    }

    @PostMapping("/addmember")
    public Member saveMember(@RequestBody Member member) {
        return memberService.addMember(member);
    }

    @DeleteMapping("/deletemember/{memberIds}")
    public String deleteMember(@PathVariable List<Long> memberIds) {
        return memberService.deleteMembers(memberIds);
    }

    @PutMapping("/updatemember/{memberId}")
    public Member updateMember(@PathVariable Long memberId, @RequestBody Member newMember) {
        return memberService.updateMember(memberId, newMember);
    }

    @GetMapping("/getMember/{memberId}")
    public Optional<Member> getMember(@PathVariable Long memberId) {
        return memberService.getMemberById(memberId);
    }

    @GetMapping("/searchByPartialName/{partialMemberName}")
    public List<Member> searchMembersByPartialName(@PathVariable String partialMemberName) {
        return memberService.searchMembersByPartialName(partialMemberName);
    }

    @GetMapping("/search")
    public List<Member> searchMembers(@RequestParam(name = "searchTerm") String searchTerm) {
        return memberService.searchMembersByPartialNameOrLastName(searchTerm);
    }
}
