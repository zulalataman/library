package com.library.library.repository;

import com.library.library.model.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MemberRepository extends JpaRepository<Member, Long> {

    List<Member> findByMemberNameContainingIgnoreCase(String memberName);

    @Query("SELECT m FROM Member m WHERE upper(m.memberName || m.memberLastName) LIKE upper(concat('%', :searchTerm, '%'))")
    List<Member> findByMemberNameOrMemberLastNameContainingIgnoreCase(@Param("searchTerm") String searchTerm);
}
