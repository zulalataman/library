package com.library.library.repository;

import com.library.library.model.Staff;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface StaffRepository extends JpaRepository<Staff, Long> {
    List<Staff> findByStaffNameContainingIgnoreCase(String staffName);

    @Query("SELECT s FROM Staff s WHERE upper(s.staffName || s.staffLastName) LIKE upper(concat('%', :searchTerm, '%'))")
    List<Staff> findByStaffNameOrStaffLastNameContainingIgnoreCase(@Param("searchTerm") String searchTerm);
}
